'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      this.belongsTo(models.Unit, {
        through: models.UnitTask,
        foreignKey: 'task_name'
      })
    }
  }
  Task.init(
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      unit_code: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Units',
          key: 'code'
        }
      }
    },
    {
      sequelize,
      modelName: 'Task'
    }
  )
  return Task
}
