const { pool } = require('../config/db')

const createtopics = async (name) => {
    const [row] = await pool.query(`
        INSERT INTO topics (name) VALUES (?)`,[name]
    )
    return row[0]
}

const gettopic = async () => {
    const [row] = await pool.query(
        `SELECT * FROM topics`
    )
    return row
}

const deletetopic = async (id) => {
    const [row] = await pool.query(`
        DELETE topics WHERE id = ?`,[id]
    )
    return row
}

const updatetopics = async (id) => {
    const [row] = await pool.query(`
        UPDATE topics SET name = ? WHERE id = ?`,[id]
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

const getindicator = async (topic_id) => {
    const [row] = await pool.query(`
        SELECT * FROM indicators WHERE topic_id = ?`,[topic_id]
    )
    return row[0]
}

const getindicator2 = async (id) => {
    const [row] = await pool.query(`
        SELECT * FROM indicators WHERE id = ?`,[id]
    )
    return row[0]
}

const updateindicator = async (id, name, detail, weight, evidence_note, score_type) => {
    const[row] = await pool.query(`
        UPDATE indicators SET name = ?, deatil = ?, weight = ?, evidence_note = ?, score_type = ?`,
    [name, detail, weight, evidence_note, score_type, id]
    )
    return row[0]
}

const deleteindicator = async (id) => {
    const [row] = await pool.query(`
        DELETE indicators WHERE id = ?`,[id]
    )
    return row
}
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const createperiods = async (name, start_date, end_date) => {
    const [row] = await pool.query(`
        INSERT INTO periods (name, start_date, end_date) VALUES (?, ?, ?)`,[name, start_date, end_date]
    )
    return row[0]
}

const getperiod = async () => {
    const [row] = await pool.query(
        `SELECT * FROM periods`
    )
    return row
}

const deleteperiod = async (id) => {
    const [row] = await pool.query(`
        DELETE periods WHERE id = ?`,[id]
    )
    return row
}

const updateperiod = async (id) => {
    const [row] = await pool.query(`
        UPDATE periods SET name = ? WHERE id = ?`,[id]
    )
    return row
}


const getcurrendate = async () => {
    const [row] = await pool.query(`
        SELECT * FROM periods WHERE CURDATE() BETWEEN start_date, AND end_date LIMIT 1`
    )
    return row[0]
}
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const updateuser = async (id, username, email, password, fullname, salary, phone, czid, department, level) => {
    const [rows] = await pool.query(`
        UPDATE users SET username = ?, email = ?, password = ?, fullname = ?, salary = ?, phone = ?, czid = ?, department = ?, level = ?`,
        [username, email, password, fullname, salary, phone, czid, department, level, id]
    )
    return rows[0]
}

const getuserbyid = async (id) => {
    const [row] = await pool.query(`
        SELECT * FROM users WHERE id`,[id]
    )
    return row[0]
}

const getuserbyname = async (username) => {
    const [row] = await pool.query(`
        SELECT username FROM users WHERE username = ?`,[username]
    )
    return row[0]
}

const deleteuser = async (id) => {
    const [row] = await pool.query(`
        DELETE users WHERE id = ?`,[id]
    )
    return row
}

module.exports = {createindicator, 
    updateindicator, updateperiod, updatetopics, updateuser, deleteuser,
    getcurrendate, getindicator, getindicator2, 
    getperiod, gettopic, getuserbyid, getuserbyname,
deleteindicator, deleteperiod, deletetopic, createindicator, createperiods, createtopics}