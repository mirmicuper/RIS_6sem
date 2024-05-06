const databaseService = require('../services/databaseService');
const logger = require('../utils/logger');


// Выталкивающая репликация
exports.pushReplicationController = async (req, res) => {
    try {
        // Расспакуем данные которые нам пришли в req
        const modelData = req.body;

        // Валидация данных
        if (!modelData) {
            throw new Error('Неверный формат данных');
        }

        // Вставляем данные в бд
        await databaseService.InsertDataIntoDB(modelData);

        logger.info('Данные успешно добавлены в базу данных');

        // Отправка подтверждения клиенту
        res.status(200).json({ message: 'Данные успешно добавлены в базу данных' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Вытягивающая репликация
exports.pullReplicationController = async (req, res) => {
    try {
        // Получение всех данных из базы данных
        const allData = await databaseService.getAllDataFromDB();

        // Отправка данных клиенту
        res.status(200).json(allData);
    } catch (error) {
        // Логирование ошибки
        logger.error(`Не удалось получить данные репликации.: ${error.message}`);
        
        // Отправка клиенту сообщения об ошибке
        res.status(500).json({ error: 'Не удалось получить данные репликации.' });
    }
};

