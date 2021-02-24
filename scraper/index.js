require('dotenv').config({})
const sequelize = require('@Rohin1212/doubtfire-bot-sequelize')
const OrdinalSuffixOf = require('./utils/ordinalNumber')
const scrape = require('./scrape')
const { green } = require('chalk')

// code
;(async () => {
  await sequelize.start()
  let timesRun = (await sequelize.Meta.findOne({ attributes: ['timesRun'] }))
    ?.dataValues?.timesRun

  if (!timesRun) {
    timesRun = (await sequelize.Meta.create({ timesRun: 0 })).dataValues
      .timesRun
  }
  timesRun = Number(timesRun) + 1

  await scrape(sequelize)

  await sequelize.Meta.update({ timesRun: timesRun }, { where: { id: 1 } })
  console.log(
    green(
      `this is the ${OrdinalSuffixOf(
        timesRun
      )} time scraper has been successfully run`
    )
  )
})()
