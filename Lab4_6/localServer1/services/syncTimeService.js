const axios = require('axios');
const logger = require('../utils/logger');

exports.syncTime = async (config) => {
    try {
        // Получаем время для глобального сервера 
        const serverResponse = await axios.get(`${config.MAIN_SERVER.ADDRESS}/getCurrTime`);
        
        // Получаем время нашего локального сервера
		const localTime = new Date();

        // Вычисляем разницу
        console.log(`${serverResponse.data} ${localTime}`)
        const diffMilliseconds = localTime - new Date(serverResponse.data);

        console.log(`${serverResponse.data} ${localTime} ${diffMilliseconds}`)

        logger.info(`Временная коррекция для сервера ${config.MAIN_SERVER.ADDRESS} => ${diffMilliseconds}`)
    } catch (error) {
        logger.error(error)
        throw new Error('Не удалось синхронизировать время.');
    }
};