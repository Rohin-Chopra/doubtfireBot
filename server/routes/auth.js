const { Router } = require('express')
const {
  login,
  signUp,
  forgotPassword,
  resetPassword
} = require('./../controllers/auth')

const router = new Router()

router.post('/login', login)
router.post('/sign-up', signUp)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router
