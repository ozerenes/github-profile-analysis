/**
 * Routes: score, role-fit (learning-roadmap, report added in later phases).
 * All require JSON body with profile.
 */

const express = require('express');
const {
  requireProfile,
  postScore,
  postRoleFit,
  postLearningRoadmap,
  postReport,
} = require('../controllers/reportController');

const router = express.Router();

router.post('/score', requireProfile, postScore);
router.post('/role-fit', requireProfile, postRoleFit);
router.post('/learning-roadmap', requireProfile, postLearningRoadmap);
router.post('/report', requireProfile, postReport);

module.exports = router;
