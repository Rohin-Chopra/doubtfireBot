'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UnitTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UnitTask.init(
    {},
    {
      sequelize,
      modelName: 'UnitTask',
      freezeTableName: true,
      tableName: 'Unit_Tasks'
    }
  )
  return UnitTask
}
