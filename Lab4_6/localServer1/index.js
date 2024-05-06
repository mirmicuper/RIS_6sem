const express = require('express');
const globalConfig = require('../config/globalConfig');
const logger = require('./utils/logger');
const router = require('./routes/router');
const generator = require('./services/generateService')

// Подключение Prisma клиента
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

const studentNumber = globalConfig.LOCAL_SERVER_1.STUDENT_NUMBER;

app.use(express.json());

// Подключение роутов
app.use('/', router);

setInterval(() => {
    generator.generateModelData(studentNumber);
    console.log('Генерация данных...');
}, 10000);

const PORT = globalConfig.MAIN_SERVER.PORT
app.listen(PORT, async () => {
    try {
        // Подключение к базе данных
        await prisma.$connect();
        logger.info('Connected to database');

        // Логика для запуска сервера
        logger.info(`Server is running on port ${PORT}`);
    } catch (error) {
        logger.error('Failed to connect to database:', error);
        process.exit(1); // Завершаем процесс с кодом ошибки
    }
});