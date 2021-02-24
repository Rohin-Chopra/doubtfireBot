'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.join(__dirname, '/../config/config.js'))[env]
const db = {}
const chalk = require('chalk')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions:
    process.env.NODE_ENV === 'production'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : undefined,
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
    const [
      res
    ] = await sequelize.query(
      "SELECT column_name \
FROM information_schema.columns \
WHERE table_name='User_Tasks' and column_name='task_unit_code'",
      { type: sequelize.SELECT }
    )
    if (res.length === 0) {
      console.log('creating a new user_tasks')
      await sequelize.query('DROP TABLE IF EXISTS public."User_Tasks"')
      const a = await sequelize.query(
        'CREATE TABLE "User_Tasks" (\
        "status" VARCHAR(255), \
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, \
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, \
        "task_name" VARCHAR(255) , \
        "task_unit_code" VARCHAR(255) , 	\
        "user_id" VARCHAR(255) REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, \
        PRIMARY KEY ("task_name","task_unit_code" ,"user_id"),\
        CONSTRAINT fk_task \
            FOREIGN KEY(task_name,task_unit_code) \
          REFERENCES "Tasks"(name,unit_code)\
      )'
      )
    } else {
      console.log(chalk.red('nah'))
    }
    console.log('database synced')
  } catch (error) {
    if (
      error.message ===
      'there is no unique constraint matching given keys for referenced table "Tasks"'
    ) {
      console.log('found')
      return
    }
    console.log(error)
    console.log(chalk.red('connection to Database FAILED'))
    process.exit(1)
  }
}

module.exports = db
