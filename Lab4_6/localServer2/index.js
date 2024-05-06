const express = require('express');
const globalConfig = require('../config/globalConfig');
const logger = require('./utils/logger');
const router = require('./routes/router');
const generator = require('./services/generateService')
const syncronator = require('./services/syncTimeService')

// Подключение Prisma клиента
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

const studentNumber = globalConfig.LOCAL_SERVER_2.STUDENT_NUMBER;
const PORT = globalConfig.LOCAL_SERVER_2.PORT

app.use(express.json());

// Подключение роутов
app.use('/', router);

setInterval(() => {
    generator.generateModelData(studentNumber);
    console.log('Генерация данных...');
}, 25000);


app.listen(PORT, async () => {
    try {
        // Подключение к базе данных
        await prisma.$connect();
        logger.info('Подключено к базе данных');

        // Логика для запуска сервера
        logger.info(`Сервер работает на порту ${PORT}`);

        await syncronator.syncTime(globalConfig);
    } catch (error) {
        logger.error('Не удалось подключиться к базе данных:', error);
        process.exit(1); // Завершаем процесс с кодом ошибки
    }
});