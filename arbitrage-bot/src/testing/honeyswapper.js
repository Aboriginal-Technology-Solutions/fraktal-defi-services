const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const ethers = require('ethers');

const chainId = 100;
const tokens = require('../includes/honeyswapTokenList').tokens
const network = 'XDAI'
const tokenAddress = tokens.filter(x => x.symbol === 'HNY')[0];
const providerUrl = 'ws://nethermind-xdai:8545/ws/'
const signerAddress = process.env.SIGNER_ADDRESS

const provider = new ethers.providers.WebSocketProvider(providerUrl)

  // const provider = ethers.providers.JsonRpcProvider('http://nethermind-xdai:8545');

const init = async () => {
  const hny = await Fetcher.fetchTokenData(chainId, tokenAddress);
  const weth = WETH[chainId];
  const pair = await Fetcher.fetchPairData(hny, weth);
  const route = new Route([pair], weth);
  const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);
  console.log(route.midPrice.toSignificant(6));
  console.log(route.midPrice.invert().toSignificant(6));
  console.log(trade.executionPrice.toSignificant(6));
  console.log(trade.nextMidPrice.toSignificant(6));

  const slippageTolerance = new Percent('50', '10000');
  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
  const path = [weth.address, hny.address];
  const to = '';
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const value = trade.inputAmount.raw;

  const provider = ethers.providers.WebSocketProvider('ws://nethermind-xdai:8545/ws/json-rpc');

  const signer = new ethers.Wallet(PRIVATE_KEY);
  const account = signer.connect(provider);
  const uniswap = new ethers.Contract(
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'],
    account
  );
  const tx = await uniswap.sendExactETHForTokens(
    amountOutMin,
    path,
    to,
    deadline,
    { value, gasPrice: 20e9 }
  );
  console.log(`Transaction hash: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}

// init();
