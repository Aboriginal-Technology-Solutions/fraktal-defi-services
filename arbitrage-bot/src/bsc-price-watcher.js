require('dotenv').config();

const { ethers } = require('ethers');
const { log } = require('console')
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http)

const {
  from,
  fromEvent,
  Subject
} = require('rxjs')

const {
  LINK,
  ADA,
  DOT,
  BNB,
  BUSD,
  GG4,
  CAKE,
  BAKE,
  BBOO,
  vUSDC,
  vUSDT,
  BETH,
  vBTC,
  BUSDT,
  BTCB,
  WBNB
} = require('./includes/tokens')

const privateKey = process.env.PRIVATE_KEY

const network = `BSC`

const config = {
  cacheFile: __dirname + '/../config.json'
}

app.get('/', function(req, res) {
   res.send('API Home');
})

async function writeConfigFile (content, config) {
  const file = createWriteStream(config.configFile)
  file.write(JSON.stringify(content))
  file.end()
  return new Promise((resolve, reject) => {
    file.on('error', err => resolve(err))
    fikle.on('end', () => resolve('done'))
  })
}

const providerUrl = process.env[`${network}_PROVIDER`]

const signerAddress = process.env.SIGNER_ADDRESS

const provider = new ethers.providers.JsonRpcProvider(providerUrl)

const wallet = new ethers.Wallet(privateKey, provider)
const account = wallet.connect(provider)
const watchTokens = [
  GG4,
  CAKE,
  BAKE
]

const pancakeFactory = {
  name: 'pancakeFactory',
  address: `0xBCfCcbde45cE874adCB698cC183deBcF17952812`,
  abi: require('./includes/abis/IUniswapV2Factory').abi,
  contract: null
}

pancakeFactory.contract = new ethers.Contract(pancakeFactory.address, pancakeFactory.abi, account)

const pancakeRouter = {
  name: 'pancakeRouter',
  address: `0x05ff2b0db69458a0750badebc4f9e13add608c7f`,
  abi: require('./includes/abis/IUniswapV2Router02').abi,
  contract: null
}

pancakeRouter.contract = new ethers.Contract(pancakeRouter.address, pancakeRouter.abi, account)

async function getLPContract (pairAddress) {
  return await new ethers.Contract(pairAddress, require('./includes/abis/IUniswapV2Pair').abi, account)
}

async function getPairAddress (pair) {
  let address = await pancakeFactory.contract.getPair(pair[0].address, pair[1].address)
  // log({
  //   lpAddress: address
  // })
  let contract = await getLPContract(address)
  return {
    address,
    contract
  }
}

async function getPrice (pair) {
  // log({pair})
  let contract = (await getPairAddress(pair)).contract
  const reserves = await contract.getReserves();
  const reserve0 = Number(ethers.utils.formatUnits(reserves[0], 18));
  const reserve1 = Number(ethers.utils.formatUnits(reserves[1], 18));
  const price = reserve1 / reserve0;
  const inversePrice = reserve0 / reserve1;
  return {reserves, reserve0, reserve1, price, inversePrice}
  // return contract
}

async function getWalletBalance () {
  return Number(ethers.utils.formatUnits(await wallet.getBalance(), 18).toString())
}

async function getTokenBalance (token) {
  let balance = 0
  const contract = new ethers.Contract(token.address, require('./includes/abis/IERC20').abi, wallet)
  return Number(ethers.utils.formatUnits(await contract.balanceOf(signerAddress), 18).toString())
}

async function getBNBUSDPrice (token) {
  // return await
  return await getPrice([BNB, BUSD])
}

