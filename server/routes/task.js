const { Router } = require('express')
const { getTasks } = require('../controllers/task')
const { protect } = require('../controllers/auth')

const router = new Router()
router.use(protect)

router.route('/').get(getTasks)

module.exports = router
