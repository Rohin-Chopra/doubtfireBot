const { DataTypes } = require("sequelize");
const db = require("./../db");

const Task = db.define("Task", {
  taskNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
  },
});

module.exports = Task;
