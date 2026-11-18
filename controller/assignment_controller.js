const model = require('../model/assigment_model')
const evalmodel = require('../model/evalmodel')
const authmodel = require('../model/auth_model')


exports.createassignment = async (req ,res) => {
    const { evaluator_id, evaluatee_id, period_id } = req.body
    try {
        if(!evaluator_id || !evaluatee_id || !period_id)
            return res.status(400).json({status:'error', message:'pls fill all field'})

        if(String(evaluator_id) === String(evaluatee_id))
            return res.status(400).json({status:'error', message:'connot evaluate your self'})

        const judge = await authmodel.findbyid(evaluator_id)
        if(!judge || judge.role !== 'judge')
            return res.status(400).json({status:'error', message:'this user is not judge'})


        const userwillreal = await authmodel.findbyid(evaluatee_id)
        if(!userwillreal || userwillreal.role !== 'user')
             return res.status(400).json({status:'error', message:'user not found'})

        if((await evalmodel.getstatus(evaluatee_id) !== 'submitted'))
             return res.status(400).json({status:'error', message:'this user has not submit'})

        const result = await model.creat(evaluator_id, evaluatee_id, period_id)
         return res.status(201).json({status:'success', message:'assignment success', data: { id: result.insertId }})
    } catch (error) {
        console.log(error)
         return res.status(500).json({status:'error', message:'error server'});
    }
}


exports.getasssignment = async (req, res) => {
    try {
        if(!req.query.period_id)
            return res.status(400).json({status:'error', message:'period require'})
        const data = await model.getbyperiod(req.query.period_id)
        return res.status(200).json({status:"success", message:'ok', data})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:'error', message:'server error'});
    }
}


exports.myasssignment = async (req, res) => {
    try {
        if(!req.query.period_id)
            return res.status(400).json({status:'error', message:'period require'})
        const data = await model.getbyjudge(req.user.id, req.query.period_id)
        return res.status(200).json({status:"success", message:'ok', data})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:'error', message:'server error'});
    }
}