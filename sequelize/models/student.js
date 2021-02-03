const { DataTypes } = require("sequelize");
const Cryptr = require("cryptr");

module.exports = (sequelize) => {
  const User = sequelize.define("Student", {
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

  User.addScope("excludePassword", {
    attributes: {
      exclude: ["studentPassword"],
    },
  });

  User.beforeCreate(async (user, options) => {
    const cryptr = new Cryptr(process.env.SALT);
    console.log(user);
    const encryptedPassword = cryptr.encrypt(user.studentPassword);
    user.studentPassword = encryptedPassword;
  });
};

// Student.belongsTo(Task);
// Student.belongsToMany(Unit, { through: "Enrollment" });
