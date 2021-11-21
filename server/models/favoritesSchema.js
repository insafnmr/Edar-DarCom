const mongoose = require('mongoose');

const favoritesSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    house: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'house',
        required: true,
    },
    isLiked: {
        type: Boolean,
        default: false,
    }


});
const favorites = mongoose.model('favorites', favoritesSchema);
module.exports = favorites;
