const asyncHandler = require('express-async-handler')
const sequelize = require('../../sequelize/models')
const AppError = require('../utils/appError')
const { User, Task } = sequelize

exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findOne({ where: { name: req.body.name } })
  if (!task) {
    return next(new AppError('Task not found', 404))
  }
  res.status(200).json({
    status: 'success',
    data: { task }
  })
})

exports.getTasks = asyncHandler(async (req, res, next) => {
  const tasks = await Task.findAll()

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks }
  })
})
