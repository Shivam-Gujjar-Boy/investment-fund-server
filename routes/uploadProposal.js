const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const {initStorachaClient} = require('../storachaClient')
const { error } = require('console')
const {File, Blob} = require('buffer')
const bs58 = require('bs58');

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

        const {client, space} = await initStorachaClient();

        const timestamp = Date.now();
        const fundName = proposal.name || '';
        const filename = `proposal_${fundName}_${timestamp}.json`;

        const blob = new Blob([JSON.stringify(proposal)], {
            type: 'application/json',
        });

        const file = new File([blob], filename);
        const cidObject = await client.uploadFile(file);
        console.log(typeof cidObject);
        console.log("cid:", cidObject['/']);
        const cidBuffer = cidObject['/'];
        const cidStr = bs58.encode(cidBuffer);
        console.log("hash:", hash);

        res.status(200).json({cidStr, hash});
    } catch (err) {
        console.error('Error uploading to Storacha:', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

module.exports = router;