async function swapTokens (token0, token1, amt) {
  let tokenIn = token0, tokenOut = token1

  // log({
  //   token0,
  //   token1
  // })
  // if(token0.address === WBNB) {
  //   tokenIn = token0.address; 
  //   tokenOut = token1.address;
  // }

  // if(token1.address == WBNB) {
  //   tokenIn = token1.address;
  //   tokenOut = token0.address;
  // }

    //We buy for 0.1 ETH of the new token
  
  const amountIn = ethers.utils.parseUnits(`${amt}`, 'ether');
  const amounts = await pancakeRouter.contract.getAmountsOut(amountIn, [tokenIn.address, tokenOut.address]);
  //Our execution price will be a bit different, we need some flexbility
  const amountOutMin = amounts[1].sub(amounts[1].div(10));
  log({
    amt, 
    amountIn: Number(ethers.utils.formatUnits((amountIn.toString(), 18))), 
    amounts: amounts.map(x => Number(ethers.utils.formatUnits(x.toString()))), 
    amountOutMin: Number(
        ethers.utils.formatUnits(amountOutMin.toString())
      )
  })
  console.log(`
    Buying new token
    =================
    tokenIn: ${amountIn.toString()} ${tokenIn.address} (WBNB)
    tokenOut: ${amountOutMin.toString()} ${tokenOut.address}
  `);
  const tx = await pancakeRouter.contract.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    [tokenIn.address, tokenOut.address],
    signerAddress,
    Date.now() + 1000 * 60 * 10, //10 minutes,,

    {
      // gas     : 5000000,
      // to: signerAddress
      gasPrice: 10000000000,
      gasLimit: 500000
    }
  );
  const receipt = await tx.wait(); 
  console.log('Transaction receipt');
  console.log(receipt);
  return receipt
}
// provider.on('block', async blockNum => {
//   log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
//   log('Block-----------:', blockNum)
//   log('Timestamp-------:', parseInt(Date.now() / 1000))
//   log(`Balances        :\n`,
//   `        BNB---------:`, await getWalletBalance(), '\n',
//   `        GG4---------:`, await getTokenBalance(GG4), '\n',
//   // `        BNB-GG4-LP--:`, await getTokenBalance(await getPairAddress([BNB, GG4]))
//   )


//   log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')

// })

const providerSubject$ = new Subject()
const balanceSubject$ = new Subject()
const priceSubject$ = new Subject()
const botSubject$ = new Subject()
const tradeSubject$ = new Subject()
const BNB_THRESHOLD = 0.01

const _storage = {
  initialized: false,
  BNB_USD_Price: 0,
  balances: {
    BNB: {balance: 0, block: 0, ts: 0, available: BNB_THRESHOLD}
  },
  backup: {
    balances: {
      BNB: []
    }
  },
  exchanges: [
    pancakeFactory
  ],
  watchPairs: [],
  prices: {

  },
  trades: [],
  BNB_THRESHOLD
}

tradeSubject$.subscribe({
  next: info => {
    if (!getBNBUSDPrice()) return
    switch (info.action) {
      case 'buy-prepare':
        log(`preparing to buy`)
        break
      case 'buy-execute':
        log(`execute buy`)
        break
      case 'buy-completed':
        log(`completed buy`)
        break
      case 'run-condition':
        // log('RUN CONDITION', info)
        info.condition()
        break
    }
  }
})

botSubject$.subscribe({
  next: info => {
    switch (info.action) {
      case 'test':
        log('BOT TEST')
        break
    }
  }
})

