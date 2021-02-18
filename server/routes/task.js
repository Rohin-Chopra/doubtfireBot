const { Router } = require('express')
const { getTasks } = require('../controllers/task')
const { protect } = require('../controllers/auth')

const router = new Router({ mergeParams: true })
router.use(protect)

router.route('/').get(getTasks)

module.exports = router
