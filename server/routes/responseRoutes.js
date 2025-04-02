// src/routes/responseRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Import protect
const { submitResponse, getResponses, exportResponses } = require('../controllers/responseController');

const router = express.Router();

router.post('/:formId', submitResponse);
router.get('/:formId', protect, getResponses); // Use protect here
router.get('/export/:formId', protect, exportResponses); // Use protect here

module.exports = router;