const generateService = require('../services/generateService');
const monitoringService = require('../services/monitoringService');
const replicationService = require('../services/replicationService');
const syncTimeService = require('../services/syncTimeService');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Добавьте другие методы контроллера
