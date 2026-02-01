/**
 * Routes: ingest (extract-profile and analyze added in later phases).
 * All require CV upload (multipart); optional URL fields in body.
 */

const express = require('express');
const { cvUpload } = require('../middleware/upload');
const { postIngest } = require('../controllers/analyzeController');

const router = express.Router();

router.post('/ingest', cvUpload, postIngest);

module.exports = router;
