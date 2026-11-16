const { pool } = require('../config/db')


const checkusername = async (username) => {
    const [rows] = await pool.query(`SELECT id FROM users WHERE username = ?`,[username])
    return rows[0]
}

const register = async (username, password, email, fullname, role) => {
    const [row] = await pool.query(`
        INSERT INTO users (username, password, email, fullname, role) VALUES (?, ?, ?, ?, ?)`,
    [username, password, email, fullname, role]
    )
    return row
}

const findbyusername = async (username) => {
    const [row] = await pool.query(`
        SELECT * FROM users WHERE username = ?`,[username])
        return row[0]
}

module.exports = {checkusername, register, findbyusername}