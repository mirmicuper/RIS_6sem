// Cервиса генерации данных для модели cl1
const logger = require('../utils/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Метод генерирует данные, записывает их в бд, и возращает сгенерированные данные
exports.generateModelData = async (studentNumber) => {
    try {
        // Генерация случайных данных на основе номера студента
        const randomNumber = Math.floor(Math.random() * studentNumber);

        const date_time = new Date();
        const clNum = randomNumber;

        // Вставка новых данных в модель
        const newData = await prisma.cl1.create({
            data: {
                date_time,
                studentNumber,
                clNum
            }
        });

        logger.info(`Generated and added new data: ${newData.clNum}`);

        return newData;
    } catch (error) {
        // Обработка ошибок при вставке данных
        logger.error('Error generating model data:', error);
        throw error;
    }
};
