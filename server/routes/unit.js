const { Router } = require('express')
const { getUnits } = require('../controllers/unit')
const { protect } = require('../controllers/auth')

const router = new Router({ mergeParams: true })
router.use(protect)

router.route('/').get(getUnits)

module.exports = router
