const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    joinedAt: {
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
    birthDate: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: true,
        //        validate: { validator: validator.isEmail, message: 'Invalid email.' }        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please fill a valid email address',],
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    image: {
        imageURL: {
            type: String,
            default: "../assets/images/avatar.png"
        },
        public_id: {
            type: String,
            default: "user_avatar"
        }
    },
    role: {
        type: String,
        enum: ['admin', 'host', 'client'],
        default: 'client'
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
});
const user = mongoose.model('user', userSchema);
module.exports = user;