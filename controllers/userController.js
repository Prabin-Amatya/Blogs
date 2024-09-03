const _users = require('../models/user')
const _userRouter = require('express').Router()
const bcrypt = require('bcryptjs')

_userRouter.get('/', async (request, response) =>
{
    const users = await _users.find({}).populate('blogIds', {title:1, author:1, url:1, likes:1})
    response.status(200).json(users)
})

_userRouter.post('/', async (request, response) =>
{
    const {userName, name, password} = request.body

    if(password.length < 3)
        return response.status(400).json({error: "Password needs more than 3 character"})
    const saltRounds = 10
    const passwordHash  = await bcrypt.hash(password, saltRounds)
    
    const new_user = new _users(
        {userName, name, passwordHash}
    )

    const saved_user = await new_user.save()
    return response.status(201).json(saved_user)
})

module.exports = _userRouter