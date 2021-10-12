const { expect } = require("chai")
const {deployContract, MockProvider, solidity} = require('ethereum-waffle');
const { ethers } = require('hardhat');
const { BigNumber, utils } = require('ethers')
const { intToBuffer } = require("ethjs-util");
const { log } = require('console')
const erc20abi = require('../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json').abi;
const iWethAbi = require('../artifacts/contracts/interfaces/IWETH.sol/IWETH.json').abi
const { toWei, fromWei } = require("../src/lib/utils");

describe(`Banker Contract`, () => {
  let wallet,
    wallet2,
    banker = null,
    WMATIC_TOKEN_ADDRESS = `0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270`

  beforeEach(async () => {
    const [deployerWallet, secondaryWallet] = await ethers.getSigners()
    wallet = deployerWallet
    wallet2 = secondaryWallet

    const Banker = await ethers.getContractFactory('Banker')
    banker = await Banker.deploy(WMATIC_TOKEN_ADDRESS)
    
  })

  it (`Should deposit eth into the bank`, async () => {
    // let owner = await banker.owner()
    // expect(owner).to.equal(wallet.address)
    let userStartBalance = fromWei(await wallet.getBalance())
    let bankStartBalance = fromWei(await banker.getUserTokenBalance(`0x0000000000000000000000000000000000000000`))

    let tx = await banker.ethDeposit(toWei(1), {
      value: toWei(1)
    })
    await tx.wait()
    let userAfterDepositBalance = fromWei(await wallet.getBalance())
    let bankAfterDepositBalance = fromWei(await banker.getUserTokenBalance(`0x0000000000000000000000000000000000000000`))
    
    tx = await banker.ethWithdrawal(toWei(1))
    await tx.wait()
    let bankEndBalance = fromWei(await banker.getUserTokenBalance(`0x0000000000000000000000000000000000000000`))
    let userEndBalance = fromWei(await wallet.getBalance())
    
    log({
      userStartBalance,
      bankStartBalance,
      userAfterDepositBalance,
      bankAfterDepositBalance,
      userEndBalance,
      bankEndBalance
    })
  })
  it (`Should transfer ownership to the second wallet`, async () => {
    // let oldOwner = await banker.owner()
    // await banker.transferOwnership(wallet2.address)
    // let newOwner = await Banker.owner()
// 
    // expect(oldOwner).to.not.equal(newOwner)
  })
  
})

