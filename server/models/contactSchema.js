const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: new Date(),
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    readed: {
        type: Boolean,
        default: false,
    }
});
const contact = mongoose.model('contact', contactSchema);
module.exports = contact;