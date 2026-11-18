const { pool } = require('../config/db')


const creat = async (evaluator_id, evaluatee_id, period_id) => {
    const [rows] = await pool.query(`INSERT INTO assignments(evaluator_id, evaluatee_id, period_id) VALUES (?, ?, ?)`,[
        evaluator_id, evaluatee_id, period_id
    ])
    return rows
}

const getbyperiod = async (period_id) => {
    const [rows] = await pool.query(`SELECT * FROM assignments WHERE period_id = ?`,[period_id])
    return rows
}

const getbyjudge = async (evaluator_id, period_id) => {
    const [rows] = await pool.query(`
        SELECT * FROM assignments WHERE evaluator_id = ? AND period_id = ?`,[
            evaluator_id, period_id
        ])
        return rows
}


module.exports = {creat, getbyjudge, getbyperiod}