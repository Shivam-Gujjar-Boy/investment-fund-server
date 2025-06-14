const mongoose = require('mongoose')

const govSymbolSchema = new mongoose.Schema({
    govSymbol: {
        type: String,
        required: true,
        unquie: true,
    }
}, {timestamps: true});

module.exports = mongoose.model('GovSymbol', govSymbolSchema);