const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("Student", {
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

// Student.belongsTo(Task);
// Student.belongsToMany(Unit, { through: "Enrollment" });
