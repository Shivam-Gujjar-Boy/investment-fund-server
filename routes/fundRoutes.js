const express = require('express');
const router = express.Router();
const { createFund, checkFundByName } = require('../controllers/fundController');

router.post('/', createFund); // Create a new fund
router.get('/exists/:name', checkFundByName); // Check if fund exists with this name

module.exports = router;