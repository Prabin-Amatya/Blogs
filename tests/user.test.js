const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const _user = require('../models/user')
const userRouter = require('../controllers/userController')
const bcrypt = require("bcryptjs")

const api = supertest(app)

describe("Adding a new user", ()=>{
    beforeEach(async() =>{
        await _user.deleteMany({}) 
        const passwordHash = await bcrypt.hash("password", 10)
        const user = new _user({userName:"root", passwordHash})
        await user.save()
    })

    test("creation succeeds with a fresh username", async() =>{

        const usersAtStart = await helper.usersInDb()

        console.log(usersAtStart)

        const new_user = {
            userName:"testUser",
            name: "test",
            password: "password"
        }

        await api
            .post('/api/users')
            .send(new_user)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length+1)
        assert(usersAtEnd.some(user => user.userName == 'testUser'))
    })

    test("creation fails with a duplicate username", async() =>{

        const usersAtStart = helper.usersInDb()

        const new_user = {
            userName:"root",
            name: "test",
            password: "password"
        }

        const response = await api
                            .post('/api/users')
                            .send(new_user)
                            .expect(400)

        const usersAtEnd = helper.usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        assert(response.body.error.includes("expected 'username' to be unique"))
    })
})





