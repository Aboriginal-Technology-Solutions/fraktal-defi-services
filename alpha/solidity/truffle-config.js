require('dotenv').config()
const HDWalletProvider = require('truffle-hdwallet-provider');
// const HDWalletProvider = require('@truffle/hdwallet-provider@next');
const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();
const privateKey = process.env.PRIVATE_KEY
console.log({
  XDAI_PROVIDER: process.env.XDAI_PROVIDER,
  privateKey
})

module.exports = {
    plugins: [
       'truffle-plugin-verify'
    ],
    api_keys: {
       bscscan: process.env.BSCSCANAPIKEY
    },
    networks: {
      development: {
        host: "127.0.0.1",     // Localhost (default: none)
        port: 8545,            // Standard BSC port (default:
        network_id: "*",       // Any network (default: none)
      },
      testnet: {
        provider: () => new HDWalletProvider(privateKey, `https://data-seed-prebsc-1-s1.binance.org:8545`),
        network_id: 97,
        confirmations: 10,
        timeoutBlocks: 200,
        skipDryRun: true
      },
      bsc: {
        provider: () => new HDWalletProvider(privateKey, process.env.BSC_PROVIDER),
        network_id: 56,
        confirmations: 10,
        timeoutBlocks: 200,
        skipDryRun: true
      },
      xdaiTestnet: {
        
      },
      xdai: {
        provider: () => new HDWalletProvider(privateKey, process.env.XDAI_PROVIDER),
        // provider: () => new HDWalletProvider(privateKey, `http://localhost:38545`),
        network_id: 100,
        gas: 5000000,
        gasPrice: 1000000000
      }
    },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.7.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       },
      //  evmVersion: "instanbul"
      }
    }
  }
}
