require('dotenv').config()
const { blue, yellow } = require('chalk')
const cron = require('node-cron')

const sequelize = require('./../sequelize/models')
sequelize.start()

const app = require('./app')
const scrape = require('./../scraper')

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(blue(`listening on port ${port}`))
})

cron.schedule('* * * * *', async () => {
  console.log(yellow('about to scrape'))
  await scrape(sequelize)
})
