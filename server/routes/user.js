const { Router } = require('express')
const { getUser, updateUser, deleteUser } = require('../controllers/user')
const { protect, signUp } = require('../controllers/auth')

const router = new Router()

router.route('/').post(signUp)

router.use(protect)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

module.exports = router
