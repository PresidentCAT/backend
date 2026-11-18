const express = require('express')
const router = express.Router()
const ctrl = require('../controller/assignment_controller')
const { verifyToken, role } = require('../middleware/auth_middleware')


router.post('/', verifyToken, role('hr'), ctrl.createassignment)
router.get('/', verifyToken, role('hr'), ctrl.getasssignment)
router.get('/mine', verifyToken, role('judge'), ctrl.myasssignment)

module.exports = router