// Метод возвращает текущее время
exports.getCurrTime = async () => {
    try {
        return new Date();
    } catch (error) {
        throw new Error('Failed to get current time');
    }
};

// Метод возвращает разницу между time1 и time2 
exports.getDiffTime = async (time1, time2) => {
    try {
        // Проверка на валидность времени
        if (!(time1 instanceof Date) || !(time2 instanceof Date)) {
            throw new Error('Invalid time format');
        }

        // Получаем разницу между двумя временами в миллисекундах
        const diffTime = Math.abs(time1 - time2);

        return diffTime;
    } catch (error) {
        throw new Error('Failed to calculate time difference');
    }
};
