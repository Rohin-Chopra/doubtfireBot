const AppError = require('./../utils/appError')

const handleJwtError = (err, res) =>
  new AppError('Invalid token, Please log in again!', 400)

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    name: err.name,
    stack: err.stack
  })
}

const sendErrorProd = (err, res) => {
  if (err instanceof Error) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
  res.status(err.statusCode).json({
    status: err.status,
    message: 'Something went wrong'
  })
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res)
  }

  let error
  switch (err.name) {
    case 'JsonWebTokenError':
      error = handleJwtError(err, res)
      break
    default:
      error = err
  }
  sendErrorProd(err, res)
}
