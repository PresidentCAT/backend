const bcrypt = require('bcrypt')
const model = require('../model/auth_model')
const admin = require('../model/admin_model')


const errorforerver =( res, error) => {
    console.log(error)
    return res.status(500).json({status:'error', message:'something wrong in server'});
}
exports.getUsers =  async (req, res) => {
    try {
        const data = await model.getUsers(req.query.role)
        res.json({status:'success', message:'ok', data})
    } catch (error) {
        errorforerver(res, error)
    }
}

exports.updateuser = async (req, res) => {
    const { id } = req.params
    const { username, password, email, fullname, salary, phone, czid, department, level } = req.body
    try {

        if (!username || !email || !fullname || !salary || !phone || !czid || !department || !level)
            return res.status(400).json({ status: 'error', message: 'pls fill all field' })

        const user = await model.getuserbyid(id)
        if (!user)
            return res.status(404).json({ status: 'error', message: 'user not found' })

        const check = await model.checkusername(username)
        if (check && String(check.id) !== String(id))
            return res.status(400).json({ status: 'error', message: 'username already used' })

        const hash = password ? await bcrypt.hash(password, 10) : user.password

        await model.updateuser(id, username, email, hash, fullname, salary, phone, czid, department, level)
        return res.status(200).json({ status: 'success', message: 'updateuser success' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: 'something wrong in server' })
    }
}

exports.createuser = async (req, res) => {
    const { username, password, email, fullname, salary, phone, czid, department, level } = req.body
    console.log(req.body);
    try {
        if (!username || !password || !email || !fullname || !salary || !phone || !czid || !department || !level)
            return res.status(400).json({ status: 'error', message: 'pls fill all field' })

        const check = await model.checkusername(username)
        if (check)
            return res.status(400).json({ status: 'error', message: 'username already used' })

        const hash = await bcrypt.hash(password, 10)
        const result = await model.createuser(username, email, hash, fullname, salary, phone, czid, department, level)
        return res.status(201).json({ status: 'success', message: 'createuser success', data: { id: result.insertId } })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: 'something wrong in serveer' })
    }
}

exports.deleteuser = async (req ,res) => {
    const { id } = req.params
    try {
        const user = await model.finduserbyid(id)
        if(!user)
            return res.status(404).json({status:'error', message:'cannot find user'})


        await model.deleteuser(id)
        return res.status(201).json({status:'success', message:'delete user success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:'error', message:'server error'});
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.createtopic = async (req, res) => {
    const { name } = req.body
    try{
        if(!name)
        return res.status(400).json({status:'error', message:'plz fill all filed'})
    const result = await model.createtopic(name)
    res.status(201).json({status:'success', message:'create topic success', data: {id: result.insertId}})
    }catch (error) {
        errorforerver(res, error)
    }
}

exports.gettopics =  async (req, res) => {
    try {
        const data = await model.gettopics(req.query.role)
        res.json({status:'success', message:'ok', data})
    } catch (error) {
        errorforerver(res, error)
    }
}

exports.createindicator = async (req, res) => {
    const {topic_id, name, detail, weight, evidence_note, score_type} = req.body
    try {
        if(!topic_id || !name || !weight)
            return res.status(400).json({status:'error', message:'plz fill name and weight'})

        if(!score_type && !['scale', 'yesno'].includes(score_type))
            return res.status(400).json({status:'error', message:'score_type must be scale or yesno'})

        const  result = await model.createindicator(topic_id, name, detail || null, weight, evidence_note || null, score_type || 'scale')
        return res.status(201).json({status:'success', message:'ondicator create', data:{id: result.insertId}})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:'error', message:'something wrong in server'});
    }
}


exports.updateindicator = async (req, res) => {
    const { name, detail, weight, evidence_note, score_type} = req.body
    try{
        if(!name || !weight || !score_type)
            return res.status(400).json({status:'error', message:'pls fill all field'})

        const result = model.updateindicator(req.params.id, name, detail || null, weight, evidence_note || null, score_type)
        if(result.affectRows === 0)
            return res.status(404).json({status:'error', message:'indicator not found'})
        res.status(201).json({status:'success', message:'update indicator success', data: null})
    }catch(error){
        console.log(error)
        return res.status(500).json({status:'error', message:'something wrong in server'})
    }
}

