const express = require('express');
const { protect } = require('../middleware/auth');
const { getUserById, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);

module.exports = router;

