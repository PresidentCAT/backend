const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const application = express()

const port = process.env.PORT || 5000;




application.use(express.json())
application.use(cors())
application.use(morgan('dev'))

application.use('/api/auth', require('./router/authrouter'))

application.use('/api/assignment', require('./router/assignmentrouter'))

application.use('/api/admin', require('./router/adminrouter'))

application.use('/api/evaluatee', require('./router/evalrouter'))

application.listen(port, () => {
    console.log(`SERVER is running at ${port}`);
})
