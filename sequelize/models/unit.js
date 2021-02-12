'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    static associate(models) {
      this.belongsToMany(models.Task, {
        through: models.UnitTask,
        foreignKey: 'unit_code'
      })
      this.belongsToMany(models.User, {
        through: models.UserUnit,
        foreignKey: 'unit_code'
      })
    }
  }
  Unit.init(
    {
      name: DataTypes.STRING,
      code: { type: DataTypes.STRING, primaryKey: true },
      link: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Unit'
    }
  )
  return Unit
}
