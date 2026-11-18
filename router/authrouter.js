const express = require('express')
const router = express.Router()
const ctrl = require('../controller/auth_controller')
const { verifyToken, role } = require('../middleware/auth_middleware');
router.get('/form', verifyToken, role('user'), ctrl.form)
const model = require('../model/auth_model')



router.get('/form', verifyToken, role('user'), ctrl.form)
router.get('/me', verifyToken, ctrl.getProfile)
router.put('/me', verifyToken, ctrl.updateprofile)
router.post('/register', ctrl.register)
router.post('/login',ctrl.login)
router.put('/change-password', verifyToken, ctrl.changePassword)

module.exports = router