const express = require('express');
const router = express.Router();
const {checkGovBySymbol, addGovSymbol} = require('../controllers/govSymbolController');

router.get('/:govSymbol', checkGovBySymbol);
router.post('/add', addGovSymbol);

module.exports = router;