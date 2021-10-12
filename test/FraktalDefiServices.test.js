const { expect } = require("chai")
const {deployContract, MockProvider, solidity} = require('ethereum-waffle');
const { ethers } = require('hardhat');
const { BigNumber, utils } = require('ethers')
const { intToBuffer } = require("ethjs-util");
const { log } = require('console')
// const erc20abi = require('../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json').abi;
// const iWethAbi = require('../artifacts/contracts/interfaces/IWETH.sol/IWETH.json').abi
const { toWei, fromWei } = require("../src/lib/utils");

describe(`FraktalDefiServices Contract`, () => {
  let wallet,
    wallet2,
    fraktalDefiServices = null

  beforeEach(async () => {
    const [deployerWallet, secondaryWallet] = await ethers.getSigners()
    wallet = deployerWallet
    wallet2 = secondaryWallet

    const FraktalDefiServices = await ethers.getContractFactory('FraktalDefiServices')
    fraktalDefiServices = await FraktalDefiServices.deploy()
    
  })

  it (`Should return owner as address of first wallet`, async () => {
    let owner = await fraktalDefiServices.owner()
    expect(owner).to.equal(wallet.address)
  })
  it (`Should transfer ownership to the second wallet`, async () => {
    let oldOwner = await fraktalDefiServices.owner()
    await fraktalDefiServices.transferOwnership(wallet2.address)
    let newOwner = await fraktalDefiServices.owner()

    expect(oldOwner).to.not.equal(newOwner)
  })

})

