const gr = require('./gr')
gr.global_require()

//call environment variables
require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

//MongoDB connection
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', err => {
  console.error(err)
})

db.on('open', () => {
  console.log('--> Connected to MongoDB instance')
})

//authentication
const authRouter = appRequire('/routes/auth')

//API version mapped by /routes/<version>
const v1 = appRequire('/routes/v1')

//middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

//middleware routes
app.use('/auth', authRouter)
app.use('/v1', v1)

 //listening
 app.listen(process.env.APP_PORT)

 module.exports = app