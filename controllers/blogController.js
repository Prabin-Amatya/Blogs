const Blog = require('../models/blog')
const blogRouter = require('express').Router()
const for_testing = require('../utils/for_testing')

blogRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })

blogRouter.get('/totalLikes', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(for_testing.total_likes(blogs))
    })
})

blogRouter.get('/mostLiked', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(for_testing.most_liked(blogs))
    })
})

blogRouter.get('/mostBlogsAuthor', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(for_testing.most_blogs_author(blogs))
    })
})

blogRouter.get('/mostLikedAuthor', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(for_testing.most_liked_author(blogs))
    })
})


blogRouter.post('/', (request, response) => {
const blog = new Blog(request.body)

blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogRouter