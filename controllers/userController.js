const User = require('../models/User');

exports.createUser = async (req, res) => {
    const { wallet } = req.body;
    try {
        let user = await User.findOne({ wallet });
        if (!user) {
            user = new User({ wallet});
            await user.save();
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error creating user' });
    }
};

exports.getUserByWallet = async (req, res) => {
    const wallet = req.params.wallet;
    try {
        const user = await User.findOne({ wallet });
        if (!user) return res.status(404).json({ error: 'User not found' });
        console.log("User found with address: ", wallet);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching user' });
    }
};

exports.updateUserFunds = async (req, res) => {
    const wallet = req.params.wallet;
    const { funds } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            {wallet},
            {$push: {funds: funds[0]}},
            {new: true}
        );
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error updating funds' });
    }
}