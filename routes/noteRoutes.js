const express = require('express')
const router = express.Router()
const notesControllers = require('../controllers/notesControllers')
const verifyJWT = require('../middlewares/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(notesControllers.getAllNotes)
    .post(notesControllers.createNewNote)
    .patch(notesControllers.updateNote)
    .delete(notesControllers.deleteNote)

module.exports = router