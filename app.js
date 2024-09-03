//libraries
require('express-async-errors')
const express = require('express')
const cors = require('cors')
//express
const app = express()
//controllers
const blogRouter = require('./controllers/blogController')
const userRouter = require('./controllers/userController')
const loginRouter = require('./controllers/loginController')
//utils
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
//mongoose
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
app.use(middleware.tokenExtractor)
app.use('/api/users',userRouter)
app.use('/api/login',loginRouter)
app.use('/api/blogs',blogRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app