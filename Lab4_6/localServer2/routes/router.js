const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// router.get('/', userController.getAllUsers);
// router.post('/', userController.createUser);
// Добавьте остальные маршруты

router.get('/getCurrTime', controller.getAllUsers);
router.get('/syncTime', controller.getAllUsers);

router.get('/getState', controller.getAllUsers);
router.post('/changeState', controller.getAllUsers);

router.get('/replicate', controller.getAllUsers);
router.post('/replicate', controller.createUser);

module.exports = router;
