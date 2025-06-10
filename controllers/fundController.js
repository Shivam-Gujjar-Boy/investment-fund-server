// controllers/fundController.js
const Fund = require('../models/Fund');

exports.createFund = async (req, res) => {
  const { name } = req.body;
  try {
    const fund = new Fund({
      name,
    });
    await fund.save();
    res.status(201).json(fund);
  } catch (err) {
    res.status(500).json({ error: 'Server error creating fund' });
  }
};

exports.checkFundByName = async (req, res) => {
  const name = req.params.name;
  try {
    const fundExists = await Fund.exists({name});
    if (fundExists) {
      res.status(200).json({exists: true});
    } else {
      res.status(200).json({exists: false});
    }
  } catch (err) {
    res.status(500).json({error: 'Server error checking fund existence'});
  }
};
