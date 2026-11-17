const { pool } = require('../config/db')


const checkusername = async (username) => {
    const [rows] = await pool.query(`SELECT id FROM users WHERE username = ?`,[username])
    return rows[0] || null
}


const register = async (username, email, password, fullname, salary, phone, czid, department, level) => {
    const [row] = await pool.query(`
        INSERT INTO users (username, email, password, fullname, salary, phone, czid, department, level, position, role, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ผู้รับการประเมิน', 'ผู้รับการประเมิน', 1)`,
        [username, email, password, fullname, salary, phone, czid, department, level]
    )
    return row.insertId || null
}

const findbyusername = async (username) => {
    const [row] = await pool.query(`
        SELECT * FROM users WHERE username = ?`,[username])
        console.log(row[0]);
        return row[0] || null
}

const changePassword = async (id, hash) => {
    await pool.query(`UPDATE users SET password = ?, status = 1 WHERE id = ?`,[hash, id])
}
module.exports = {checkusername, register, findbyusername, changePassword}