const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Unit", {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
