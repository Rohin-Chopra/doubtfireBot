const catchAsync = require('express-async-handler')
const jwt = require('jsonwebtoken')
const sequelize = require('./../../sequelize/models')
const { User } = sequelize

const signToken = (id) =>
  jwt.sign({ id }, process.env.ENCRYPTION_KEY, {
    expiresIn: '1d'
  })

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.scope('excludePassword').create(req.body)
  const token = signToken(user.id)
  delete user.dataValues.student_password
  delete user.dataValues.password

  res.status(201).json({
    status: 'success',
    message: 'User created',
    data: {
      user,
      token
    }
  })
})
exports.login = catchAsync(async (req, res, next) => {
  // handle invalid data
  if (!req.body.id) {
    return next(new Error('You must provide a student id'))
  } else if (!req.body.password) {
    return next(new Error('You must provide a password'))
  }

  // if the user does not exist or the password is invalid
  const user = await User.findByPk(req.body.id)
  if (!user || !user.checkPassword(req.body.password)) {
    return next(new Error('Invalid username or password'))
  }

  // sign token
  const token = signToken(user.dataValues.id)

  res.status(200).json({
    status: 'success',
    token,
    message: 'you are logged in'
  })
})

// protect for JWT

exports.protect = catchAsync(async (req, res, next) => {
  console.log(req.headers.authorization)
  if (!req.headers.authorization) {
    return next(
      new Error('You are not logged in! Please log in to access this route')
    )
  }
  const token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.verify(token, process.env.ENCRYPTION_KEY)

  const user = await User.findByPk(decoded.id)
  if (!user) {
    return next(new Error('user not found for this token'))
  }

  req.user = user
  next()
})
