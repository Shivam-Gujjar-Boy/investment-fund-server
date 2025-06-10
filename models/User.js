const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    wallet: {
        type: String,
        required: true,
        unique: true,
    },
    funds: [
        {
            type: String,
            required: true,
        },
    ]
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);