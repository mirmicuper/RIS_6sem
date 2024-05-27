const UDP_SERVER_1_IP = "192.168.43.159";
const UDP_SERVER_2_IP = "192.168.43.141";
const UDP_SERVER_3_IP = "192.168.43.249";
const UDP_SERVER_AGENT_IP = "192.168.43.249";

const globalConfig = {
  UDP_SERVER_1: {
    PORT: 5555,
    RANK: 1,
    SERVER_IP: UDP_SERVER_1_IP,
  },
  UDP_SERVER_2: {
    PORT: 5555,
    RANK: 2,
    SERVER_IP: UDP_SERVER_2_IP,
  },
  UDP_SERVER_3: {
    PORT: 5555,
    RANK: 3,
    SERVER_IP: UDP_SERVER_3_IP,
  },
  UDP_SERVER_AGENT: {
    PORT: 5550,
    SERVER_IP: UDP_SERVER_AGENT_IP,
  },
};

module.exports = globalConfig;
