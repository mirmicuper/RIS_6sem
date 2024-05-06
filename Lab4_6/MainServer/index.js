const express = require('express');
const logger = require('./utils/logger');
const router = require('./routes/router');
const globalConfig = require('../config/globalConfig');
const replicator = require('./services/replicationService')

// Подключение Prisma клиента
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

app.use('/', router);

const PORT = globalConfig.MAIN_SERVER.PORT


app.use(express.json());

// Запуск синхронизации
setInterval(async () => {
    console.log('Выталкивающая синхронизация данных...');
    await replicator.pushReplication(globalConfig);
    console.log('Вытягивающая синхронизация данных...');
    await replicator.pullReplication(globalConfig);
}, 10000);


app.listen(PORT, async () => {
    try {
        // Подключение к базе данных
        await prisma.$connect();
        logger.info('Подключено к базе данных');

        logger.info(`Сервер работает на порту ${PORT}`);
    } catch (error) {
        logger.error('Не удалось подключиться к базе данных:', error);
        process.exit(1); // Завершаем процесс с кодом ошибки
    }
});