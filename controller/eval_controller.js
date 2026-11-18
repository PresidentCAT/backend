const evalmodel = require('../model/evalmodel')
const adminmodel = require('../model/admin_model')

const servererror = (res, error) => {
    console.log(error)
    res.status(500).json({ status: 'error', message: 'something wrong in server' })
}

// GET /api/eval/answers   -> ตัวชี้วัดทั้งหมด + คำตอบ/หลักฐานของตัวเอง
exports.getanswers = async (req, res) => {
    try {
        const data = await evalmodel.myanswers(req.user.id)
        res.json({ status: 'success', message: 'ok', data })
    } catch (error) { servererror(res, error) }
}

// POST /api/eval/answers   (multipart/form-data)
// body: indicator_id, self_score, evidence_url (ไม่บังคับ)   file: file (ไม่บังคับ)
exports.saveanswer = async (req, res) => {
    const { indicator_id, self_score, evidence_url } = req.body
    const evaluatee_id = req.user.id
    try {
        if (!indicator_id || self_score === undefined || self_score === '')
            return res.status(400).json({ status: 'error', message: 'please fill all field' })

        if (!(await adminmodel.getcurrentperiod()))
            return res.status(403).json({ status: 'error', message: 'evaluation is closed' })

        if ((await evalmodel.getstatus(evaluatee_id)) === 'submitted')
            return res.status(400).json({ status: 'error', message: 'already submitted' })

        const indicator = await adminmodel.getindicators2(indicator_id)
        if (!indicator) return res.status(404).json({ status: 'error', message: 'indicator not found' })

        // scale ต้องเป็นจำนวนเต็ม 1-4 / yesno ต้อง 0 หรือ 1
        const score = Number(self_score)
        const ok = indicator.score_type === 'yesno'
            ? [0, 1].includes(score)
            : Number.isInteger(score) && score >= 1 && score <= 4
        if (!ok) return res.status(400).json({ status: 'error', message: 'score out of range' })

        const filename = req.file ? req.file.filename : null
        await evalmodel.saveanswer(evaluatee_id, indicator_id, score, evidence_url || null, filename)
        res.status(201).json({ status: 'success', message: 'answer saved', data: { file: filename } })
    } catch (error) { servererror(res, error) }
}

// GET /api/eval/progress   -> status + ความคืบหน้าแยกหัวข้อ
exports.progress = async (req, res) => {
    try {
        const status = await evalmodel.getstatus(req.user.id)
        const topics = await evalmodel.myprogress(req.user.id)
        res.json({ status: 'success', message: 'ok', data: { status, topics } })
    } catch (error) { servererror(res, error) }
}

// POST /api/eval/submit   -> ส่งแบบประเมิน
exports.submit = async (req, res) => {
    try {
        if (!(await adminmodel.getcurrentperiod()))
            return res.status(403).json({ status: 'error', message: 'evaluation is closed' })
        await evalmodel.setstatus(req.user.id, 'submitted')
        res.json({ status: 'success', message: 'submitted', data: null })
    } catch (error) { servererror(res, error) }
}
