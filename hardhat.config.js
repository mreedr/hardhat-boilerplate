require('dotenv').config()
require('@openzeppelin/hardhat-upgrades')
require("@nomiclabs/hardhat-waffle")

const INFURA_WEB3_CONNECTION = process.env.INFURA_WEB3_CONNECTION
const PRIVATE_KEY = process.env.PRIVATE_KEY

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      // chainId: 1337,
      // networkId: 1337
      // gas: 9500000
    },
    rinkeby: {
      url: `${INFURA_WEB3_CONNECTION}`,
      accounts: [`${PRIVATE_KEY}`]
    }
  },
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
