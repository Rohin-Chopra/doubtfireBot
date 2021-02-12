'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserTask extends Model {}
  UserTask.init(
    {
      status: DataTypes.STRING
    },
    {
      underscored: true,
      sequelize,
      modelName: 'UserTask',
      freezeTableName: true,
      tableName: 'User_Tasks'
    }
  )
  return UserTask
}
