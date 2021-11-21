const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({

    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "user",
        required: true,
    },
},
    { timestamps: true }
);
const chat = mongoose.model('conversations', chatSchema);
module.exports = chat;

