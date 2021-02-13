const { Router } = require('express')
const { getUser } = require('../controllers/user')
const { protect, signUp } = require('../controllers/auth')

const router = new Router()

router.route('/').post(signUp)
router.route('/:id').get(protect, getUser)

module.exports = router
