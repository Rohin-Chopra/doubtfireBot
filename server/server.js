const dotenv = require('dotenv')
dotenv.config()

const sequelize = require('./../sequelize/models')

sequelize.start()

const app = require('./app')
const cron = require('node-cron')
const scrape = require('./../scraper')

const port = process.env.PORT || 3000

app.listen(port, () => {
  const { blue } = require('chalk')
  console.log(blue(`listening on port ${port}`))
})

cron.schedule('* * * * *', async () => {
  console.log('about to scrape')
  await scrape(sequelize)
})
