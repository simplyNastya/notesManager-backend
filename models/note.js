const { Schema, model, mongoose } = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
}, {timestamps: true}
)

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500,
    disable_hooks: true
})

const Note = model('note', noteSchema)

module.exports = Note