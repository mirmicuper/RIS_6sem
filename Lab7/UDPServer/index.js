const dgram = require('dgram');
const ping = require('ping');
const server = dgram.createSocket('udp4');
const globalConfig = require('../config/globalConfig');
const { getSystemTime } = require('./controllers/timeService');

const neighborServers = [
  {
    ip: globalConfig.UDP_SERVER_2.SERVER_IP,
    port: globalConfig.UDP_SERVER_2.PORT,
    status: "unknown",
    isCoordinator: false
  },
  {
    ip: globalConfig.UDP_SERVER_3.SERVER_IP,
    port: globalConfig.UDP_SERVER_3.PORT,
    status: "unknown",
    isCoordinator: false
  }
];

const PORT = globalConfig.UDP_SERVER_1.PORT;

server.on('error', (err) => {
  console.log(`Server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  try {
    if (msg.toString().includes('check')) {
      server.send("good", rinfo.port, rinfo.address, (err) => {
        if (err) {
          console.error('Error sending response:', err);
        } else {
          // console.log(`Sent response: good`);
        }
      });
    } else {
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
    }
  } catch (error) {
    console.log(error.message);
  }
});

server.on('listening', () => {
  let iteration = 0;
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
  sendServerInfo("start");

  setInterval(async () => {
    try {
      const statuses = await getServersPortsStatuses();
      console.log('Статусы соседних серверов:');
      console.log(statuses);

      neighborServers.forEach(server => {
        server.status = statuses[`${server.ip}:${server.port}`];
      });

      if(iteration == 0){
        findNewCoordinator();
        iteration++;
      }

    } catch (error) {
      console.error('Ошибка при получении статусов портов:', error);
    }
  }, 5000); // каждые 5 секунд
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

async function checkPortStatus(server) {
  return new Promise((resolve) => {
    const socket = dgram.createSocket('udp4');

    let timer; // Таймер ожидания ответа

    // Устанавливаем таймер ожидания
    timer = setTimeout(() => {
      socket.close();
      resolve('closed');
    }, 2000); // Ожидаем ответ не более 2 секунд

    socket.once('error', (error) => {
      clearTimeout(timer); // Очищаем таймер
      if (error.code === 'ECONNREFUSED') {
        resolve('closed');
      } else {
        resolve('unknown');
      }
    });

    socket.once('message', () => {
      clearTimeout(timer); // Очищаем таймер
      socket.close();
      resolve('open');
    });

    // Отправляем пустое сообщение на порт сервера
    socket.send('checkStatus', 0, 10, server.port, server.ip);
  });
}

async function getServersPortsStatuses() {
  const statuses = {};

  for (const server of neighborServers) {
    try {
      const status = await checkPortStatus(server);
      statuses[`${server.ip}:${server.port}`] = status;
    } catch (error) {
      console.error(`Ошибка при проверке порта ${server.port} на сервере ${server.ip}: ${error.message}`);
      statuses[`${server.ip}:${server.port}`] = 'unknown';
    }
  }

  return statuses;
}

function findNewCoordinator() {
  if (neighborServers[0].status != "open" && neighborServers[1].status != "open") {
    sendServerInfo("coordinator");
  } else if (true) {

  } else {

  }
}
