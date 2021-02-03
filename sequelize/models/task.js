const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Task", {
    taskNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unitCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    },
  });

// Task.hasMany(Student);
// Task.belongsTo(Unit);
