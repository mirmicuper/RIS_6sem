// Cервиса генерации данных для модели cl1
const logger = require('../utils/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Метод генерирует данные, записывает их в бд, и возращает сгенерированные данные
exports.generateModelData = async (studentNumber) => {
    try {
        // Генерация случайных данных на основе номера студента
        const date_time = new Date();
        const clNum = Math.floor(Math.random() * 10);
        const randomNumber = Math.floor(Math.random() * 101);

        // Вставка новых данных в модель
        const newData = await prisma.cl1.create({
            data: {
                date_time,
                studentNumber,
                clNum,
                randomNumber
            }
        });

        logger.info(`Сгенерированы и добавлены новые данные: ${newData.clNum}`);

        return newData;
    } catch (error) {
        // Обработка ошибок при вставке данных
        logger.error('Ошибка создания данных модели:', error);
        throw error;
    }
};
