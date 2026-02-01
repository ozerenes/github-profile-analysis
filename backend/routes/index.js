/**
 * Mount API and health routes.
 */

const express = require('express');
const analyzeRoutes = require('./analyze');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/api', analyzeRoutes);

module.exports = router;
