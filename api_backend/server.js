const express =require('express')
const cors =require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const { readdirSync } = require('fs')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json({limit:'20mb'}))
app.use(cors())

readdirSync('./Routes').map((r) => app.use('/api/approve_pro', require('./Routes/'+r)))

const port = process.env.PORT

app.listen(port, ()=>{
    console.log('Server is running on port '+port)
})