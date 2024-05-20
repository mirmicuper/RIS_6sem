const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const globalConfig = require('./config/globalConfig');

const PORT = globalConfig.UDP_SERVER_AGENT.PORT;
const HOST = globalConfig.UDP_SERVER_AGENT.SERVER_IP;

client.on('message', (msg, rinfo) => {
  console.log(`Received: ${msg}`);
  client.close();
});

const message = Buffer.from('What is the current system time?');

client.send(message, 0, message.length, PORT, HOST, (err) => {
  if (err) {
    console.error('Error sending message:', err);
    client.close();
  } else {
    console.log('Message sent');
  }
});
