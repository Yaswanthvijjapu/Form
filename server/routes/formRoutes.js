const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createForm, getForms, getFormById, updateForm, deleteForm } = require('../controllers/formController');

const router = express.Router();

router.use(protect); // Protect all form routes with JWT
router.route('/').post(createForm).get(getForms);
router.route('/:id').get(getFormById).put(updateForm).delete(deleteForm);

module.exports = router;