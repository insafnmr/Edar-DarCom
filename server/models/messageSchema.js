const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversations',
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    textMessage: {
        type: String,
        required: true,
    },
},
    { timestamps: true }

);
const message = mongoose.model('message', messageSchema);
module.exports = message;
