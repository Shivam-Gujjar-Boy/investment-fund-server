const express = require('express');
const router = express.Router();
const {checkGovBySymbol} = require('../controllers/govSymbolController');

router.get('/:govSymbol', checkGovBySymbol);

module.exports = router;