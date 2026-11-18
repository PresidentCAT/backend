const express = require('express')
const router = express.Router()
const ctrl = require('../controller/eval_controller')
const upload = require('../middleware/multer')
const { verifyToken, role } = require('../middleware/auth_middleware')

router.use(verifyToken, role('user'))

router.get('/answers', ctrl.getanswers)
router.post('/answers', upload.single('file'), ctrl.saveanswer)
router.get('/progress', ctrl.progress)
router.post('/submit', ctrl.submit)

module.exports = router
