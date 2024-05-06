const axios = require('axios');
const logger = require('../utils/logger');

// Метод возвращает текущее время
exports.getCurrTime = async () => {
    try {
        return new Date();
    } catch (error) {
        throw new Error('Не удалось получить текущее время');
    }
};

// Метод возвращает разницу между time1 и time2 
exports.getDiffTime = async (time1, time2) => {
    try {
        // Проверка на валидность времени
        // if (!(time1 instanceof Date) || !(time2 instanceof Date)) {
        //     throw new Error('Invalid time format');
        // }
        // Получаем разницу между двумя временами в миллисекундах
        const diffMilliseconds = Number(new Date(time1) - new Date(time2));
        console.log(`Разница во времени: ${diffMilliseconds} миллисекунд`);
        return diffMilliseconds;
    } catch (error) {
        throw new Error('Не удалось вычислить разницу во времени.');
    }
};


exports.syncTime = async (config) => {
    try {
        // Получаем время для нашего текущего локального сервера 
        const localTime = await this.getCurrTime();
        console.log(1)
        // Получаем время для глобального сервера 
        const serverResponse = await axios.get(`${config.MAIN_SERVER.ADDRESS}/getCurrTime`);
        const serverTimeStr = serverResponse.data;
        const serverTime = new Date(serverTimeStr);
        // Преобразуем строку времени в объект Date
        console.log(localTime)
        console.log(serverTime)
        // Получаем разницу во времени, это и будет нашей коррекцией
        const diffTime = await this.getDiffTime(localTime, serverTime.data)

        logger.info(`Временная коррекция для сервера ${config.MAIN_SERVER.ADDRESS} => ${diffTime}`)
    } catch (error) {
        logger.error(error)
        throw new Error('Не удалось синхронизировать время: ', error);
    }
};
