const jwt = require('jsonwebtoken')


exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ status: 'error', message: 'no token' })

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)

        if (req.user.status === 0 && req.originalUrl !== '/api/auth/change-password') {
            return res.status(403).json({ status: 'error', message: 'must change password first' })
        }

        next()
    } catch {
        res.status(401).json({ status: 'error', message: 'token invalid or expired' })
    }
}


exports.role = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role))
        return res.status(403).json({status:'error', message:'no permission'})
    next()
}