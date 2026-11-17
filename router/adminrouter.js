const express = require('express')
const router = express.Router()
const ctrl = require('../controller/admin_controller')
const { verifyToken } = require('../middleware/auth_middleware')


router.post('/getUsers', ctrl.getUsers)
router.get('/')

router.post('/admin/topics', admin, ctrl.createTopic)
router.put('/admin/topics/:id', admin, ctrl.updateTopic)
router.delete('/admin/topics/:id', admin, ctrl.deleteTopic)

router.get('/topics', auth, ctrl.getTopics)
router.get('/indicators', auth, ctrl.getIndicators)
router.get('/period', auth, ctrl.getPeriod)



router.post('/admin/topics', admin, ctrl.createTopic)
router.put('/admin/topics/:id', admin, ctrl.updateTopic)
router.delete('/admin/topics/:id', admin, ctrl.deleteTopic)

router.post('/admin/periods', admin, ctrl.createPeriod)
router.get('/admin/periods', admin, ctrl.getPeriods)