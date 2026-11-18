const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination:'uploads/',
    filename: (req, file, cd) => cb(null, Date.now() + path.extname(file.originalname))
})

module.exports = multer({
    storage,
    limits:{ fileSize: 5 * 1024 * 1024},
    fileFilter: (req ,file, cb) => 
        cb(null, ['application/pdf', 'image/png', 'image/jpeg'].includes(file.mimetype))
})