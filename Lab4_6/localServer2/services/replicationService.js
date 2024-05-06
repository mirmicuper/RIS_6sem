const databaseService = require('./databaseService');

// Пример сервиса репликации
exports.pushReplication = async () => {
    try {
        // Перебираем локальные сервера и отправляем данные на каждый из них
        for (const server of Object.values(config)) {
            // Пропускаем центральный сервер
            if (server.STUDENT_NUMBER !== 0) { 
                // Ищем записи, где studentNumber равен STUDENT_NUMBER локального сервера
                const allTelemetryData = await Cl1.findMany({
                    where: {
                        studentNumber: server.STUDENT_NUMBER 
                    }
                });
                const response = await axios.post(`${server.ADDRESS}/replicate`, allTelemetryData);
                console.log(`Данные реплицируются на локальный сервер ${server.PORT}:`, response.data);
            }
        }
    } catch (error) {
        throw new Error('Не удалось отправить данные репликации на локальные серверы.');
    }
};

exports.pullReplication = async () => {
    try {
        for (const server of Object.values(config)) {
            // Пропускаем центральный сервер
            if (server.STUDENT_NUMBER !== 0) { 
                const response = await axios.get(`${server.ADDRESS}/replicate`);
                // Проверка на корректность полученных данный и последующее добавление их в бд
                if (response && response.data && response.data.length > 0) {
                    for (const data of response.data) {
                        await databaseService.InsertDataIntoDB(data);
                        logger.info(`Данные реплицируются на локальный сервер ${server.PORT}:`, data);
                    }
                } else {
                    logger.warn(`Никакие данные не реплицируются с центрального сервера на локальный сервер. ${server.PORT}`);
                }
            }
        }
    } catch (error) {
        logger.error('Не удалось перенести данные репликации на локальные серверы.:', error);
        throw new Error('Не удалось перенести данные репликации на локальные серверы.');
    }
};
