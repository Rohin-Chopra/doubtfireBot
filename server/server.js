if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
const { blue } = require('chalk')

const sequelize = require('@Rohin1212/doubtfire-bot-sequelize')
sequelize.start()

const app = require('./app')

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(blue(`listening on port ${port}`))
})
