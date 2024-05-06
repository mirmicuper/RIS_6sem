const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

// Роутер для ответа на запрос о текущем времени сервера 
router.get('/getCurrTime', controller.getCurrTime);

module.exports = router;