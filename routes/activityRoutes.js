const express = require('express');
const router = express.Router();
const FundLogs = require('../models/FundLogs');

// GET /api/activity/:fund
router.get('/:fund', async (req, res) => {
  const fund = req.params.fund;

  try {
    const fundDoc = await FundLogs.findOne({ fund });

    if (!fundDoc) {
      return res.status(404).json({ message: 'Fund not found' });
    }
    console.log('Here');

    res.json({
      fund: fundDoc.fund,
      name: fundDoc.name || '',
      logs: fundDoc.logs.sort((a, b) => {
        const aTime = BigInt(a.timestamp);
        const bTime = BigInt(b.timestamp);
        if (aTime > bTime) return -1;
        if (aTime < bTime) return 1;
        return 0;
      }),
    });
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
