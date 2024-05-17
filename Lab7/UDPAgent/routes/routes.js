const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/time', controller.getTime);

module.exports = router;
