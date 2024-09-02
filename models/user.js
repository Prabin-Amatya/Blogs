const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName: 
    {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    passwordHash: String,
    blogIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blogs'
        }
    ]
})

mongoose.set('toJSON',{
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject._id
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('Users', userSchema)