const User = require('../models/user')
const Note = require('../models/note')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const getAllUsers = asyncHandler(async (req, res) => {
    const result = await User.find().select('-password').lean()
    if (!result) {
        return res.status(400).json({message: 'No users found'})
    } 
    res.json(result)
})

const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body
    
    // Confirm data
    if (!username || !password || !roles.length || !Array.isArray(roles)) {
        return res.status(400).json({message: 'All fields are required'})
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    
    if (duplicate) {
        return res.status(409).json({message: 'Duplicate username'})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userObject = { username, 'password': hashedPassword, roles }
    
    // Create and store new user
    const result = await User.create(userObject)

    if (result) {
        res.status(201).json({message: `New user ${username} created`})
    } else {
        res.status(400).json({message: 'Invalid user data received'})
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body
    
    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.lenght || typeof active !== 'boolean') {
        return res.status(400).json({message: 'All fields are requared'})
    }

    const result = await User.findById(id).exec()

    if (!result) {
        return res.status(400).json({message: 'User not found'})
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Duplicate username'})
    }

    result.username = username
    result.roles = roles
    result.active = active
    
    if (password) {
        result.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await result.save()

    res.json({message: `${updateUser.username} updated`})
})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        res.status(400).json({message: 'User ID Required'})
    }

    const notes = await Note.findOne({ user: id }).lean().exec()
    
    if (notes?.length) {
        return res.status(400).json({message: `User has assigned notes`})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(404).json({message: 'User not found'})
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser, 
    updateUser,
    deleteUser
}