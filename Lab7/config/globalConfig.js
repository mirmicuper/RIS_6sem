const UDP_SERVER_1_IP = "localhost";
const UDP_SERVER_2_IP = "localhost";
const UDP_SERVER_3_IP = "localhost";
const UDP_SERVER_AGENT_IP = "localhost";

const globalConfig = {
  UDP_SERVER_1: {
    PORT: 1111,
    RANK: 1,
    SERVER_IP: UDP_SERVER_1_IP,
  },
  UDP_SERVER_2: {
    PORT: 2222,
    RANK: 2,
    SERVER_IP: UDP_SERVER_2_IP,
  },
  UDP_SERVER_3: {
    PORT: 3333,
    RANK: 3,
    SERVER_IP: UDP_SERVER_3_IP,
  },
  UDP_SERVER_AGENT: {
    PORT: 5555,
    SERVER_IP: UDP_SERVER_AGENT_IP,
  },
};

module.exports = globalConfig;
