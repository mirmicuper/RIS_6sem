const express = require('express');
const logger = require('./utils/logger');
const router = require('./routes/router');
const globalConfig = require('../config/globalConfig');
const replicator = require('./services/replicationService')

// Подключение Prisma клиента
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

const PORT = globalConfig.MAIN_SERVER.PORT


app.use(express.json());

// Подключение роутов
app.use('/', router);

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
        logger.info('Connected to database');

        logger.info(`Server is running on port ${PORT}`);
    } catch (error) {
        logger.error('Failed to connect to database:', error);
        process.exit(1); // Завершаем процесс с кодом ошибки
    }
});