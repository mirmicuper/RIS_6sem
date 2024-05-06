const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// Роутеры для обработки процесса репликации
router.get('/replicate', controller.pullReplicationController);
router.post('/replicate', controller.pushReplicationController);

module.exports = router;
