const mongoose = require('mongoose')


const blogsSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    userId:{ 
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Users'
    }
})

blogsSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        returnedObject.userId = returnedObject.userId.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blogs', blogsSchema)