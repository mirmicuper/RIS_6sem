const dgram = require('dgram');
const fs = require('fs');
const client = dgram.createSocket('udp4');
const server = dgram.createSocket('udp4');
const globalConfig = require('../config/globalConfig');
const localConfigPath = '../config/localConfig.json';

const pendingResponses = []; // Очередь для хранения запросов

const MIDDLE_SERVER_PORT = globalConfig.UDP_SERVER_AGENT.PORT;
const MIDDLE_SERVER_HOST = globalConfig.UDP_SERVER_AGENT.SERVER_IP;

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

server.on('message', (msg, rinfo) => {
  try {
    if (msg.toString().includes("start")) {
      const messageData = JSON.parse(msg);
      console.log(`Received start status from server ${messageData.serverName}`);
      updateServerStatus(messageData.serverName, "Active")

    } else if (msg.toString().includes("stop")) {
      const messageData = JSON.parse(msg);
      console.log(`Received stop status from server ${messageData.serverName}`);
      updateServerStatus(messageData.serverName, "inActive")

    } else if (msg.toString().includes("coordinator")) {
      const messageData = JSON.parse(msg);
      console.log(`Received coordinator status from server ${messageData.serverName}`);
      console.log(messageData.serverAddress)
      updateCoordinatorInfo(messageData.serverAddress);

    } else {
      console.log(`-------------------------------------------`);
      console.log(`Agent server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
      pendingResponses.push({ rinfo, msg });
      getCoordinatorInfo((coordinator) => {
        if (coordinator) {
          // Пересылаем запрос на основной UDP сервер
          client.send(msg, 0, msg.length, coordinator.split(':')[1], coordinator.split(':')[0], (err) => {
            if (err) {
              console.error('Error forwarding message:', err);
            } else {
              console.log('Message sent to primary server at', `${coordinator.split(':')[0]}:${coordinator.split(':')[1]}`);
            }
          });
        } else {
          console.error('Coordinator info not found');
        }
      });
    }

  } catch (error) {
    console.log(error.message);
  }
});

server.on('listening', () => {
  console.log(`Agent server listening on ${MIDDLE_SERVER_HOST}:${MIDDLE_SERVER_PORT}`);
});

server.bind(MIDDLE_SERVER_PORT);

function updateCoordinatorInfo(coordinatorData) {
  fs.readFile(localConfigPath, 'utf8', (err, data) => {
    try {
      const jsonData = JSON.parse(data);

      jsonData.coordinator = coordinatorData;

      const updatedData = JSON.stringify(jsonData, null, 2);

      fs.writeFile(localConfigPath, updatedData, (err) => {
        if (err) {
          console.error('Ошибка при записи в файл:', err);
          return;
        }
      });
    } catch (error) {
      console.error('Ошибка при обработке данных:', error);
    }
  });
}

function getCoordinatorInfo(callback) {
  fs.readFile(localConfigPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      callback(null);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      const coordinator = jsonData.coordinator;
      callback(coordinator);
    } catch (error) {
      console.error('Ошибка при обработке данных:', error);
      callback(null);
    }
  });
}

function updateServerStatus(serverName, newStatus) {
  fs.readFile(localConfigPath, 'utf8', (err, data) => {
    try {
      // Преобразуем считанные данные в объект
      const jsonData = JSON.parse(data);

      // Меняем определённые поля объектов или массива
      const index = jsonData.serverList.findIndex(server => Object.keys(server)[0] === serverName);
      jsonData.serverList[index].status = newStatus;

      // Преобразуем обновлённые данные в формат JSON
      const updatedData = JSON.stringify(jsonData, null, 2);

      // Записываем обновлённые данные обратно в файл
      fs.writeFile(localConfigPath, updatedData, (err) => {
        if (err) {
          console.error('Ошибка при записи в файл:', err);
          return;
        }
      });
    } catch (error) {
      console.error('Ошибка при обработке данных:', error);
    }
  });
}