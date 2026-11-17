const bcrypt = require('bcrypt')
const model = require('../model/auth_model')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const { username, password, email, fullname, salary, phone, czid, department, level } = req.body
    console.log(req.body);
    try {
        if (!username || !password || !email || !fullname || !salary || !phone || !czid || !department || !level)
            return res.status(400).json({ status: 'error', message: 'pls fill all field' })

        const check = await model.checkusername(username)
        if (check)
            return res.status(400).json({ status: 'error', message: 'username already used' })

        const hash = await bcrypt.hash(password, 10)
        const result = await model.register(username, email, hash, fullname, salary, phone, czid, department, level)
        return res.status(201).json({ status: 'success', message: 'register success', data: { id: result.insertId } })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: 'something wrong in server' })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body
    console.log(req.body);
    try {
        if (!username || !password) return res.status(400).json({ status: 'error', message: 'pls fill all field' })
            
        const user = await model.findbyusername(username)
        if (!user)  return res.status(400).json({ status: 'error', message: 'invalid username or password' })
            console.log(user);
           
        const ismatch = await bcrypt.compare(password, user.password)
        if (!ismatch)  return res.status(400).json({ status: 'error', message: 'invalid username or password1' })
           

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, status: Number(user.status) },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        res.status(200).json({ status: 'success', authorization: token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: 'something wrong in server' })
    }
}

exports.changePassword = async (req, res) => {
    const { old_password, new_password } = req.body
    console.log(req.body);
    try {
        if (!old_password || !new_password)
            return res.status(400).json({ status: 'error', message: 'please fill all field' })

        if (old_password === new_password)
            return res.status(400).json({ status: 'error', message: 'new password must be different' })

        const user = await model.findById(req.user.id)
        const match = await bcrypt.compare(old_password, user.password)
        if (!match) return res.status(400).json({ status: 'error', message: 'old password is wrong' })

        const hash = await bcrypt.hash(new_password, 10)
        await model.changePassword(req.user.id, hash)

        // ออก token ใหม่ที่ status = 1 (token เดิมยังเป็น 0 อยู่)
        const token = jwt.sign(
            { id: req.user.id, username: req.user.username, role: req.user.role, status: 1 },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        console.log(user);
        res.json({ status: 'success', message: 'password changed', data: { token } })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: 'something wrong in server' })
    }
}