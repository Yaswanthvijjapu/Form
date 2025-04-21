const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createForm, getForms, getFormById, updateForm, deleteForm, getFormByShareLink } = require('../controllers/formController');

const router = express.Router();

// Protected routes
router.route('/').post(protect, createForm).get(protect, getForms); // Add protect to POST
router.route('/:id').get(protect, getFormById).put(protect, updateForm).delete(protect, deleteForm);

// Public route for shareLink
router.get('/share/:shareLink', getFormByShareLink);

module.exports = router;