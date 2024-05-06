const logger = require('../utils/logger');

exports.getCurrTime = async (req, res) => {
    try {
        const dateTime = new Date();
        console.log(`qweasd ${dateTime}`)
        // Отправляем текущее время клиенту
        res.status(200).json(dateTime);
    } catch (error) {
        // Логирование ошибки
        logger.error(`Не удалось получить текущее время: ${error.message}`);
        // Отправка клиенту сообщения об ошибке
        res.status(500).json({ error: 'Не удалось получить текущее время' });
    }
};