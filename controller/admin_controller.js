const bcrypt = require('bcrypt')
const authmodel = require('../model/auth_model')
const adminmodel = require('../model/admin_model')


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
    const {username, email, password, fullname, salary, phone, czid, department, level} = req.body
    try {
        if(!username || !email || !password  ||!fullname || !salary || !phone || !czid || !department || !level){
            return res.status(400).json({status:'error', message:'plz fill all field'})
        }
            
    } catch (error) {
        
    }
}



exports.createuser = async (req, res) => {
    const {username, password, fullname, email, role} = req.body
    try{
    if(!username || !password || !fullname || !email || !role)
        return res.status(400).json({status:'error', message:'plz fill all filed'})

    const check = await model.checkusername(username)
    if(check)
        return res.status(400).json({status:'error', message:'this username alerdy use'})

    const hash = await bcrypt.hash(password, 10)
    const result = await model.register(username, hash, fullname, email, 'noob')
    res.status(201).json({status:'success', message:'user create', data:{id:result.insertId}})
    }catch(error){
        errorforerver(res, error)
    }
}


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

exports.gettopic =  async (req, res) => {
    try {
        const data = await model.gettopic(req.query.role)
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

