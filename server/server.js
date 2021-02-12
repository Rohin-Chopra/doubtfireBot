const dotenv = require('dotenv')
dotenv.config()

const sequelize = require('./../sequelize/models')

sequelize.start()

const app = require('./app')
const cron = require('node-cron')
const scrape = require('./../scraper')

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

cron.schedule('* * * * *', async () => {
  console.log('about to scrape')
  await scrape(sequelize)
})
