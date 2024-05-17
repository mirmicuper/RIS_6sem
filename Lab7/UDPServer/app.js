const express = require('express');
const globalConfig = require('../config/globalConfig');
const router = require('./routes/routes');

const app = express();

const PORT = globalConfig.UDP_SERVER_1.PORT;

app.use('/', router);

app.listen(PORT, () => console.log(`Server is listening at ${globalConfig.UDP_SERVER_1.ADDRESS}`));
