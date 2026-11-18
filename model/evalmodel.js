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
    const [indicators] = await pool.query(`SELECT * FROM indicators ORDER BY topic_id, id`)
    const [answers] = await pool.query(`SELECT * FROM answers WHERE evaluatee_id = ?`, [evaluatee_id])

    return indicators.map((i) => {
        const a = answers.find((x) => x.indicator_id === i.id)
        return {
            ...i,
            indicator_id: i.id,
            self_score: a ? a.self_score : null,
            evidence_url: a ? a.evidence_url : null,
            evidence_file: a ? a.evidence_file : null,
        }
    })
}

// ความคืบหน้าแยกหัวข้อ: ตอบแล้วกี่ข้อ จากทั้งหมดกี่ข้อ
const myprogress = async (evaluatee_id) => {
    const [topics] = await pool.query(`SELECT * FROM topics`)
    const [indicators] = await pool.query(`SELECT id, topic_id FROM indicators`)
    const [answers] = await pool.query(`SELECT indicator_id FROM answers WHERE evaluatee_id = ?`, [evaluatee_id])

    return topics.map((t) => {
        const inTopic = indicators.filter((i) => i.topic_id === t.id)
        const done = inTopic.filter((i) => answers.some((a) => a.indicator_id === i.id))
        return { topic_id: t.id, topic: t.name, total: inTopic.length, answered: done.length }
    })
}

module.exports = {
    myanswers, myanswer: myanswers,   // myanswer = ชื่อเดิม เผื่อโค้ดอื่นยังเรียกอยู่
    saveanswer, myprogress, setstatus, getstatus
}