priceSubject$.subscribe({
  next: info => {
    // log(`++ Fetching Price Info ++`)
    // log(info)
    switch(info.action) {
      case 'initialize':
        _storage.initialized = 1
        log(`Initializing pricing module...`)
        from(info.pairs)
          .subscribe(pair => {
            from(getPrice(pair))
              .subscribe(pairPrice => {
                // log({pair,pairPrice})
                // if (pair[0].address === BNB.address && pair[1].address === BUSD.address)
                _storage.watchPairs.push(
                  {
                    ticker: `${pair[0].symbol}_${pair[1].symbol}`,
                    // exchange,
                    pairPrice,
                    pair
                  }
                )
              })

          }, null, () =>{ log('WATCH PAIRS:', _storage.watchPairs); _storage.initialized = true })
        break
      case 'get-token-prices':
        from(_storage.watchPairs)
          .subscribe(pair => {
            // log('WATCH_PAIR', pair)
          })
        break;
      case 'get-BNB-USD-price':
        // log(`Getting BNB Price`)
        from(getBNBUSDPrice()).subscribe(price => _storage.BNB_USD_Price = price, null, () => {
          // log(_storage.BNB_USD_Price)
        })
        break
      case 'show-token-prices':
        from(_storage.watchPairs)
          .subscribe(pair => {
            // log({
            //   pair
            // })
            let price = (
              (pair.pair[0].symbol === 'WBNB' && pair.pair[1].symbol === 'BAKE') || (pair.pair[1].symbol === 'WBNB' && pair.pair[0].symbol === 'BAKE') ||
              (pair.pair[0].symbol === 'WBNB' && pair.pair[1].symbol === 'BBOO') || (pair.pair[1].symbol === 'WBNB' && pair.pair[0].symbol === 'BBOO') ||
              (pair.pair[0].symbol === 'WBNB' && pair.pair[1].symbol === 'LINK') || (pair.pair[1].symbol === 'WBNB' && pair.pair[0].symbol === 'LINK') ||
              (pair.pair[0].symbol === 'WBNB' && pair.pair[1].symbol === 'vBTC') || (pair.pair[1].symbol === 'WBNB' && pair.pair[0].symbol === 'vBTC') 
              
            ) ? pair.pairPrice.inversePrice: pair.pairPrice.price
            // if ()
            log(`TICKER: ${pair.ticker}\tPRICE:`, 
              `${parseFloat(price).toFixed(10)} \t(  \$${parseFloat(( 
                (pair.pair[0].symbol === 'WBNB' || pair.pair[1].symbol === 'WBNB') &&
                (pair.pair[0].symbol !== 'BUSD' || pair.pair[1].symbol !== 'BUSD')
              ? _storage.BNB_USD_Price.price 
              : 1) * price).toFixed(4)}\t)`)

            // `\tPRICE: ${pair.pairPrice.inversePrice} (\$${parseFloat(_storage.BNB_USD_Price.price * pair.pairPrice.inversePrice).toFixed(4)})\t${pair.pair[0].symbol} ${pair.pair[1].symbol}`)
          })
          break
          
        case 'buy-token':
          // log('INFO', {info})
          break
    }
  }

})


balanceSubject$
  .subscribe({
    next: info => {
      switch (info.action) {

        case "get-balances":
          // log(`++ Fetching Balances for block ${info.blockNum} ++`)
          from(getWalletBalance())
            .subscribe(balance => {
              let _currBal = _storage.balances.BNB
              _storage.balances.BNB = {balance, block: info.blockNum, ts: Date.now()}
              if (_currBal.ts === 0) _storage.backup.balances.BNB.push(_storage.balances.BNB)
              else if (_currBal.balance !== _storage.balances.BNB.balance) _storage.backup.balances.BNB.push(_storage.balances.BNB)
              balanceSubject$.next({
                action: 'show-balances'
              })
            })
          break;
        case 'show-balances':
            log(`\n++++++++++++++++++++++++++++++++++++++++++++\nBALANCES:`)
            Object.keys(_storage.balances)
              .forEach(key => {
                log(`${key}: ${_storage.balances[key].balance} (USD Value: \$${parseFloat((_storage.BNB_USD_Price.price * _storage.balances[key].balance)).toFixed(4)})`)
              })
            Object.keys(_storage)
            log(`++++++++++++++++++++++++++++++++++++++++++++\n`)
          break
        case 'show-token-prices':
            log(`\n++++++++++++++++++++++++++++++++++++++++++++\nBALANCES:`)
            Object.keys(_storage.prices)
              .forEach(key => {
                log(`${key}: ${_storage.prices[key].balance} (USD Value: \$${parseFloat((_storage.BNB_USD_Price.price * _storage.balances[key].balance)).toFixed(4)})`)
              })
            log(`++++++++++++++++++++++++++++++++++++++++++++\n`)
          break
      }

    }
  })



