// Пример сервиса репликации
exports.pushReplication = async () => {
    try {
        // Перебираем локальные сервера и отправляем данные на каждый из них
        for (const server of Object.values(config)) {
            // Пропускаем центральный сервер
            if (server.STUDENT_NUMBER !== 0) { 
                const allTelemetryData = await Cl1.findMany({
                    where: {
                        // Ищем записи, где studentNumber равен STUDENT_NUMBER локального сервера
                        studentNumber: server.STUDENT_NUMBER 
                    }
                });
                const response = await axios.post(`${server.ADDRESS}/replicate`, allTelemetryData);
                console.log(`Data replicated to local server ${server.PORT}:`, response.data);
            }
        }
    } catch (error) {
        throw new Error('Failed to pushReplicate data to local servers');
    }
};

exports.pullReplication = async () => {
    try {
        for (const server of Object.values(config)) {
            // Пропускаем центральный сервер
            if (server.STUDENT_NUMBER !== 0) { 
                const response = await axios.get(`${server.ADDRESS}/replicate`);
                console.log(`Data replicated to local server ${server.PORT}:`, response.data);
            }
        }
    } catch (error) {
        throw new Error('Failed to pullReplicate data to local servers');
    }
};
