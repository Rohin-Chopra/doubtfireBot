'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.join(__dirname, '/../config/config.js'))[env]
const db = {}
const chalk = require('chalk')

console.log(process.env.DATABASE_URL)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
})

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

db.start = async () => {
  try {
    await sequelize.authenticate()
    console.log(chalk.green('database connected'))
    await sequelize.sync()
  } catch (error) {
    console.log(chalk.red('connection to Database FAILED'))
    process.exit(1)
  }
}

module.exports = db
