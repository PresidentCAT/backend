require('dotenv').config()
const express = require('express')
const cors = require('cors')



const application = express()

const port = process.env.PORT || 5000;

application.use(express.json())
application.use(cors())

application.use('/api/auth', require('./router/authrouter'))

application.listen(port, () => {
    console.log(`SERVER is running at ${port}`);
})