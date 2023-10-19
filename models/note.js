const { Schema, model, default: mongoose } = require('mongoose')
const AutoInctement = require('mongoose-sequence')(mongoose)

const noteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Username is required']
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
},
{timestamps: true, versionKey: false }
)

noteSchema.plugin(AutoInctement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500 
})

const Note = model('note', noteSchema)

module.exports = Note