require('dotenv')
const Blog = require('../models/blog')
const blogRouter = require('express').Router()
const for_testing = require('../utils/for_testing')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async(request, response) => {
     blogs = await Blog.find({}).populate('userId')
     response.status(200).json(blogs)
})

blogRouter.get('/:id', async(request, response) => {
  
  const blog = await Blog.findById(request.params.id)
  if(blog)
    response.status(200).json(blog)
  else
    response.status(400).end()
})


blogRouter.get('/totalLikes', async(request, response) => {
  blogs = await Blog.find({})
  response.status(200).json(for_testing.total_likes(blogs))
})

blogRouter.get('/mostLiked', async (request, response) => {
  blogs = await Blog.find({})
  response.status(200).json(for_testing.most_liked(blogs))
})

blogRouter.get('/mostBlogsAuthor', async (request, response) => {
  blogs = await Blog.find({})
  response.status(200).json(for_testing.most_blogs_author(blogs))
})

blogRouter.get('/mostLikedAuthor', async (request, response) => {
  blogs = await Blog.find({})
  response.status(200).json(for_testing.most_liked_author(blogs))
})


blogRouter.post('/', async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if(!decodedToken.id)
    return response.status(401).json({error: "token invalid"})

  if(!request.body.title || !request.body.url)
    response.status(400).end()

  if(!request.body.likes)
    request.body.likes = 0

  const user = await User.findById(decodedToken.id)
  request.body.userId = user.id

  const blog = new Blog(request.body)
  const saved_blog = await  blog.save()

  user.blogIds = user.blogIds.concat(saved_blog._id)
  await user.save()

  response.status(201).json(saved_blog)
})

blogRouter.put('/:id', async (request, response) => {
  const new_blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {new:true} ,{runValidators:true, context:'query'})
  response.status(200).json(new_blog)
})

blogRouter.delete('/:id', async(request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if(!decodedToken.id)
  {
    return response.status(400).json({error: "Token Invalid"})
  }
  const deleted_blog = await Blog.findByIdAndDelete(request.params.id)

  if(!deleted_blog)
  {
    return response.status(400).json({error: "Blog not found"})
  }
  const userId = deleted_blog.userId.toString()
  const user = await User.findById(userId)
  user.blogIds = user.blogIds.map(blog => blog.id !== deleted_blog.id)
  response.status(204).end()
})

module.exports = blogRouter