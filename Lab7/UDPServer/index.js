const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const globalConfig = require('../config/globalConfig');
const { getSystemTime } = require('./controllers/timeService');

const PORT = globalConfig.UDP_SERVER_1.PORT;

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
  sendServerInfo("start");
});

process.on('SIGINT', () => {
  console.log('Received SIGINT signal');
  // Выполните здесь необходимые действия перед завершением работы сервера
  // Например, отправьте сообщение о завершении работы на сервер-посредник
  sendServerInfo("stop");

  // Добавим небольшую задержку перед закрытием сервера
  setTimeout(() => {
    // Затем завершите работу сервера
    server.close(() => {
      console.log('Server closed');
      process.exit(); // Завершите выполнение процесса
    });
  }, 1000); // Задержка в 1 секунду (вы можете изменить значение по своему усмотрению)
});

server.bind(PORT);

function sendServerInfo(action) {
  const serverInfo = {
    serverName: "UDPServer1",
    serverAddress: `${globalConfig.UDP_SERVER_1.SERVER_IP}:${globalConfig.UDP_SERVER_1.PORT}`,
    action: action
  };
  const message = JSON.stringify(serverInfo);
  const client = dgram.createSocket('udp4');
  client.send(message, 0, message.length, globalConfig.UDP_SERVER_AGENT.PORT, globalConfig.UDP_SERVER_AGENT.SERVER_IP, (err) => {
    if (err) {
      console.error('Error sending server info:', err);
    } else {
      console.log(`Server info sent to agent server: ${action}`);
      client.close();
    }
  });
}