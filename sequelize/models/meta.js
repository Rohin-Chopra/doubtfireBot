'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Meta extends Model {}
  Meta.init(
    {
      timesRun: {
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize,
      modelName: 'Meta'
    }
  )
  return Meta
}
