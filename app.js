const express = require('express')
const cors = require('cors')
const app = express()
const blogRouter = require('./controllers/blogController')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


mongoose.set('strictQuery',false)

mongoose.connect(config.MONGO_URI)
.then(() => 
{ 
   logger.info("Connected Successfully")
})
.catch(error =>
{
   logger.info("Error", error.message)
})

app.use(cors())
app.use(express.json())
app.use('/api/blogs',blogRouter)

module.exports = app