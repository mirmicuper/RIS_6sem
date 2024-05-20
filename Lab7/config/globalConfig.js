const UDP_SERVER_1_IP = "localhost";
const UDP_SERVER_2_IP = "localhost";
const UDP_SERVER_3_IP = "localhost";
const UDP_SERVER_AGENT_IP = "localhost";

const globalConfig = {
  UDP_SERVER_1: {
    PORT: 6005,
    RANK: 1,
    SERVER_IP: UDP_SERVER_1_IP,
  },
  UDP_SERVER_2: {
    PORT: 5556,
    RANK: 2,
    SERVER_IP: UDP_SERVER_2_IP,
  },
  UDP_SERVER_3: {
    PORT: 5557,
    RANK: 3,
    SERVER_IP: UDP_SERVER_3_IP,
  },
  UDP_SERVER_AGENT: {
    PORT: 5558,
    SERVER_IP: UDP_SERVER_AGENT_IP,
  },
};

module.exports = globalConfig;
