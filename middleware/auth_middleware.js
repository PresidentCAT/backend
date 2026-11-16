const jwt = require('jsonwebtoken')


exports.vrftoken = (req, res , next) => {
    const header = req.headers.authorization
    if(!header) return res.status(401).json({status:'error', message:'no token'})
    try {
        req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
        next()
    } catch (error) {
        return res.status(401).json({status:'error', message:'token invalid or expired'})
    }
}


exports.role = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role))
        return res.status(403).json({status:'error', message:'no permission'})
    next()
}