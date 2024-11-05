const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/userController');

router.get('/generate-report', generateReport);

module.exports = router;
