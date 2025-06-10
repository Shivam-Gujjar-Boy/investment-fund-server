const express = require('express');
const router = express.Router();
const { createUser, getUserByWallet, updateUserFunds } = require('../controllers/userController');

router.post('/', createUser); // Create or register user
router.get('/:wallet', getUserByWallet); // Get user by wallet address
router.put('/:wallet/funds', updateUserFunds); // Add or update user's funds
module.exports = router;