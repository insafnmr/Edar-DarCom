const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    AddedAt: {
        type: Date,
        default: Date.now,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    nbr_room: {
        type: Number,
        required: true,
    },
    nbr_bed: {
        type: Number,
        required: true,
    },
    nbr_bathroom: {
        type: Number,
    },
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: [{
        imageURL: String,
        public_id: String,
    }],
    isValidated: {
        type: Boolean,
    },
    assets: {
        Wifi: { type: Boolean, default: false },
        swimmingPool: { type: Boolean, default: false },
        garden: { type: Boolean, default: false },
        tv: { type: Boolean, default: false },
        carPark: { type: Boolean, default: false },
        airConditioner: { type: Boolean, default: false },
    },
    capacity: {
        type: Number,
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            reviewOwner: { type: mongoose.Types.ObjectId, ref: 'user' },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            createdAt: {
                type: Date,
                default: new Date(),
            },
        },
    ],
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    reserved: {
        type: Boolean,
        default: false
    },

});
const house = mongoose.model('house', houseSchema);
module.exports = house;
