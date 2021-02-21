require('dotenv').config({})
const http = require('http')
const cron = require('node-cron')
const sequelize = require('@Rohin1212/doubtfire-bot-sequelize')
const scrape = require('./scrape')
const { yellow } = require('chalk')

http
  .createServer(function (req, res) {
    res.write('Hello World!')
    res.end()
  })
  .listen(process.env.PORT || 5000)

scrape(sequelize)

cron.schedule('*/15 * * * *', async () => {
  console.log(yellow('about to scrape'))
  await scrape(sequelize)
})
