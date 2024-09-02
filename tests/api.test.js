const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const blog = require('../models/blog')
const blogRouter = require('../controllers/blogController')


beforeEach(async() =>{
    await blog.deleteMany({})

    for(let Blog of helper.initialBlogs)
    {
        let new_blog = new blog(Blog)
        await new_blog.save()
    }
})

const api = supertest(app)

describe('When Notes are initially added', () =>
{
    test('blogs are returned as json', async () => {
        await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('there exists a specific blog', async() => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.some(content=>content.author == 'Michael Chan'), true)
    })
})


describe("Adding a specific note", ()=>
{
    test('a valid note can be added', async() => {
        const new_blog = {
            title: "React patterns",
            author: "Donald Duck",
            url: "https://reactpatterns.com/",
            likes: 7
        }
        await api.post('/api/blogs')
            .send(new_blog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await helper.blogsInDb()

        assert.strictEqual(response.some(content=>content.author == 'Donald Duck'), true)
        assert.strictEqual(response.length, helper.initialBlogs.length + 1)
    })



    test('if likes is missing likes defaults to 0', async() => {
        const new_blog = {
            title: "React patterns",
            author: "Donald Duck",
            url: "https://reactpatterns.com/"
        }

        const response = await api.post('/api/blogs')
            .send(new_blog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        assert.strictEqual(response.body.likes, 0)
    })

    describe("URL Or TITLE MISSING", () =>
    {
        test("When Url is missing", async()=>
        {
                const new_blog = {
                    title: "React patterns",
                    author: "Donald Duck"
                }
        
                await api.post('/api/blogs')
                    .send(new_blog)
                    .expect(400)
        })

        test("When title is missing", async()=>
        {
                const new_blog = {
                    author: "Donald Duck",
                    url: "donaldduck.com"
                }
        
                await api.post('/api/blogs')
                    .send(new_blog)
                    .expect(400)
        })

        test("When both are missing", async()=>
        {
                const new_blog = {
                    url: "donaldduck.com"
                }
        
                await api.post('/api/blogs')
                    .send(new_blog)
                    .expect(400)
        })

    })
})


describe("Viewing a specific note", ()=>
{
    test('get one note', async() => {
        const all_blogs = await helper.blogsInDb()
        const example_blog = all_blogs[0]
        const result_blog = await api.get(`/api/blogs/${example_blog.id}`)
                                .expect(200)
                                .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(result_blog.body, example_blog)
    })
})


describe("Remove a specific note", () =>
{
    test('delete one note', async() => {
        const all_blogs_start = await helper.blogsInDb()
        const example_blog = all_blogs_start[0]
        await api.delete(`/api/blogs/${example_blog.id}`)
                                .expect(204)

        const all_blogs_end = await helper.blogsInDb()
        assert(!all_blogs_end.some(blog => blog.author == example_blog.author))
        assert.deepStrictEqual(all_blogs_end.length, all_blogs_start.length-1)
    })
})

after(async() => {
    mongoose.connection.close()
})

describe("Updating a specific note", ()=>
{
    test('likes are updated properly', async() => {
        const new_blog = {
            likes:80000000
        }
        const response = await api.put(`/api/blogs/${helper.initialBlogs[0]._id}`)
            .send(new_blog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        assert.strictEqual(response.body.likes, new_blog.likes)
    })
}
)