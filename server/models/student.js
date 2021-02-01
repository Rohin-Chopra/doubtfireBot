const { DataTypes } = require("sequelize");
const db = require("./../db");
const Task = require("./task");

const Student = db.define("Student", {
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studentPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  personalEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Student.hasMany(Task, { foreignKey: "studentId" });

module.exports = Student;
