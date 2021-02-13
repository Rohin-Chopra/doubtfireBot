const { Router } = require('express')
const { getUser, signUp } = require('../controllers/user')
const { protect } = require('../controllers/auth')

const router = new Router()

router.route('/').post(signUp)
router.route('/:id').get(protect, getUser)

module.exports = router
