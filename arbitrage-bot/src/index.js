require('dotenv').config();

const { ethers } = require('ethers');
const abi = new ethers.utils.AbiCoder()
const { log } = require('console')
const Token = require('./lib/Token')
const {
  from,
  Subject,
  of
} = require('rxjs')

const {
  switchMap,
  map,
  flatMap
} = require('rxjs/operators')

const {
  ETH,
  BNB,
  CAKE,
  BBOO,
  BUSDC,
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
  BTCB
} = require('./includes/tokens')

const privateKey = process.env.PRIVATE_KEY;
// your contract address
const flashLoanerAddress = process.env.FLASH_LOANER;

// use your own Infura node in production
const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_PROVIDER);

const wallet = new ethers.Wallet(privateKey, provider);

const _storage = {
  cache: {
    exchanges: []
  },
  balances: {
    ETH: 0,
    WBNB: 0,
    BBOO: 0,
    GG4: 0
  },
  // ETH,BETH,BNB,CAKE,BBOO,BUSDC,BUSD,LINK,ADA,DOT,WBNB,vUSDC,vUSDT,BETH,vBTC,BUSDT,BTCB

  pairs: [
    [WBNB, BETH],
    [WBNB, CAKE],
    [WBNB, BTCB],
    [WBNB, BUSDT],
    [WBNB, vUSDT],
    [WBNB, DOT],
    [WBNB, ADA],
    [WBNB, BUSD],
    [WBNB, BBOO],
    [WBNB, LINK],
    
  ],
  watchPairs: [],
  exchanges: [
    {
      name: 'pancakeswap',
      factory: {
        address: `0xBCfCcbde45cE874adCB698cC183deBcF17952812`,
        abi: require('./includes/abis/IUniswapV2Factory'),
        contract: null
      },
      // router01: {
      //    address: ``,
      //   abi: null
        
      // },
      // router02: {
      //    address: ``,
      //   abi: null
        
      // },
      tags: ['uniswap-factory', 'uniswap-router']
    },{
      name: 'bakeryswap', 
      factory: {
        address: `0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7`,
        abi: require('./includes/abis/IUniswapV2Factory'),
        contract: null
      },
      // router01: {
      //    address: ``,
      //   abi: null
        
      // },
      // router02: {
      //    address: ``,
      //   abi: null
        
      // },
      tags: ['uniswap-factory', 'uniswap-router'],
      
    }
  ]
}

// _storage.cache.exchanges = _storage.exchanges.map(exchange => {
//   log('NAME', exchange.name )
//   Object.keys(exchange).filter(x => (x !== 'name' && x !== 'tags'))
//     .forEach(ex => {
//       let _ex = _storage.exchanges.filter(x => x.name === exchange.name)[0][ex]
//       // _ex.con
//       let contract = new ethers.Contract(_ex.address, _ex.abi, wallet)
//       // _storage.exchanges[exchange][ex].contract = contract
//       // log(ex, _ex)
//       _storage.cache.exchanges.push({..._ex, contract})
//     })
  
//   return {
//     ...exchange
//   }
// })
// _storage.cache.exchanges = _storage.exchanges.map(x => ({...x, contract: new ethers.Contract(x.abi, abi.address, wallet)}))
async function getBalances (address, tokens = []) {
  return await ethers.getBalance(address).call()
}
async function getPrices () {
  const getExchanges$ = from(_storage.exchanges)
  const getPairPrices$ = (exchange) => {

  }
  getExchanges$.pipe(
    switchMap(exchange => getPairPrices$(_storage.exchanges, _storage.pairs)),
    
  )
}
let _exchanges = []

const exchangeSubject$ = new Subject()


const pancakeFactory = _storage.exchanges.filter(x => x.name === 'pancakeswap')[0].factory
const bakeryFactory = _storage.exchanges.filter(x => x.name === 'bakeryswap')[0].factory

pancakeFactory.contract = new ethers.Contract(pancakeFactory.address, pancakeFactory.abi.abi, wallet)
bakeryFactory.contract = new ethers.Contract(bakeryFactory.address, bakeryFactory.abi.abi, wallet)

pancakeFactory.name = 'pancakeswap'
bakeryFactory.name = 'bakeryswap'

_exchanges.push(pancakeFactory)
_exchanges.push(bakeryFactory)

async function getPairAddress$ (exchange, pair) {
  // return from(await exchange.contract.getPair(pair[0].address, pair[1].address))
  return of([exchange, pair])
}
async function addWatchPair$ (exchange, pair) {
  return from(getPairAddress$(exchange, pair))
}
async function loadPairs (exchanges, pairs) {
  return from(_storage.pairs)
    .pipe(
      // switchMap(pair => getExchanges$(pair)),
      // flatMap(x => x),
      switchMap(x => getExchanges$(x)),
      // flatMap(x => x),
      map(x => x)
    )
    .subscribe(x => {
      log({x})
    })
}
async function getExchanges$  (pair) {
  return from(_storage.exchanges)
  .pipe(
    // switchMap(exchange => addWatchPair$(exchange, pair)),
      flatMap(x => x),
      map(x => x)
  )
}
const loadContract = async (abi, address, wallet) => await new ethers.Contract(abi, address, wallet) 

async function init() {
  log(`Initializing Price Checker...`)
  await loadPairs(_exchanges, _storage.pairs)
}

;(async () => {

  log(await init())

  provider.on('block', async (blockNumber) => {
    log(`Block Number: ${blockNumber}`)
    log(`Timestamp   : ${Date.now()}`)
    log(`Balances:`)
    log(_storage.watchPairs)
    // log(getBlances())
    // log({
    //   pancakeFactory,
    //   bakeryFactory
    // })
    // from(_exchanges)
    //   .subscribe(exchange => {
    //     from(_storage.pairs)
    //       .subscribe(pair => {
    //         log(pair)
    //             // uniswapEthDai = new web3.eth.Contract(UniswapV2Pair.abi, await pancakeFactory.getPair(wethAddress, daiAddress))
    //           log({
    //             exchange: exchange.name, pair, [`${exchange.name}_${pair[0].symbol}_${pair[1].symbol}`]: new web3.eth.Contract(exchange.abi, await exchange.getPair(pair[0].address, pair[1].address)),
    //             // exchange: Object.keys(exchange)
    //           })
    //       })
    //   })
  })
})()
