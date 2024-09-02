require('dotenv')
const _user = require('../models/user')
const _loginRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

_loginRouter.post('/', async(request, response) =>{
    
    const {userName, password} = request.body
    const user = await _user.findOne({userName})
    const passwordCorrect = user === null 
                                ? false
                                : await bcrypt.compare(password, user.passwordHash)

    if(!(user && passwordCorrect))
    {
        return response.status(401).json({error: "username or password incorrect"})
    }

    const userTokenFor= {
        userName: user.userName,
        id: user._id
    } 

    const token = jwt.sign(userTokenFor, process.env.SECRET, {expiresIn: 60*60})
    response
        .status(200)
        .json({token, userName: user.userName, name: user.name})
})

module.exports = _loginRouter
