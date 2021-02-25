const asyncHandler = require('express-async-handler')
const sequelize = require('@Rohin1212/doubtfire-bot-sequelize')
const AppError = require('../utils/appError')
const { Task } = sequelize

// @desc    Get a tasks
// @route   GET /api/tasks/:name
// @access  Private
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

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  let tasks
  if (req.user) {
    tasks = await sequelize.sequelize.query(
      `SELECT name, unit_code ,status FROM public."User_Tasks" INNER JOIN public."Tasks" ON name = public."User_Tasks".task_name WHERE user_id = '${req.user.id}'`,
      { type: sequelize.sequelize.QueryTypes.SELECT }
    )
  } else {
    tasks = await Task.findAll()
  }
  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks }
  })
})
