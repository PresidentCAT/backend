const { pool } = require('../config/db')

//  crud user
const getuserbyname = async (username) => {
    const [row] = await pool.query(`
        SELECT username FROM users WHERE username = ?`,[username]
    )
    return row[0]
}

const finduserbyid = async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    return rows[0]
}

const updateuser = async (id, username, email, password, fullname, salary, phone, czid, department, level) => {
    const [rows] = await pool.query(`
        UPDATE users SET username = ?, email = ?, password = ?, fullname = ?, salary = ?, phone = ?, czid = ?, department = ?, level = ? WHERE id = ?`,
        [username, email, password, fullname, salary, phone, czid, department, level, id]
    )
    return rows[0]
}

const getuserbyid = async (id) => {
    const [row] = await pool.query(`
        SELECT * FROM users WHERE id = ?`,[id]
    )
    return row[0]
}

const deleteuser = async (id) => {
    const [row] = await pool.query(`
        DELETE FROM users WHERE id = ?`,[id]
    )
    return row
}

const getUsers = async () => {
    const [rows] = await pool.query(
        `SELECT id, username, fullname, email, phone, czid, salary, department, level FROM users`
    )

    return rows
}


const createuser = async (username, email, password, fullname, salary, phone, czid, department, level) => {
    // console.log(username, email, password, fullname, salary, phone, czid, department, level);
    const [row] = await pool.query(`
        INSERT INTO users (username, email, password, fullname, salary, phone, czid, department, level, position, role, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ผู้รับการประเมิน', 'user', 0)`,
        [username, email, password, fullname, salary, phone, czid, department, level]
    )
    return row
}


const checkusername = async (username) => {
    const [rows] = await pool.query(`SELECT id FROM users WHERE username = ?`,[username])
    return rows[0] || null
}


// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const createtopic = async (name) => {
    const [row] = await pool.query(`
        INSERT INTO topics (name) VALUES (?)`,[name]
    )
    return row
}

const gettopic = async () => {
    const [row] = await pool.query(
        `SELECT * FROM topics`
    )
    return row
}


const gettopicbyid = async (id) => {
    const [row] = await pool.query(
        `SELECT * FROM topics WHERE id = ?`,[id]
    )
    return row[0]
}

const deletetopic = async (id) => {
    const [row] = await pool.query(`
        DELETE FROM topics WHERE id = ?`,[id]
    )
    return row
}

const updatetopic = async (id, name) => {
    const [row] = await pool.query(`
        UPDATE topics SET name = ? WHERE id = ?`,[name, id]
    )
    return row
}
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const createindicator = async (topic_id, name, detail, weight, evidence_note, score_type) => {
    const [row] = await pool.query(`
        INSERT INTO indicators(topic_id, name, detail, weight, evidence_note, score_type) VALUES (?, ?, ?, ?, ?, ?)`,
    [topic_id, name, detail, weight, evidence_note, score_type]
    )
    return row
}

const getindicators = async (topic_id) => {
    const [row] = await pool.query(`
        SELECT * FROM indicators WHERE topic_id = ?`,[topic_id]
    )
    return row
}

const getindicators2 = async (id) => {
    const [row] = await pool.query(`
        SELECT * FROM indicators WHERE id = ?`,[id]
    )
    return row[0]
}

const updateindicator = async (id, name, detail, weight, evidence_note, score_type) => {
    const[row] = await pool.query(`
        UPDATE indicators SET name = ?, detail = ?, weight = ?, evidence_note = ?, score_type = ? WHERE id = ?`,
    [name, detail, weight, evidence_note, score_type, id]
    )
    return row
}

const deleteindicator = async (id) => {
    const [row] = await pool.query(`
        DELETE FROM indicators WHERE id = ?`,[id]
    )
    return row
}
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const createperiod = async (name, start_date, end_date) => {
    const [row] = await pool.query(`
        INSERT INTO periods (name, start_date, end_date) VALUES (?, ?, ?)`,[name, start_date, end_date]
    )
    return row
}

const getperiod = async () => {
    const [row] = await pool.query(
        `SELECT * FROM periods`
    )
    return row
}

const deleteperiod = async (id) => {
    const [row] = await pool.query(`
        DELETE FROM periods WHERE id = ?`,[id]
    )
    return row
}

const updateperiod = async (id, name, start_date, end_date) => {
    const [row] = await pool.query(`
        UPDATE periods SET name = ?, start_date = ?, end_date = ? WHERE id = ?`,[name, start_date, end_date, id]
    )
    return row
}


const getcurrentperiod = async () => {
    const [row] = await pool.query(`
        SELECT * FROM periods WHERE CURDATE() BETWEEN start_date AND end_date LIMIT 1`
    )
    return row[0]
}
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





module.exports = {createindicator, gettopicbyid, createuser, checkusername, finduserbyid, getUsers,
    updateindicator, updateperiod, updatetopic, updateuser, deleteuser,
    getcurrentperiod, getindicators, getindicators2, 
    getperiod, gettopic, getuserbyid, getuserbyname,
deleteindicator, deleteperiod, deletetopic, createindicator, createperiod, createtopic}