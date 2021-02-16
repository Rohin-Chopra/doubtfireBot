const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const sendEmail = require('./../utils/email')

module.exports = async (sequelize) => {
  try {
    let $
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto('https://doubtfire.ict.swin.edu.au/#/home')

    const users = await sequelize.User.findAll({
      include: sequelize.Unit
    })
    let i = 0
    for await (const u of users) {
      const user = u.dataValues
      await login(user.id, u.decryptStudentPassword(), page)

      await page.waitForNavigation()
      await page.waitForSelector('.list-group-item')

      $ = cheerio.load(await page.content())

      const loadedUnits = loadUnits($)
      const units = await saveUnits(loadedUnits, u, sequelize)
      const tasks = await loadTasks(units, $, page)
      saveTasks(tasks, u, sequelize)
      i += 1
      if (i === users.length) {
        await browser.close()
        const { green } = require('chalk')
        console.log(green('done scraping'))
      }
    }
  } catch (error) {}
}

const login = async (username, password, page) => {
  await page.type('input[type=username]', username)
  await page.type('input[type=password]', password)
  await page.click('button[type=submit]')
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

const loadTasks = async (units, $, page) => {
  const tasks = []
  for await (const u of units) {
    const unit = u.dataValues
    await page.goto(`https://doubtfire.ict.swin.edu.au/${unit.link}`)
    await page.waitForSelector('.project-tasks-list')
    $ = cheerio.load(await page.content())
    const a = $('button', '.project-tasks-list')
    Object.keys(a).forEach((key) => {
      try {
        const element = a[key]
        tasks.push({
          name: element.children[2].data.trim(),
          status: element.attribs.class.split(' ')[3],
          unit: u
        })
      } catch (error) {
        if (error.name !== 'TypeError') {
          throw error
        }
      }
    })
  }
  return tasks
}

const saveTasks = (tasks, user, sequelize) => {
  tasks.forEach(async (task) => {
    try {
      const existingTask = await sequelize.Task.findOne({
        where: { name: task.name }
      })
      const existingTaskStatus = (
        await sequelize.UserTask.findOne({
          where: {
            task_name: task.name,
            user_id: user.dataValues.id
          }
        })
      )?.dataValues?.status

      if (!existingTask) {
        const createdTask = await sequelize.Task.create(task)
        await createdTask.addUnit(task.unit, { status: task.status })
        await createdTask.addUser(user)
      } else if (!(await existingTask.hasUser(user))) {
        await existingTask.addUser(user)
      } else if (existingTaskStatus !== task.status) {
        console.log('sending email')
        fs.readFile(
          path.join(__dirname, 'data/taskStatusChanged.txt'),
          'utf-8',
          (err, data) => {
            if (err) {
              console.log(err)
            }
            const message = data
              .replace('{TASKNAME}', task.name)
              .replace('{UNIT_NAME}', task.unit.code)
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

        await sequelize.UserTask.update(
          { status: task.status },
          {
            where: {
              task_name: task.name,
              user_id: user.dataValues.id
            }
          }
        )
      }
    } catch (error) {
      console.log(error)
    }
  })
}
