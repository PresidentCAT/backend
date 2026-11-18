const express = require('express')
const router = express.Router()
const ctrl = require('../controller/admin_controller')
const { verifyToken, role } = require('../middleware/auth_middleware')

// ทุกเส้นในไฟล์นี้ต้อง login และเป็น admin (เมาต์ที่ /api/admin ใน app.js)
router.use(verifyToken, role('hr'))

// ผู้ใช้
router.get('/users', ctrl.getUsers)
router.post('/users', ctrl.createuser)
router.put('/users/:id', ctrl.updateuser)
router.delete('/users/:id', ctrl.deleteuser)

// หัวข้อ
router.get('/topic', ctrl.gettopic)
router.post('/topics', ctrl.createtopic)
router.put('/topics/:id', ctrl.updatetopic)    
router.delete('/topics/:id', ctrl.deletetopic)   

// ตัวชี้วัด
router.get('/indicators', ctrl.getindicators)
router.get('/indicators/:id', ctrl.getindicators2)
router.post('/indicators', ctrl.createindicator)
router.put('/indicators/:id', ctrl.updateindicator)
router.delete('/indicators/:id', ctrl.deleteindicator)

// ช่วงเวลาประเมิน
router.get('/periods', ctrl.getperiod)
router.post('/periods', ctrl.createperiod)
router.put('/periods/:id', ctrl.updateperiod)
router.delete('/periods/:id', ctrl.deleteperiod)

module.exports = router