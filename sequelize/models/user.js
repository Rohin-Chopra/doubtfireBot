'use strict'
const { Model } = require('sequelize')
const Cryptr = require('cryptr')
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Task, {
        through: models.UserTask,
        foreignKey: 'user_id'
      })
      this.belongsToMany(models.Unit, {
        through: models.UserUnit,
        foreignKey: 'user_id'
      })
    }

    decryptStudentPassword() {
      const cryptr = new Cryptr(process.env.ENCRYPTION_KEY)
      return cryptr.decrypt(this.dataValues.student_password)
    }

    async checkPassword(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password)
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      student_password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reset_password_code: {
        type: DataTypes.STRING,
        allowNull: true
      },
      reset_password_code_expires_in: {
        type: DataTypes.DATE,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true,
      sequelize,
      modelName: 'User',
      freezeTableName: true,
      tableName: 'Users'
    }
  )
  User.addScope('excludePassword', {
    attributes: {
      exclude: ['student_password', 'password', 'createdAt', 'updatedAt']
    }
  })

  User.beforeCreate(async (user, options) => {
    // encrypt student_password
    const cryptr = new Cryptr(process.env.ENCRYPTION_KEY)
    user.student_password = cryptr.encrypt(user.student_password)

    // hash password
    user.password = await bcrypt.hash(user.password, 12)
  })
  return User
}
