const { pool } = require('../config/db')

const getstatus = async (evaluatee_id) => {
    const [row] = await pool.query(`
        SELECT status FROM evaluations WHERE evaluatee_id = ?`,[evaluatee_id]
    )
    return row[0] ? row[0].status : 'draft'
}

const setstatus = async (evaluatee_id, status) => {
    await pool.query(`
        INSERT INTO evaluations (evaluatee_id, status) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE status = VALUES(status)`,[evaluatee_id, status])
}

const saveanswer = async (evaluatee_id, indicator_id, self_score, evidence_url, evidenc_file) => {
    await pool.query(`
        INSERT INTO answers (evaluatee_id, indicator_id, self_score, evidence_url, evidenc_file) VALUES (?, ?, ?, ?, ?) 
        ON  DUPLICATE KEY UPDATE self_score = VALUES(self_score), evidence_url = VALUES(evidence_url),evidence_file = COALESCE(VALUES(evidence_file), evidence_file)`,[
            evaluatee_id, indicator_id, self_score, evidence_url, evidenc_file
        ])
}

const myprogress = async (evaluatee_id) => {
    const[rows] = await pool.query(`
        SELECT t.name AS topic, COUNT(i.id) AS total, COUNT(a.id) AS answered
        FROM topics t
        JOIN indicators i ON i.topic_id = t.id
        LEFT JOIN answers a ON a.indicator_id = i.id AND a.evaluatee_id = ?
        GROUP BY t.id, t.name`,
    [evaluatee_id])
    return rows
}

const mycomment = async (evaluatee_id) => {
    const [rows] = await pool.query(`
        SELECT i.name AS indicators, u.fullname AS committee, s.score, s.comment
        FROM scores s
        JOIN indicators i ON i.id = s.indicator_id
        JOIN users u ON u.id = s.committee_id
        WHERE s.evaluatee_id = ?`,[
            evaluatee_id
        ])
        return rows
}

const clearsignaturs = async (evaluatee_id) => {
    await pool.query(`
        UPDATE assignments SET signatur = NULL WHERE evaluatee_id = ?`,[evaluatee_id])
}