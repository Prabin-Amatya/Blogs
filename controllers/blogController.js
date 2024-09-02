require('dotenv')
const Blog = require('../models/blog')
const blogRouter = require('express').Router()
const for_testing = require('../utils/for_testing')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) =>{
  const authorization = request.get("authorization")
  if(authorization && authorization.startsWith("Bearer"))
    return authorization.replace('Bearer ', "")
  
  return null
}

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

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

  if(!decodedToken.id)
    return response.status(401).json({error: "token invalid"})

  const user = await User.findById(decodedToken.id)

  if(!request.body.title || !request.body.url)
    response.status(400).end()

  if(!request.body.likes)
    request.body.likes = 0
  
  const blog = new Blog(request.body)
  const saved_blog = await  blog.save()

  user.blogIds = user.blogIds.concat(saved_blog._id)
  await user.save()

  response.status(201).json(saved_blog)
})

blogRouter.put('/:id', async (request, response) => {
  const new_blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {new:true} ,{runValidators:true, context:'query'})
  console.log(new_blog)
  response.status(200).json(new_blog)
})

blogRouter.delete('/:id', async(request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogRouter