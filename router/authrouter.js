const express = require('express')
const router = express.Router()
const ctrl = require('../controller/auth_controller')
const { verifyToken } = require('../middleware/auth_middleware')


router.post('/register', ctrl.register)
router.post('/login',ctrl.login)
router.put('/change-password', verifyToken, ctrl.changePassword)

module.exports = router