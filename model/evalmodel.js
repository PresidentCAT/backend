const { pool } = require('../config/db')

const getstatus = async (evaluatee_id) => {
    const [rows] = await pool.query(
        `SELECT status FROM evaluations WHERE evaluatee_id = ?`, [evaluatee_id])
    return rows[0] ? rows[0].status : 'draft'
}

const setstatus = async (evaluatee_id, status) => {
    await pool.query(
        `INSERT INTO evaluations (evaluatee_id, status) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status)`,
        [evaluatee_id, status])
}

const saveanswer = async (evaluatee_id, indicator_id, self_score, evidence_url, evidence_file) => {
    await pool.query(
        `INSERT INTO answers (evaluatee_id, indicator_id, self_score, evidence_url, evidence_file)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            self_score = VALUES(self_score),
            evidence_url = VALUES(evidence_url),
            evidence_file = COALESCE(VALUES(evidence_file), evidence_file)`,
        [evaluatee_id, indicator_id, self_score, evidence_url, evidence_file])
}

// ตัวชี้วัดทั้งหมด + คำตอบ/หลักฐานของคนนี้ (ไว้แสดงหน้าฟอร์ม)
const myanswers = async (evaluatee_id) => {
    const [rows] = await pool.query(
        `SELECT i.id AS indicator_id, i.topic_id, i.name, i.detail, i.weight,
                i.evidence_note, i.score_type,
                a.self_score, a.evidence_url, a.evidence_file
         FROM indicators i
         LEFT JOIN answers a ON a.indicator_id = i.id AND a.evaluatee_id = ?
         ORDER BY i.topic_id, i.id`,
        [evaluatee_id])
    return rows
}

const myprogress = async (evaluatee_id) => {
    const [rows] = await pool.query(
        `SELECT t.id AS topic_id, t.name AS topic,
                COUNT(i.id) AS total, COUNT(a.indicator_id) AS answered
         FROM topics t
         JOIN indicators i ON i.topic_id = t.id
         LEFT JOIN answers a ON a.indicator_id = i.id AND a.evaluatee_id = ?
         GROUP BY t.id, t.name`,
        [evaluatee_id])
    return rows
}

module.exports = {
    myanswers, myanswer: myanswers,   // myanswer = ชื่อเดิม เผื่อโค้ดอื่นยังเรียกอยู่
    saveanswer, myprogress, setstatus, getstatus
}