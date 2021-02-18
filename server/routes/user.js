const { Router } = require('express')
const { getUser, updateUser, deleteUser } = require('../controllers/user')
const { protect, signUp } = require('../controllers/auth')
const taskRouter = require('./task')
const unitRouter = require('./unit')

const router = new Router()

router.route('/').post(signUp)

router.use(protect)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

router.use('/:id/tasks', taskRouter)
router.use('/:id/units', unitRouter)

module.exports = router
