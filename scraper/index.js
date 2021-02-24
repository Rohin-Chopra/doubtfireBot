require('dotenv').config({})
const sequelize = require('@Rohin1212/doubtfire-bot-sequelize')

const scrape = require('./scrape')
const { yellow } = require('chalk')

sequelize.start().then(() => {
  console.log(yellow('about to scrape'))
  scrape(sequelize)
})
