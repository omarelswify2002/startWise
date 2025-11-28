const express = require('express');
const {
  getPlatformStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getReports,
  verifyProfile,
  verifyUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getPlatformStats);
router.get('/reports', getReports);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/verify/:type/:id', verifyProfile);
router.put('/users/:id/verify', verifyUser);

module.exports = router;

