'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserUnit extends Model {}
  UserUnit.init(
    {},
    {
      sequelize,
      modelName: 'UserUnit',
      freezeTableName: true,
      tableName: 'User_Units'
    }
  )
  return UserUnit
}
