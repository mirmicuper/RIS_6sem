const generateService = require('../services/generateService');
const monitoringService = require('../services/monitoringService');
const replicationService = require('../services/replicationService');
const syncTimeService = require('../services/syncTimeService')


exports.getAllUsers = async (req, res) => {
    try {
        const newData = await generateService.generateModelData();
        res.json(newData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.replicationController = async (req, res) => {
    try {
        
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Добавьте другие методы контроллера
