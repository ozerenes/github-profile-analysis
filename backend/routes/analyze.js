/**
 * Routes: ingest, extract-profile (analyze added in later phases).
 * All require CV upload (multipart); optional URL fields in body.
 */

const express = require('express');
const { cvUpload } = require('../middleware/upload');
const { postIngest, postExtractProfile } = require('../controllers/analyzeController');

const router = express.Router();

router.post('/ingest', cvUpload, postIngest);
router.post('/extract-profile', cvUpload, postExtractProfile);

module.exports = router;
