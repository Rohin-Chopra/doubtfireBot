const { Router } = require('express')
const { login, signUp } = require('./../controllers/auth')

const router = new Router()

router.post('/login', login)
router.post('/sign-up', signUp)

module.exports = router
