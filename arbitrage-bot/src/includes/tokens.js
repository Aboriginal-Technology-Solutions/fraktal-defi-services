const Token = require('../lib/Token')

/**
 *  Shit Coin/Token (High Risk!!!)
 */
let GG4 = new Token('Golden Goose 4', 'GG4', `0x9d422733607c01d36836bf20d2ded0885c1e14eb`)

/**
 *  Exchange Tokens
 */
let BAKE = new Token('BakeryToken4', 'BAKE', `0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5`)
let BBOO = new Token('Pandaswap (BamBOO) Token', 'BBOO', `0xd909840613fcb0fadc6ee7e5ecf30cdef4281a68`)
let CAKE = new Token('Pancakeswap Token', 'CAKE', `0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82`)

/**
 *  Stable Tokens
 */
let BUSDT = new Token('Binance-Peg BUSD-T', 'BUSDT', `0x55d398326f99059ff775485246999027b3197955`)
let USDC = new Token('Binance-Peg USD Coin', 'USDC', `0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d`)
let BUSD = new Token('Binance-Peg USD', 'BUSD', `0xe9e7cea3dedca5984780bafc599bd69add087d56`)
let vUSDC = new Token('Venus USDC', 'vUSDC', `0xeca88125a5adbe82614ffc12d0db554e2e2867c8`)
let vUSDT = new Token('Venus USDT', 'vUSDT', `0xfd5840cd36d94d7229439859c0112a4185bc0255`)
let vBTC = new Token('Venus BTC', 'vBTC', `0x882c173bc7ff3b7786ca16dfed3dfffb9ee7847b`)

/**
 *  Utility tokens
 */
let BNB = new Token('Wrapped BNB', 'WBNB', `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`)
let WBNB = new Token('Wrapped BNB', 'WBNB', `0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c`)
let ADA = new Token('Binance-Peg Cardano', 'ADA', `0x3ee2200efb3400fabb9aacf31297cbdd1d435d47`)
let ETH = new Token('Wrapped Ethereum', 'ETH', `0x2170ed0880ac9a755fd29b2688956bd959f933f8`)
let BETH = new Token('Binance Beacon ETH', 'BETH', `0x250632378e573c6be1ac2f97fcdf00515d0aa91b`)
let BTCB = new Token('Binance-Peg BTCB Token', 'BTCB', `0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c`)
let LINK = new Token('Binance-Peg Chinlink', 'LINK', `0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd`)
let DOT = new Token('Binance-Peg Polkadot Token', 'DOT', `0x7083609fce4d1d8dc0c979aab8c869ea2c873402`)


module.exports = {
  ETH,
  BETH,
  BNB,
  CAKE,
  BBOO,
  USDC,
  BUSD,
  LINK,
  ADA,
  DOT,
  WBNB,
  vUSDC,
  vUSDT,
  BETH,
  vBTC,
  BUSDT,
  BTCB,
  GG4,
  BAKE
}

// touch /home/node/kill