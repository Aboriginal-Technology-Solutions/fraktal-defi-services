require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
const {toWei} = require('./src/lib/utils')
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
let network = process.env.NETWORK

if (!network) network = process.env.DEFAULT_NETWORK

const privateKey = process.env.PRIVATE_KEY

function getProvider (_network) {
  const provider = process.env[`${_network.toUpperCase()}_HTTP_PROVIDER`]
  // console.log({provider})
  return provider
}
console.log(`Provider: ${getProvider(network)}`)
const config = {
  defaultNetwork: "hardhat",

  networks: {
    hardhat: {
      from: `0xAD9639F05189c7A0A8c6197f2b6CC1E7f717dE5C`,
      accounts: [ {privateKey, balance: toWei(`1000000`).toString()} ],
      chainId: 137,
      forking: {
        url: getProvider(network)
      },
    },
    ganache: {
      url: "http://127.0.0.1:7545/",
      saveDeployments: true
    },
    //goerli: {
    //  url: "https://eth-goerli.alchemyapi.io/v2/" + process.env.ALCHEMY_API_KEY,
    //  accounts: [process.env.ALCHEMY_DEPLOYMENT_KEY]
    //},
    matic: {
      url: getProvider(`matic`),
      accounts: [ `${privateKey}` ],
      chainId: 137,
      live: true,
      saveDeployments: true,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gasPrice: 5000000000,
      gasLimit: 20000000,
    },

    // matic: {
    //   url: getProvider(`matic`),
    //   accounts: [ privateKey ],
    //   garPrice: `10000000000`,
    //   chainId: 137,
    //   live: true,
    // },
    xdai: {
      url: getProvider(`xdai`),
      accounts: [ privateKey ],
      garPrice: '1000000000'
    }
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },

  solidity: {
    // version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    },
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
    
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
    
        },
      },
    ],
  },
  mocha: {
    timeout: 180000
  },
  chai: {
    timeout: 30000
  }
};

config.polygon = config.matic

module.exports = config
