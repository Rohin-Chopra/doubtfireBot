const asyncHandler = require('express-async-handler')
const sequelize = require('./../../sequelize/models')
const { User } = sequelize

exports.signUp = asyncHandler(async (req, res, next) => {
  const user = await User.scope('excludePassword').create(req.body)
  delete user.studentPassword

  res.status(201).json({
    status: 'success',
    message: 'User created',
    data: {
      user
    }
  })
})

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.scope('excludePassword').findByPk(req.params.id)

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
})
