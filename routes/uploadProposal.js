const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const {File, Blob} = require('@web3-storage/w3up-client')
const {initStorachaClient} = require('../storachaClient')
const { error } = require('console')

function computeSHA256(obj) {
    const jsonStr = JSON.stringify(obj)
    return crypto.createHash('sha256').update(jsonStr).digest('hex')
}

router.post('/upload-proposal', async (req, res) => {
    try {
        const proposal = req.body;

        if (!proposal || typeof proposal !== 'object') {
            return res.status(400).json({error: 'Invalid proposal payload'});
        }

        const hash = computeSHA256(proposal);

        const {client} = await initStorachaClient();

        const timestamp = Date.now();
        const fundName = proposal.name || '';
        const filename = `proposal_${fundName}_${timestamp}.json`;

        const blob = new Blob([JSON.stringify(proposal)], {
            type: 'application/json',
        });

        const file = new File([blob], filename);
        const cid = await client.uploadFile(file);

        res.status(200).json({cid, hash})
    } catch (err) {
        console.error('Error uploading to Storacha:', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

module.exports = router;