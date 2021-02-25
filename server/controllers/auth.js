const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const catchAsync = require('express-async-handler')
const jwt = require('jsonwebtoken')
const sequelize = require('@Rohin1212/doubtfire-bot-sequelize')
const sendEmail = require('./../utils/email')
const AppError = require('../utils/appError')
const { User } = sequelize

const signToken = (id) =>
  jwt.sign({ id }, process.env.ENCRYPTION_KEY, {
    expiresIn: '1d'
  })

// @desc    Creates new user
// @route   POST /sign-up
// @access  Public
exports.signUp = catchAsync(async (req, res, next) => {
  // check if the user already exists
  const [user, isCreated] = await User.findOrCreate({
    where: { id: req.body.id },
    defaults: { ...req.body }
  })

  if (!isCreated) {
    return next(new AppError('A user with this email already exists'))
  }

  const token = signToken(user.id)
  delete user.dataValues.student_password
  delete user.dataValues.password

  fs.readFile(
    path.join(__dirname, '/../data/signUp.txt'),
    'utf-8',
    (err, data) => {
      if (err) {
        console.log(err)
      }
      const message = data.replace('{NAME}', user.dataValues.first_name)
      sendEmail({
        from: 'rohinpython@gmail.com',
        to: user.dataValues.email,
        subject: 'Thank you for signing up',
        text: message
      })
    }
  )

  res.status(201).json({
    status: 'success',
    message: 'User created',
    data: {
      user,
      token
    }
  })
})

// @desc    Logs a user in and signs a jwt token
// @route   POST /login
// @access  Public
exports.login = catchAsync(async (req, res, next) => {
  // handle invalid data
  if (!req.body.id) {
    return next(new AppError('You must provide a student id', 400))
  } else if (!req.body.password) {
    return next(new AppError('You must provide a password', 400))
  }

  // if the user does not exist or the password is invalid
  const user = await User.findByPk(req.body.id)

  if (!(await user.checkPassword(req.body.password)) || !user) {
    return next(new AppError('Invalid username or password', 401))
  }

  // sign token
  const token = signToken(user.dataValues.id)

  res.status(200).json({
    status: 'success',
    token,
    message: 'you are logged in'
  })
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const id = req.body.id

  const user = await User.findByPk(id)
  if (!user) {
    return
  }
  const resetPasswordCode = String(Math.floor(100000 + Math.random() * 900000))

  const resetPasswordExpiryDate = new Date()
  resetPasswordExpiryDate.setMinutes(resetPasswordExpiryDate.getMinutes() + 30)

  const hashedResetPasswordCode = await bcrypt.hash(resetPasswordCode, 12)
  await User.update(
    {
      reset_password_code: hashedResetPasswordCode,
      reset_password_code_expires_in: resetPasswordExpiryDate
    },
    { where: { id: user.dataValues.id } }
  )

  fs.readFile(
    path.join(__dirname, '/../data/resetPassword.txt'),
    'utf-8',
    (err, data) => {
      if (err) {
        return console.log(err)
      }

      const message = data
        .replace('{NAME}', user.dataValues.first_name)
        .replace('{RESET_PASSWORD_CODE}', resetPasswordCode)

      sendEmail({
        from: 'rohinpython@gmail.com',
        to: user.dataValues.email,
        subject: 'Reset Password',
        text: message
      })
    }
  )
  res.status(200).json({
    status: 'success',
    message: 'If the user exists, we have sent an email to their email'
  })
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { code, id, password, confirmPassword } = req.body
  if (!code) {
    return next(new AppError('Please specify a reset password code', 400))
  }

  const user = await User.findByPk(id)

  if (!user) {
    return next(new AppError('User not found for this id', 400))
  }

  if (!(await bcrypt.compare(code, user.dataValues.reset_password_code))) {
    return next(new AppError('Invalid reset code'))
  }
  if (password !== confirmPassword) {
    return next(new AppError('passwords do not match', 400))
  }
  const newHashedPassword = await bcrypt.hash(password, 12)

  await User.update(
    {
      password: newHashedPassword,
      reset_password_code: null,
      reset_password_code_expires_in: null
    },
    {
      where: {
        id
      }
    }
  )
  res.status(200).json({
    status: 'success',
    message:
      'Your password has been reset, please log in with your new password'
  })
})

// protects private routes
exports.protect = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(
      new AppError(
        'You are not logged in! Please log in to access this route',
        401
      )
    )
  }
  const token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.verify(token, process.env.ENCRYPTION_KEY)

  const user = await User.findByPk(decoded.id)
  if (!user) {
    return next(new AppError('user not found for this token', 404))
  }

  req.user = user
  next()
})
