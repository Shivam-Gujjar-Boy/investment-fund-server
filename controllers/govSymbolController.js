const GovSymbol = require("../models/GovSymbol");

exports.addGovSymbol = async (req, res) => {
  const { govSymbol } = req.body;
  try {
    const govSymboll = new GovSymbol({
      govSymbol,
    });
    await govSymboll.save();
    res.status(201).json(govSymboll);
  } catch (err) {
    res.status(500).json({ error: 'Server error adding gov symbol' });
  }
};

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