const logger = require('../utils/logger');
const axios = require('axios');
const databaseService = require('./databaseService')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.pushReplication = async (config) => {
    try {
        // Перебираем локальные сервера и отправляем данные на каждый из них
        for (const server of Object.values(config)) {
            // Пропускаем центральный сервер
            if (server.STUDENT_NUMBER !== 0) { 
                
                // Ищем записи, где studentNumber равен STUDENT_NUMBER локального сервера
                const allTelemetryData = await prisma.cl1.findMany({
                    where: {
                        studentNumber: server.STUDENT_NUMBER 
                    }
                });

                // Проверяем, есть ли данные для синхронизации
                if (allTelemetryData.length === 0) {
                    console.log(`Данные для сервера ${server.PORT} не найдены. Пропуск репликации.`);
                    continue; // Переходим к следующему серверу
                }
                try {
                    const response = await axios.post(`${server.ADDRESS}/replicate`, allTelemetryData);
                    console.log(`Данные реплицируются на локальный сервер ${server.PORT}`);
                } catch (error) {
                    console.error(`Не удалось отправить данные репликации с сервера ${server.ADDRESS}. Сервер может быть недоступен...`);
                }
                
            }
        }
    } catch (error) {
        throw new Error('Не удалось отправить данные репликации на локальные серверы.');
    }
};

exports.pullReplication = async (config) => {
    try {
        for (const server of Object.values(config)) {
            console.log(server.ADDRESS);
            if (server.STUDENT_NUMBER !== 0) { 
                try {
                    const response = await axios.get(`${server.ADDRESS}/replicate`);
                    if (response.status === 200) {
                        console.log(`Данные реплицируются на локальный сервер ${server.PORT}:`, response.data);
                        try {
                            await databaseService.InsertDataIntoDB(response.data);
                        } catch (error) {
                            console.log(error)
                        }
                    } else {
                        console.error(`Не удалось получить данные репликации с сервера ${server.ADDRESS}:${server.PORT}. Сервер ответил статусом: ${response.status}`);
                    }
                } catch (error) {
                    console.error(`Не удалось подключиться к серверу ${server.ADDRESS}:${server.PORT}. Ошибка: ${error.code}`);
                }
            }
        }
    } catch (error) {
        console.error('Ошибка в pullReplication:', error);
    }
};
