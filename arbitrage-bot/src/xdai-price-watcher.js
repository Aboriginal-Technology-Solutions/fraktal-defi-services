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


const privateKey = process.env.PRIVATE_KEY

const network = `XDAI`

const tokenList = require('./includes/honeyswapTokenList').tokens

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
    file.on('end', () => resolve('done'))
  })
}

// const providerUrl = process.env[`${network}_PROVIDER`]
const signerAddress = process.env.SIGNER_ADDRESS
const providerUrl = "https://rpc.xdaichain.com"
const provider = new ethers.providers.JsonRpcProvider(providerUrl)

const wallet = new ethers.Wallet(privateKey, provider)
const account = wallet.connect(provider)
log({
  providerUrl
})

const honeyswap = {
  factory: `0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7`,
  v2Router02: `0x1C232F01118CB8B424793ae03F870aa7D0ac7f77`
}

const uniPonyContract = {
  address: require('./includes/abis/FraktalDeFi').uniPony.address,
  abi: require('./includes/abis/FraktalDeFi').uniPony.abi
}

honeyswap.router = honeyswap.v2Router02
const honeyswapRouter = {
  name: 'honeyswapRouter',
  address: `0x1C232F01118CB8B424793ae03F870aa7D0ac7f77`,
  abi: require('./includes/abis/IUniswapV2Router02').abi,
  contract: null
}
honeyswapRouter.contract = new ethers.Contract(honeyswapRouter.address, honeyswapRouter.abi, wallet)

const uniPony = new ethers.Contract(uniPonyContract.address, uniPonyContract.abi, wallet)

function getToken(symbolOrAddress) {
  return (
    tokenList.filter(token => (
      token.symbol.toLowerCase() == symbolOrAddress.toLowerCase() || token.address.toLowerCase() == symbolOrAddress.toLowerCase()
      )
    )[0]
  )
}

const HNY = getToken('HNY')
const WXDAI = getToken('WXDAI')

log(
  HNY.address, 

  WXDAI.address
)
// process.exit()
;(async () => {

  await provider.ready
  const amt = 1
  const amountIn = ethers.utils.parseUnits(`${amt}`, 'ether').toString();
  let amounts
  try {
    amounts = await uniPony.getAmountsOut(amountIn, [WXDAI.address, HNY.address]);
  } catch (e) {
    log(`Serious Error...`, {
      e,
      amounts
    })
  }
  const amountOutMin = amounts[1].sub(amounts[1].div(10))
  let deadline = (parseInt(Date.now() / 1000) + 120)

  // log({
  //   amounts: amounts.map( x => x.toString() ),
  //   amountOutMin: amountOutMin.toString()
  // })
  // const options = {
  //     // gas     : 5000000,
  //     // to: signerAddress
  //     gasPrice: 1000000000,
  //     gasLimit: 500000,
  //     // to: uniPonyContract.address
  //   }
  // log(
  //   `Strating Test!!`
  // )
  // let testAmt = `100000000000000000`
  // const tx = await uniPony.interactWithToken(WXDAI.address, testAmt, options)

  // // const tx = await uniPony.swapTokens(
  // //   honeyswap.factory, 
  // //   honeyswap.router, 
  // //   amountIn, 
  // //   amountOutMin, 
  // //   [WXDAI.address, 
  // //   HNY.address],
  // //   signerAddress, 
  // //   deadline,
  // //   options
  // // )
  // log({
  //   tx
  // })
  // const receipt = await tx.wait(); 
  // console.log('Transaction receipt');
  // console.log(receipt);
  // return receipt

})()
