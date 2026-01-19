const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, dashboardController.getStats);
router.get('/usage', authMiddleware, dashboardController.getUsage);

module.exports = router;
