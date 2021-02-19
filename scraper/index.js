require('dotenv').config({})
const cron = require('node-cron')
const sequelize = require('@Rohin1212/doubtfire-bot-sequelize')
const scrape = require('./scrape')
const { yellow } = require('chalk')

scrape(sequelize)

cron.schedule('*/15 * * * *', async () => {
  console.log(yellow('about to scrape'))
  await scrape(sequelize)
})
