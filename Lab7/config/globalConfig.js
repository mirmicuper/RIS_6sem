const UDP_SERVER_1_IP = "localhost";
const UDP_SERVER_2_IP = "localhost";
const UDP_SERVER_3_IP = "localhost";
const UDP_SERVER_AGENT = "localhost";

const globalConfig = {
  UDP_SERVER_1: {
    PORT: 5555,
    RANK: 1,
    SERVER_ID: UDP_SERVER_1_IP,
    ADDRESS: `http://${UDP_SERVER_1_IP}:5555`
  },
  UDP_SERVER_2: {
    PORT: 5556,
    RANK: 2,
    SERVER_ID: UDP_SERVER_2_IP,
    ADDRESS: `http://${UDP_SERVER_2_IP}:5556`
  },
  UDP_SERVER_3: {
    PORT: 5557,
    RANK: 3,
    SERVER_ID: UDP_SERVER_3_IP,
    ADDRESS: `http://${UDP_SERVER_3_IP}:5557`
  },
  UDP_SERVER_AGENT: {
    PORT: 5558,
    SERVER_ID: UDP_SERVER_AGENT,
    ADDRESS: `http://${UDP_SERVER_AGENT}:5558`
  }
};

module.exports = globalConfig;
