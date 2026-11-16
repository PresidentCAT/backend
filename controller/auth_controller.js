const bcrypt = require('bcrypt')
const model = require('../model/auth_model')
const { vrftoken } = require('../middleware/auth_middleware')

exports.register = async (req, res) => {
    const { username, password, email, fullname } = req.body
    try {
        if (!username || !password || !email || !fullname)
            return res.status(400).json({ status: 'error', message: 'pls fill all field' })

        const check = await model.checkusername(username)
        if (check)
            return res.status(400).json({ status: 'error', message: 'username already used' })

        const hash = await bcrypt.hash(password, 10)
        const result = await model.register(username, hash, email, fullname)
        return res.status(201).json({ status: 'success', message: 'register success', data: { id: result.insertId } })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: 'something wrong in server' })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body
    try {
        if (!username || !password)
            return res.status(400).json({ status: 'error', message: 'pls fill all field' })

        const user = await model.checkusername(username)
        if (!user)
            return res.status(400).json({ status: 'error', message: 'invalid username or password' })

        const ismatch = await bcrypt.compare(password, user.password)
        if (!ismatch)
            return res.status(400).json({ status: 'error', message: 'invalid username or password' })

        const token = vrftoken(user.user_id, user.username, user.role)
        res.status(200).json({ status: 'success', authorization: token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: 'something wrong in server' })
    }
}