const express = require('express')
const cors = require('cors')
const { vrftoken } = require('./middleware/auth_middleware')

const application = express()

const port = process.env.PORT || 5000;

application.use(express.json())
application.use(cors())



application.listen(port, () => {
    console.log(`SERVER is running at ${port}`);
})