providerSubject$.subscribe({
  next: info => {
    switch (info.action) {
      case "new-block":
        balanceSubject$.next({action: 'get-balances', blockNum: info.blockNum})
        log('++ New Block ++')
        log('Block No.:', info.blockNum)
        break
    }
  }
})

priceSubject$.next({ action: 'initialize', pairs: [
        [BBOO,WBNB],
        [CAKE, WBNB],
        [GG4, WBNB],
        [GG4, BUSD],
        [WBNB, BAKE],
        [LINK, WBNB],
        [ADA, WBNB],
        [DOT, WBNB],
        // [vUSDC, WBNB],
        // [vUSDT, WBNB],
        [BETH, WBNB],
        [BUSD, WBNB],
        [BTCB, WBNB],

      ]
})

async function init () {
  log(`INITIALIZING`, (() => _storage.initialized)())
  // return await swapTokens(WBNB, GG4, .01)
}

function fetchPricer (token0, token1) {
  let BNB_USD_Price = _storage.BNB_USD_Price.price 
  const pair = _storage.watchPairs.filter(x => (
    (x.pair[0].symbol === token0.symbol && x.pair[1].symbol === token1.symbol)  ||
    (x.pair[1].symbol === token0.symbol && x.pair[0].symbol === token1.symbol) 
    )
  )[0]

  if (typeof pair === 'undefined' || !pair) return false
  return [pair.pairPrice.price, pair.pairPrice.inversePrice, pair]
    
    // .pairPrice.price

}
const watchers = []

;(async () => {
  await init()
})()

// process.exit()
fromEvent(provider, 'block')
  .subscribe(blockNum => {
    
    if (!_storage.initialized) return
    if (!_storage.watchPairs) return

    priceSubject$.next({
      action: 'get-BNB-USD-price'
    })

    priceSubject$.next({
      action: 'buy-token',
      tokenBuy: GG4,
      tokenSell: WBNB,
      buyPrice:  (typeof fetchPricer(GG4, WBNB).price !== 'undefined') ? fetchPricer(GG4, WBNB).price[0] : null
    })

    if (!_storage.initialized) return 
    providerSubject$.next({
      action: 'new-block',
      blockNum
    })
    priceSubject$.next({
      action: 'get-prices',
      pairs: _storage.watchPairs
    })
    priceSubject$.next({
      action: 'get-token-prices',
      tokens: ''
    })
    priceSubject$.next({
      action: 'show-token-prices',
    })
    tradeSubject$.next({
      action: 'run-condition',
      condition: () => {
        let bnbUsdPrice = _storage.BNB_USD_Price.price
        // log(`NEXT THAT CONDITION...`, blockNum, bnbUsdPrice)
        if (!bnbUsdPrice) return false
        // log(`Got BNB Price::\t ${bnbUsdPrice}`)
        // log('PAIR COINT:', _storage.watchPairs.length)
        let watchPair = []
        watchPair.push(fetchPricer(GG4, WBNB))
        
        watchers.push({
          price: watchPair[0][0],
          usdPrice: parseFloat(watchPair[0] * bnbUsdPrice).toFixed(4)
        })

      }
    })
  })


// *********************************************************************************
// *********************************************************************************
// *********************************************************************************
const io$ = fromEvent(io, 'connection')
  .subscribe(socket => {
    log('A user connected')
    fromEvent(io, 'disconnect')
      .subscribe(() => {
        console.log('A user disconnected');
      })
  })
  //Whenever someone connects this gets executed
// io.on('connection', function(socket) {
//    console.log('A user connected');

//    //Whenever someone disconnects this piece of code executed
//    socket.on('disconnect', function () {
//       console.log('A user disconnected');
//    });
// });

http.listen(3000, function() {
   console.log('listening on *:3000');
});