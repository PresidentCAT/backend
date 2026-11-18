const bcrypt = require('bcrypt')
const admin = require('../model/admin_model')

exports.getUsers =  async (req, res) => {
    try {
        const data = await admin.getUsers(req.query.role)
        res.json({status:'success', message:'ok', data})
    } catch (error) {
        console.log(error)
    return res.status(500).json({status:'error', message:'something wrong in server'});
    }
}

exports.updateuser = async (req, res) => {
    const { id } = req.params
    const { username, password, email, fullname, salary, phone, czid, department, level } = req.body
    try {

        if (!username || !email || !fullname || !salary || !phone || !czid || !department || !level)
            return res.status(400).json({ status: 'error', message: 'pls fill all field' })

        const user = await admin.getuserbyid(id)
        if (!user)
            return res.status(404).json({ status: 'error', message: 'user not found' })

        const check = await admin.checkusername(username)
        if (check && String(check.id) !== String(id))
            return res.status(400).json({ status: 'error', message: 'username already used' })

        const hash = password ? await bcrypt.hash(password, 10) : user.password

        await admin.updateuser(id, username, email, hash, fullname, salary, phone, czid, department, level)
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

        const check = await admin.checkusername(username)
        if (check)
            return res.status(400).json({ status: 'error', message: 'username already used' })

        const hash = await bcrypt.hash(password, 10)
        const result = await admin.createuser(username, email, hash, fullname, salary, phone, czid, department, level)
        return res.status(201).json({ status: 'success', message: 'createuser success', data: { id: result.insertId } })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: 'something wrong in serveer' })
    }
}

exports.deleteuser = async (req ,res) => {
    const { id } = req.params
    try {
        const user = await admin.finduserbyid(id)
        if(!user)
            return res.status(404).json({status:'error', message:'cannot find user'})


        await admin.deleteuser(id)
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
    const result = await admin.createtopic(name)
    res.status(201).json({status:'success', message:'create topic success', data: {id: result.insertId}})
    }catch (error) {
        console.log(error)
        return res.status(500).json({status:'error', message:'something wrong in server'})
    }
}

exports.gettopic =  async (req, res) => {
    try {
        const data = await admin.gettopic()
        res.json({status:'success', message:'ok', data})
    } catch (error) {
        console.log(error)
    return res.status(500).json({status:'error', message:'something wrong in server'});
    }
}


exports.gettopicbyid =  async (req, res) => {
    try {
        const data = await admin.gettopicbyid(req.params.id)
        res.json({status:'success', message:'ok', data})
    } catch (error) {
        console.log(error)
    return res.status(500).json({status:'error', message:'something wrong in server'});
    }
}



exports.deletetopic = async (req, res) => {
    const { id } = req.params
    try {
        const topic = await admin.gettopicbyid(id)
        if(!topic)
            return res.status(404).json({status:'error', message:'cannot get topic'})

        await admin.deletetopic(id)
        return res.status(201).json({status:'success', message:'delete topics success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:'error', message:'server error'});
    }
}

exports.updatetopic = async (req, res) => {
    const { name} = req.body
    try{
        if(!name)
            return res.status(400).json({status:'error', message:'pls fill all field'})

        const result = await admin.updatetopic(req.params.id, name)
        if(result.affectedRows === 0)
            return res.status(404).json({status:'error', message:'topic not found'})
        res.status(201).json({status:'success', message:'update topic success',})
    }catch(error){
        console.log(error)
        return res.status(500).json({status:'error', message:'something wrong in server'})
    }
}


// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.createindicator = async (req, res) => {
    const {topic_id, name, detail, weight, evidence_note, score_type} = req.body
    try {
        if(!topic_id || !name || !weight)
            return res.status(400).json({status:'error', message:'plz fill name and weight'})

        if(score_type && !['scale', 'yesno'].includes(score_type))
            return res.status(400).json({status:'error', message:'score_type must be scale or yesno'})

        const  result = await admin.createindicator(topic_id, name, detail || null, weight, evidence_note || null, score_type || 'scale')
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

        const result = await admin.updateindicator(req.params.id, name, detail || null, weight, evidence_note || null, score_type)
        if(result.affectedRows === 0)
            return res.status(404).json({status:'error', message:'indicator not found'})
        res.status(201).json({status:'success', message:'update indicator success', data: null})
    }catch(error){
        console.log(error)
        return res.status(500).json({status:'error', message:'something wrong in server'})
    }
}

exports.getindicators =  async (req, res) => {
    try {
        const data = await admin.getindicators(req.query.topic_id)
        res.json({status:'success', message:'ok', data})
    } catch (error) {
        console.log(error)
    return res.status(500).json({status:'error', message:'something wrong in server'});
    }
}


exports.deleteindicator = async (req, res) => {
    const { id } = req.params
    try {
        const indicator = await admin.getindicators2(id)
        if(!indicator)
            return res.status(404).json({status:'error', message:'cannot get indicator'})

        await admin.deleteindicator(id)
        return res.status(201).json({status:'success', message:'delete indicator success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:'error', message:'server error'});
    }
}

exports.getindicators2 =  async (req, res) => {
    try {
        const data = await admin.getindicators2(req.params.id)
        res.json({status:'success', message:'ok', data})
    } catch (error) {
        console.log(error)
    return res.status(500).json({status:'error', message:'something wrong in server'});
    }
}
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



exports.updateperiod = async (req, res) => {
    const { name, start_date, end_date} = req.body
    try{
        if(!name || !start_date || !end_date)
            return res.status(400).json({status:'error', message:'pls fill all field'})

        const result = await admin.updateperiod(req.params.id, name, start_date, end_date)
        if(result.affectedRows === 0)
            return res.status(404).json({status:'error', message:'period not found'})
        res.status(201).json({status:'success', message:'update period success', result: req.result})
    }catch(error){
        console.log(error)
        return res.status(500).json({status:'error', message:'something wrong in server'})
    }
}

exports.getperiod =  async (req, res) => {
    try {
        const data = await admin.getperiod()
        res.json({status:'success', message:'ok', data})
    } catch (error) {
        console.log(error)
    return res.status(500).json({status:'error', message:'something wrong in server'});
    }
}


exports.deleteperiod = async (req, res) => {
    const { id } = req.params
    try {
        const result = await admin.deleteperiod(id)
        if(result.affectedRows === 0)
            return res.status(404).json({status:'error', message:'cannot get period'})

        return res.status(201).json({status:'success', message:'delete period success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:'error', message:'server error'});
    }
}


exports.createperiod = async (req, res) => {
    const {name, start_date, end_date} = req.body
    try {
        if(!name || !start_date || !end_date)
            return res.status(400).json({status:'error', message:'plz fill all field'})

        const  result = await admin.createperiod(name, start_date, end_date)
        return res.status(201).json({status:'success', message:'period create', data:{id: result.insertId}})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:'error', message:'something wrong in server'});
    }
}
