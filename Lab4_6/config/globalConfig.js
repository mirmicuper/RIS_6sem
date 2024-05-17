// Тут все настроенно для работы на одном компьютере, если планируете сдавать лабу одни 
// Мы сдавали на 3 компах, поэтому меняли адреса наших адресов 
// Если планируете сделать также как и мы, тогда подключитесь к одной сети 
// Определите, кто каким сервером будет и замените адреса на ваши 
// Пример: ADDRESS: `http://localhost:8000` => ADDRESS: `http://192.168.43.159:8000`
// Где 192.168.43.159 - адрес устройства в вашей сети

const globalConfig = {
    MAIN_SERVER: {
        PORT: 8000,
        STUDENT_NUMBER: 0,
        ADDRESS: `http://localhost:8000`
    },
    LOCAL_SERVER_1: {
        PORT: 8001,
        STUDENT_NUMBER: 1,
        ADDRESS: `http://localhost:8001`
    },
    LOCAL_SERVER_2: {
        PORT: 8002,
        STUDENT_NUMBER: 2,
        ADDRESS: `http://localhost:8002`
    }
};

module.exports = globalConfig;
