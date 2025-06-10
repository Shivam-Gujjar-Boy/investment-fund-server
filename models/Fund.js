const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model('Fund', fundSchema);