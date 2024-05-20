const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const globalConfig = require('../config/globalConfig');
const { getSystemTime } = require('./controllers/timeService');

const PORT = globalConfig.UDP_SERVER_3.PORT;

server.on('error', (err) => {
  console.log(`Server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

  // Получаем системное время
  const date = new Date();
  const formattedDateTime = getSystemTime(date);

  // Отправляем ответ клиенту
  server.send(formattedDateTime, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error('Error sending response:', err);
    } else {
      console.log(`Sent response: ${formattedDateTime}`);
      console.log(`-------------------------------------------`);
    }
  });
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});

server.bind(PORT);