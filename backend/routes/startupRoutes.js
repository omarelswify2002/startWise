const express = require('express');
const {
  getStartups,
  getStartup,
  createStartup,
  updateStartup,
  deleteStartup,
  uploadDocuments,
  getStartupByUserId,
  upload
} = require('../controllers/startupController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getStartups)
  .post(protect, authorize('Startup', 'Admin'), createStartup);

router.route('/:id')
  .get(getStartup)
  .put(protect, updateStartup)
  .delete(protect, deleteStartup);

router.post('/:id/upload', protect, upload.array('documents', 10), uploadDocuments);

router.get('/user/:userId', getStartupByUserId);

module.exports = router;

