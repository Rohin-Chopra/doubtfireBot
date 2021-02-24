require('dotenv').config({})
const fs = require('fs')
const sequelize = require('@Rohin1212/doubtfire-bot-sequelize')
const OrdinalSuffixOf = require('./utils/ordinalNumber')
const scrape = require('./scrape')
const { yellow } = require('chalk')

let timesRun = 0

if (!fs.existsSync('./times-run.txt')) {
  fs.writeFile('./times-run.txt', String(timesRun), (err) => {
    if (err) {
      console.log(err)
    }
  })
} else {
  timesRun = fs.readFileSync('./times-run.txt', {
    encoding: 'utf8',
    flag: 'r'
  })
  fs.writeFile('./times-run.txt', String(Number(timesRun) + 1), (err) => {
    if (err) {
      console.log(err)
    }
  })
}
console.log(`this is the ${OrdinalSuffixOf(timesRun)} scraper has been called`)

sequelize.start().then(() => {
  console.log(yellow('about to scrape'))
  scrape(sequelize)
})
