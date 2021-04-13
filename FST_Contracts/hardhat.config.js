/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-waffle');

const privateKey = process.env.PRIVATE_KEY
module.exports = {
  solidity: "0.7.0",
  networks: {
    xdai: {
      url: `https://rpc.xdaichain.com`,
      accounts: [`${privateKey}`]
    }
  }

};
