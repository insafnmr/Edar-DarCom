const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    arrivalDate: {
        type: Date,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    paymentMode: {
        type: String,
        enum: ['Cash', 'Card'],
        required: true,
    },
    payed: {
        type: Boolean,
        required: true,
        default: false
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        /* unique: true */
    },
    house: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'house',
        required: true,
       /*  unique: true */
    },
    isDone :{
        type:Boolean,
        default:false
    },
    nbr_nights: {
        type: Number,
        required: true,
    },
    total_guests: {
        type: Number,
        required: true,
    },
    total_price: {
        type: Number,
        required: true,
    },

});
const reservation = mongoose.model('reservation', reservationSchema);
module.exports = reservation;
