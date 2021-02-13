const asyncHandler = require('express-async-handler')
const sequelize = require('../../sequelize/models')
const { User } = sequelize

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.scope('excludePassword').findByPk(req.user.id)

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
})
