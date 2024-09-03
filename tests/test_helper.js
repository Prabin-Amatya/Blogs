require('dotenv')
const blog = require('../models/blog')
const _user = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const nonExistingId = async () => {
  const blog = new Note({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await blog.find({})
  return blogs.map(Blog => Blog.toJSON())
}

const usersInDb = async () => {
  const users = await _user.find({})
  return users.map(user => user.toJSON())
}

const createAndLoginUser = async() => {
  await _user.deleteMany({}) 
  const passwordHash = await bcrypt.hash("password", 10)
  const user = new _user({userName:"root", passwordHash})
  await user.save()
  const userTokenFor = {
    userName : user.userName,
    id: user._id
  }
  return jwt.sign(userTokenFor, process.env.SECRET, {expiresIn: 60})
}

const getInitialBlogs = async() => {
   const user = await _user.findOne({})
   const initialBlogs = [ 
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        userId: mongoose.Types.ObjectId.createFromHexString(user.id),
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        userId: mongoose.Types.ObjectId.createFromHexString(user.id),
        __v: 0
    }]

    return initialBlogs
}


module.exports = {
  getInitialBlogs, nonExistingId, blogsInDb, usersInDb, createAndLoginUser
}