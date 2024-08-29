const mongoose = require('mongoose')

const blogsSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogsSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blogs', blogsSchema)