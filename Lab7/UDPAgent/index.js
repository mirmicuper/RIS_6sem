const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const server = dgram.createSocket('udp4');

const MAIN_SERVER_PORT = 5555; // Порт основного UDP сервера
const MAIN_SERVER_HOST = 'localhost'; // Хост основного UDP сервера

const MIDDLE_SERVER_PORT = 5558; // Порт промежуточного UDP сервера

// Обработка сообщений от основного сервера
client.on('message', (response, serverInfo) => {
  const responseMessage = `${response.toString()} from ${serverInfo.address}:${serverInfo.port}`;
  console.log(`Received response from primary server: ${response}`);

  // Ответ, который нужно отправить клиенту
  const pendingResponse = pendingResponses.shift(); // Получаем первый запрос из очереди
  if (pendingResponse) {
    const { rinfo, msg } = pendingResponse;
    console.log(`Sent response to client at ${rinfo.address}:${rinfo.port}`);
    console.log(`-------------------------------------------`);

    // Отправляем ответ клиенту
    server.send(responseMessage, 0, responseMessage.length, rinfo.port, rinfo.address, (err) => {
      if (err) {
        console.error('Error sending response to client:', err);
      }
    });
  }
});

const pendingResponses = []; // Очередь для хранения запросов

server.on('message', (msg, rinfo) => {
  console.log(`Agent server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

  // Сохраняем запрос в очередь
  pendingResponses.push({ rinfo, msg });

  // Пересылаем запрос на основной UDP сервер
  client.send(msg, 0, msg.length, MAIN_SERVER_PORT, MAIN_SERVER_HOST, (err) => {
    if (err) {
      console.error('Error forwarding message:', err);
    } else {
      console.log('Message sent to primary server at', `${MAIN_SERVER_HOST}:${MAIN_SERVER_PORT}`);
    }
  });
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Agent server listening on ${address.address}:${address.port}`);
});

server.bind(MIDDLE_SERVER_PORT);
