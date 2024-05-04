const express = require('express');
const config = require('./Config/config');
const db = require('./database/db');
const logger = require('./utils/logger');
const userRoutes = require('./routes/userRoutes');
// Подключите другие маршруты

const app = express();

app.use(express.json());
app.use('/users', userRoutes);
// Используйте app.use для подключения других маршрутов

const PORT = config.PORT;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
