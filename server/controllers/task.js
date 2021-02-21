const asyncHandler = require('express-async-handler')
const sequelize = require('@Rohin1212/doubtfire-bot-sequelize')
const AppError = require('../utils/appError')
const { Task, UserTask } = sequelize

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
  let tasks
  if (req.user) {
    tasks = await UserTask.findAll({
      where: {
        user_id: req.user.id
      },
      attributes: [['task_name', 'name'], 'status']
    })
  } else {
    tasks = await Task.findAll()
  }
  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks }
  })
})
