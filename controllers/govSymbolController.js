const GovSymbol = require("../models/GovSymbol");

exports.checkGovBySymbol = async (req, res) => {
    const govSymbol = req.params.govSymbol;
    try {
        const govSymbolExists = await GovSymbol.exists({govSymbol});
        if (govSymbolExists) {
            res.status(201).json({exists: true});
        } else {
            res.status(201).json({exists: false});
        }
    } catch (err) {
        res.status(500).json({error: 'Server error checking gov symbol existance'});
    }
}