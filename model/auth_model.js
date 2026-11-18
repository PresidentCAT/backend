const { pool } = require('../config/db')


const checkusername = async (username) => {
    const [rows] = await pool.query(`SELECT id FROM users WHERE username = ?`,[username])
    return rows[0] || null
}


const register = async (username, email, password, fullname, salary, phone, czid, department, level) => {
    console.log(username, email, password, fullname, salary, phone, czid, department, level);
    const [row] = await pool.query(`
        INSERT INTO users (username, email, password, fullname, salary, phone, czid, department, level, position, role, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ผู้รับการประเมิน', 'user', 0)`,
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

const findbyid = async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    return rows[0]
}

const changePassword = async (id, hash) => {
    await pool.query(`UPDATE users SET password = ?, status = 1 WHERE id = ?`,[hash, id])
}

const getProfile = async (id) => {
    const [rows] = await pool.query(
        `SELECT id, username, fullname, email, phone, czid, salary, department, level FROM users WHERE id = ?`,
        [id]
    )

    return rows[0] || null
}

// แก้ไขข้อมูลส่วนตัว
const updateprofile = async (id, data) => {
    console.log('--- Debug ID ---', id);
    const [result] = await pool.query(
        `UPDATE users SET username = ?, fullname = ?, email = ?, phone = ?, czid = ?, salary = ?, department = ?, level = ? WHERE id = ?`,
        [data.username, data.fullname, data.email, data.phone, data.czid, data.salary, data.department, data.level, id]
    );
    console.log(result);
    return result;
}











module.exports = {checkusername, register, findbyusername, changePassword, findbyid, updateprofile, getProfile}