const mongoose = require('mongoose');

const reportsSchema = new mongoose.Schema({
    reportsDate: {
        type: Date,
        default: Date.now
    },
    message: {
        type: String,
        required: true,
    },   
    readed: {
        type: Boolean,
        default: false
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },


});
const reports = mongoose.model('reports', reportsSchema);
module.exports = reports;
