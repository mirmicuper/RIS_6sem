const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/system/time', controller.getSystemTime);

module.exports = router;
