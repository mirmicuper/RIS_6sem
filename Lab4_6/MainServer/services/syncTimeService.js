// Метод возвращает текущее время
exports.getCurrTime = async () => {
    try {
        // Возвращаем текущую дату/время
        return new Date();
    } catch (error) {
        throw new Error('Не удалось получить текущее время');
    }
};