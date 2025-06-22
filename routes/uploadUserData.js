const express = require('express');
const router = express.Router();
const multer = require('multer');
const { initStorachaClient } = require('../storachaClient');
const { File, Blob } = require('buffer');
const bs58 = require('bs58');

const upload = multer(); // for multipart/form-data

router.post('/upload-user-data', upload.single('image'), async (req, res) => {
  try {
    const { username, email } = req.body;
    const fileBuffer = req.file?.buffer;
    const originalName = req.file?.originalname;

    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }

    const { client } = await initStorachaClient();

    // Build File objects array for directory
    const files = [];

    // Add image if exists
    if (fileBuffer && originalName) {
      const imageFile = new File([fileBuffer], 'profile.jpg', {
        type: req.file.mimetype,
      });
      files.push(imageFile);
    }

    // Create metadata.json
    const metadata = {
      username: username.trim(),
      email: email.trim(),
      image: fileBuffer ? 'profile.jpg' : null,
    };

    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    });
    const metadataFile = new File([metadataBlob], 'metadata.json');
    files.push(metadataFile);

    // Upload the directory to IPFS
    const dirCidObject = await client.uploadDirectory(files);

    const cidObject = JSON.stringify(dirCidObject, null, 2);
    console.log(cidObject.length);
    let dirCid = '';
    for (let i=10; i<cidObject.length; i++) {
        if (cidObject[i] !== `"`) {
            dirCid += cidObject[i];
        } else {
            break;
        }
    }

    res.status(200).json({
      success: true,
      cidObject: dirCidObject,
      folderCid: dirCid,
      metadataUrl: `https://${dirCid}.ipfs.w3s.link/metadata.json`,
      imageUrl: fileBuffer ? `https://${dirCid}.ipfs.w3s.link/profile.jpg` : null,
    });
  } catch (err) {
    console.error('Error uploading directory to Storacha:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
