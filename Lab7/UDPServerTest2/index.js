const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const globalConfig = require('../config/globalConfig');
const { getSystemTime } = require('./controllers/timeService');

const neighborServers = [
  {
    ip: globalConfig.UDP_SERVER_2.SERVER_IP,
    port: globalConfig.UDP_SERVER_2.PORT,
    status: "unknown",
    isCoordinator: false,
    rank: 2
  },
  {
    ip: globalConfig.UDP_SERVER_1.SERVER_IP,
    port: globalConfig.UDP_SERVER_1.PORT,
    status: "unknown",
    isCoordinator: false,
    rank: 1
  }
];

const PORT = globalConfig.UDP_SERVER_3.PORT;

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
    } else if (msg.toString().includes('rank') && !msg.toString().includes('new')) {
      const messageData = JSON.parse(msg);
      console.log(`Received voting data server ${messageData.serverName}`);
      if (messageData.rank < globalConfig.UDP_SERVER_3.RANK) {
        server.send("OK", messageData.serverAddress.split(':')[1], messageData.serverAddress.split(':')[0], (err) => {
          if (err) {
            console.error('Error sending response:', err);
          } else {
            console.log(`Sent response: OK to ${messageData.serverAddress}`);
          }
        });
      }
    } else if (msg.toString().includes('OK')) {
      console.log(`Server got: OK from ${rinfo.address}:${rinfo.port}`);
    } else if (msg.toString().includes('new')) {
      const messageData = JSON.parse(msg);
      console.log(`Server got new coordinator info from ${messageData.serverHost}:${messageData.serverPort}`);
      const coordinator = neighborServers.find(server => server.rank === messageData.rank);
      const notCoordinator = neighborServers.find(server => server.rank != messageData.rank);
      coordinator.isCoordinator = true;
      notCoordinator.isCoordinator = false;

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
  let pizdecSluchilsya = 0;
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
  sendServerInfo("start");

  setInterval(async () => {
    try {
      const statuses = await getServersPortsStatuses();
      // console.log('Статусы соседних серверов:');
      // console.log(statuses);

      neighborServers.forEach(server => {
        server.status = statuses[`${server.ip}:${server.port}`];
      });

      //Логика на случай смерти координатора
      const coordinator = neighborServers.find(server => server.isCoordinator == true);
      if (coordinator) {
        if (coordinator.status != 'open') {
          pizdecSluchilsya++
        }
      }

      if (pizdecSluchilsya == 3) {
        console.log("coordinator is dead");
        coordinator.isCoordinator = false;
        pizdecSluchilsya = 0;
        findNewCoordinator();
      }

      if (iteration == 0) {
        findNewCoordinator();
      }

      iteration++;

    } catch (error) {
      console.error('Ошибка при получении статусов портов:', error);
    }
  }, 5000); // каждые 5 секунд
});

process.on('SIGINT', () => {
  // console.log('Received SIGINT signal');
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
    serverName: "UDPServer3",
    serverAddress: `${globalConfig.UDP_SERVER_3.SERVER_IP}:${globalConfig.UDP_SERVER_3.PORT}`,
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

    // Отправляем сообщение на порт сервера
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
    //Если никто кроме текущего сервера не работает
    sendServerInfo("coordinator");
  } else if (neighborServers[0].status == "open" || neighborServers[1].status == "open") {
    //Если кто-то помимо текущего сервера уже работает
    sendVotingInfo();
  } else {

  }
}

function sendVotingInfo() {
  const serverInfo = {
    serverName: "UDPServer3",
    serverAddress: `${globalConfig.UDP_SERVER_3.SERVER_IP}:${globalConfig.UDP_SERVER_3.PORT}`,
    rank: globalConfig.UDP_SERVER_3.RANK
  };

  const message = JSON.stringify(serverInfo);
  const openServers = neighborServers.filter(server => server.status === "open");
  let lessThenCurrent = 0;
  let biggerThenCurrent = 0;
  let highOpenRank = 0;

  openServers.forEach(server => {
    if (server.rank > globalConfig.UDP_SERVER_3.RANK) {
      if (server.rank > highOpenRank) {
        highOpenRank = server.rank;
      }
      const client = dgram.createSocket('udp4');
      client.send(message, 0, message.length, server.port, server.ip, (err) => {
        if (err) {
          console.error('Error sending server info:', err);
        } else {
          console.log(`Server info sent to server: ${server.ip}:${server.port}`);
        }
        client.close();
      });
      biggerThenCurrent++
    } else if (server.rank < globalConfig.UDP_SERVER_3.RANK) {
      lessThenCurrent++;
    }
  });

  if (biggerThenCurrent == lessThenCurrent || lessThenCurrent < biggerThenCurrent) {
    console.log("lose launch voting");
    const coordinator = neighborServers.find(server => server.rank === highOpenRank);
    coordinator.isCoordinator = true;
  } else if (lessThenCurrent > biggerThenCurrent) {
    setNewCoordinator();
    sendServerInfo("coordinator");
    console.log("win launch voting");
  }
}

function setNewCoordinator() {
  const serverInfo = {
    message: "I am new coordinator",
    serverHost: globalConfig.UDP_SERVER_3.SERVER_IP,
    serverPort: globalConfig.UDP_SERVER_3.PORT,
    rank: globalConfig.UDP_SERVER_3.RANK
  };

  const message = JSON.stringify(serverInfo);
  const openServers = neighborServers.filter(server => server.status === "open");

  openServers.forEach(server => {
    const client = dgram.createSocket('udp4');
    client.send(message, 0, message.length, server.port, server.ip, (err) => {
      if (err) {
        console.error('Error sending server info:', err);
      } else {
        console.log(`Server info sent to server: ${server.ip}:${server.port}`);
      }
      client.close();
    });
  })
}