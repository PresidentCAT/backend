const express = require('express')
const router = express.Router()
const ctrl = require('../controller/admin_controller')
const { verifyToken, role } = require('../middleware/auth_middleware')

// ทุกเส้นในไฟล์นี้ต้อง login และเป็น admin (เมาต์ที่ /api/admin ใน app.js)
router.use(verifyToken, role('admin'))

// ผู้ใช้
router.get('/users', ctrl.getusers)
router.post('/users', ctrl.createuser)
router.put('/users/:id', ctrl.updateuser)
router.delete('/users/:id', ctrl.deleteuser)

// หัวข้อ
router.post('/topics', ctrl.createtopic)
// router.put('/topics/:id', ctrl.updatetopic)       // ยังไม่มีใน controller
// router.delete('/topics/:id', ctrl.deletetopic)    // ยังไม่มีใน controller

// ตัวชี้วัด
router.post('/indicators', ctrl.createindicator)
router.put('/indicators/:id', ctrl.updateindicator)

// ช่วงเวลาประเมิน (ยังไม่มีใน controller)
// router.post('/periods', ctrl.createperiod)
// router.get('/periods', ctrl.getperiods)

module.exports = router