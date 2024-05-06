// Cервис для работы с бд
const logger = require('../utils/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.InsertDataIntoDB = async (dataArray) => {
    try {
        for (const data of dataArray) {
            // Проверяем, существуют ли данные в базе данных
            const existingData = await prisma.cl1.findFirst({
                where: {
                    studentNumber: data.studentNumber,
                    clNum: data.clNum,
                    randomNumber: data.randomNumber
                }
            });

            if (!existingData) {
                // Если данные отсутствуют, записываем их в базу данных
                const newData = await prisma.cl1.create({
                    data: {
                        date_time: new Date(),
                        studentNumber: data.studentNumber,
                        clNum: data.clNum,
                        randomNumber: data.randomNumber
                    }
                });
                logger.info(`Сгенерированы и добавлены новые данные: ${newData.clNum}`);
            } else {
                logger.info(`Данные уже существуют: ${existingData.clNum}`);
            }
        }
    } catch (error) {
        // Обработка ошибок при вставке данных
        logger.error('Ошибка создания данных модели:', error);
        throw error;
    }
};

exports.getAllDataFromDB = async () => {
    try {
        // Получение всех данных из таблицы
        const allData = await prisma.cl1.findMany();

        // Проверка наличия данных
        if (!allData || allData.length === 0) {
            const errorMessage = 'В базе данных не найдено данных';
            logger.error(errorMessage);
            throw new Error(errorMessage);
        }

        return allData;
    } catch (error) {
        // Проброс ошибки для обработки на уровне вызывающего кода
        throw error;
    }
};
