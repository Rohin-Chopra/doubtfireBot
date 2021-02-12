'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      this.belongsToMany(models.Unit, {
        through: models.UnitTask,
        foreignKey: 'task_name'
      })
      this.belongsToMany(models.User, {
        through: models.UserTask,
        foreignKey: 'task_name'
      })
    }
  }
  Task.init(
    {
      name: { type: DataTypes.STRING, primaryKey: true }
    },
    {
      sequelize,
      modelName: 'Task'
    }
  )
  return Task
}
