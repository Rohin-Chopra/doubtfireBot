const asyncHandler = require('express-async-handler')
const sequelize = require('@Rohin1212/doubtfire-bot-sequelize')
const { User } = sequelize

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.scope('excludePassword').findByPk(req.user.id)
  if (!user) {
    res.status(404).json({
      status: 'fail',
      message: 'User not found for id '
    })
  }
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
})

exports.updateUser = asyncHandler(async (req, res, next) => {
  await User.update(
    {
      first_name: req.body.first_name || req.user.first_name,
      last_name: req.body.last_name || req.user.last_name,
      email: req.body.email || req.user.email
    },
    {
      where: {
        id: req.user.id
      }
    }
  )
  const updatedUser = await User.scope('excludePassword').findByPk(req.user.id)
  console.log(updatedUser)
  res.status(200).json({
    status: 'success',
    message: 'User updated',
    data: {
      user: updatedUser
    }
  })
})

exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.destroy({
    where: {
      id: req.user.id
    }
  })
  res.status(200).json({
    status: 'success',
    message: 'User deleted'
  })
})
