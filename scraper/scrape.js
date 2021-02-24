const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const sendEmail = require('./utils/email')
const { red, green } = require('chalk')

module.exports = async (sequelize) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  })
  try {
    console.log('starting')
    let $
    const page = await browser.newPage()
    await page.goto('https://doubtfire.ict.swin.edu.au/#/home')

    const users = await sequelize.User.findAll({
      include: sequelize.Unit
    })
    for await (const u of users) {
      const user = u.dataValues
      await login(user.id, u.decryptStudentPassword(), page)

      await page.waitForNavigation()
      await page.waitForSelector('.list-group-item')

      $ = cheerio.load(await page.content())
      console.log('loading units')
      const loadedUnits = loadUnits($)
      const units = await saveUnits(loadedUnits, u, sequelize)
      const tasks = await loadTasks(units, $, page, browser)
      saveTasks(tasks, u, sequelize)
      await logout(page)
    }
    await page.close()
    console.log(green('done scraping'))
  } catch (error) {
    console.log(red(error))
  } finally {
    await browser.close()
  }
}

const login = async (username, password, page) => {
  console.log('logging in')
  await page.type('input[type=username]', username)
  await page.type('input[type=password]', password)
  await page.click('button[type=submit]')
}

const logout = async (page) => {
  await page.click('a.dropdown-toggle.ng-binding')
  await page.evaluate(() =>
    document
      .querySelector(
        'body > div:nth-child(1) > nav > div.collapse.navbar-collapse.ng-hide > ul > li.dropdown.open > ul > li:nth-child(6) > a'
      )
      .click()
  )
}
const loadUnits = ($) => {
  const units = []
  $('.list-group-item-heading', '.list-group-item')
    .toArray()
    .forEach((h4) => {
      units.push({
        name: h4.children[0].data,
        code: '',
        link: h4.parent.parent.attribs.href
      })
    })

  $('.label-info')
    .toArray()
    .forEach((label, index) => {
      if (index < units.length) {
        units[index].code = label.children[0].data
      }
    })
  return units
}

const saveUnits = async (loadedUnits, user, sequelize) => {
  const savedUnits = []

  for await (const loadedUnit of loadedUnits) {
    let didUnitExist = false
    for await (const userUnit of user.Units) {
      if (loadedUnit.code === userUnit.dataValues.code) {
        savedUnits.push(userUnit)
        didUnitExist = true
        break
      }
    }

    if (!didUnitExist) {
      const [createdUnit] = await sequelize.Unit.findOrCreate({
        where: { code: loadedUnit.code },
        defaults: { ...loadedUnit }
      })
      savedUnits.push(createdUnit)
      await createdUnit.addUser(user)
    }
  }

  return savedUnits
}

const loadTasks = async (units, $, page, browser) => {
  const tasks = []

  for await (const u of units) {
    const unit = u.dataValues
    await page.goto(`https://doubtfire.ict.swin.edu.au/${unit.link}`)
    await page.waitForSelector('.project-tasks-list')
    const parsedTasks = JSON.parse(
      await page.evaluate(
        'JSON.stringify(angular.element(document.querySelector("#projects-show > div > div.ng-scope > div.row > project-progress-dashboard > div > div.col-md-4.col-md-push-8 > div > div:nth-child(1) > div > div.panel-body > ul > div")).scope().relatedTasks)'
      )
    )
    parsedTasks.forEach((t) => {
      tasks.push({
        name: t.definition.abbreviation,
        status: t.status,
        unit_code: u.dataValues.code,
        dueDate: t.definition.due_date
      })
    })
  }

  return tasks
}

const saveTasks = (tasks, user, sequelize) => {
  tasks.forEach(async (task) => {
    try {
      const existingTask = await sequelize.Task.findOne({
        where: {
          name: task.name,
          unit_code: task.unit_code
        }
      })
      const existingUserTask = await sequelize.sequelize.query(
        `SELECT status FROM public.\"User_Tasks\" WHERE user_id = '${user.dataValues.id}' AND task_name = '${task.name}'  AND task_unit_code = '${task.unit_code}' `,
        { type: sequelize.sequelize.QueryTypes.SELECT }
      )
      if (!existingTask) {
        await sequelize.Task.create(task)
        await sequelize.sequelize.query(
          `INSERT INTO public."User_Tasks"(user_id,task_name,task_unit_code,status,created_at,updated_at) VALUES ('${
            user.dataValues.id
          }','${task.name}','${task.unit_code}','${
            task.status
          }',to_timestamp('${Date.now()}'/ 1000.0),to_timestamp('${Date.now()}'/ 1000.0))`,
          { type: sequelize.sequelize.QueryTypes.INSERT }
        )
      } else if (existingUserTask.length === 0) {
        await sequelize.sequelize.query(
          `INSERT INTO public."User_Tasks"(user_id,task_name,task_unit_code,status,created_at,updated_at) VALUES ('${
            user.dataValues.id
          }','${task.name}','${task.unit_code}','${
            task.status
          }',to_timestamp('${Date.now()}'/ 1000.0),to_timestamp('${Date.now()}'/ 1000.0))`,
          { type: sequelize.sequelize.QueryTypes.INSERT }
        )
      } else if (existingUserTask[0].status !== task.status) {
        fs.readFile(
          path.join(__dirname, 'data/taskStatusChanged.txt'),
          'utf-8',
          (err, data) => {
            if (err) {
              console.log(err)
            }
            const message = data
              .replace('{TASKNAME}', task.name)
              .replace('{UNIT_NAME}', task.unit_code)
              .replace('{NAME}', user.dataValues.first_name)
              .replace('{TASK_STATUS}', task.status)
            sendEmail({
              from: 'rohinpython@gmail.com',
              to: user.dataValues.email,
              subject: `Task ${task.name}'s status changed to ${task.status}`,
              text: message
            })
          }
        )
        await sequelize.sequelize.query(
          `UPDATE public."User_Tasks" SET status = '${task.status}' WHERE task_name = '${task.name}' AND task_unit_code = '${task.unit_code}' AND user_id = '${user.dataValues.id}'`
        )
      }
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      if (Math.round((tomorrow - task.dueDate) / (1000 * 60 * 60 * 24)) === 1) {
        fs.readFile(
          path.join(__dirname, 'data/taskDueDateNotfication.txt'),
          'utf-8',
          (err, data) => {
            if (err) {
              console.log(err)
            }

            const message = data
              .replace('{TASKNAME}', task.name)
              .replace('{UNIT_NAME}', task.unit_code)
              .replace('{NAME}', user.dataValues.first_name)
              .replace(
                '{TASK_DUE_DATE}',
                `${task.dueDate.getDate()}/${
                  task.dueDate.getMonth() + 1
                }/${task.dueDate.getFullYear()}`
              )
            sendEmail({
              from: 'rohinpython@gmail.com',
              to: user.dataValues.email,
              subject: `Task ${task.name}'s due date in 1 day`,
              text: message
            })
          }
        )
      }
    } catch (error) {
      console.log(error)
    }
  })
}
