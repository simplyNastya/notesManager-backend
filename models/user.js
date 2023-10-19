const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    password: {
        type: String,
        required: [true, 'Set password for user']
    },
    roles: [{
        type: String,
        default: 'Employee'
    }],
    active: {
        type: Boolean,
        default: true
    },
})

const User = model('user', userSchema)

module.exports = User