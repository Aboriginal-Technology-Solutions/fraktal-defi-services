/**
 *  Available Accounts
 *  ==================
 *  (0) 0xfcA5312658EBF9fAAaa6bF63f9266296AA41Ed80 (100 ETH)
 *  (1) 0x66CA87318bAA1804Af0CB612600C449272734375 (100 ETH)
 *  (2) 0x19ddAC7FcA514A10575112f8D1E387a339623f3F (100 ETH)
 *  (3) 0x7c90e7508C706D5E9b29A8614577fd377c39d206 (100 ETH)
 *  (4) 0x3b791D9171139478549Ff03678eD9fF16F58DF4f (100 ETH)
 *  (5) 0xac3f208abB250b2fA54FEf391e9C47B493a8F1d7 (100 ETH)
 *  (6) 0xae7e5ac5E31ea03A7ED522db0bf8FC653A2d8E96 (100 ETH)
 *  (7) 0xDd43adB2ba7E4AB3425b2a9F6234D9C802405304 (100 ETH)
 *  (8) 0x4179f0C95352aA326A945E3E382BeCbf9DBc21Be (100 ETH)
 *  (9) 0x07F672327ea53Bb69DC3f77898Df63D470D951A9 (100 ETH)
 *  
 *  Private Keys
 *  ==================
 *  (0) 0xc3919ed505dd48da1926f9ca42fab2c2a9373951b31fc409fe82ca2113d815ca
 *  (1) 0x7c9aacdc1df4c85804a45541786acd1f3db4a850c8c13021cc7408d079c1c7e1
 *  (2) 0x51b94bfb0a71034398274c8b0ceb0f02ac4659d531e919799b847a5ec1c55dbf
 *  (3) 0x451085a75a4bb8938096f3474fc213f901cd1caa2e5fa93beb56b447f919f43e
 *  (4) 0x27b33ea1486cb50ae95906f12f859036984c3f80293b1aca06ec230d29258914
 *  (5) 0x8efdb1d80d58a3751cb99a7ed82693094f1c82655acd98634df779dd6eafbed0
 *  (6) 0x621b06f949b0117913b9127eb1cf67cf0feacadba248c221a7e5ba359d4ca366
 *  (7) 0xa18b02dcf20a31c70fe63c3747cac4226760bfe94383a741bb5135a7e281021b
 *  (8) 0x9420d60f44721725f1fcd0e98533a5dbc42a1378d46263a5f3f5e951faea75b5
 *  (9) 0x7cda601305d4aefe1e197b280d9b2de84b4fe41b1e4fb36d022b48c364d7bf8f
 *  
 *  HD Wallet
 *  ==================
 *  Mnemonic:      egg multiply pizza way almost type alarm romance again strategy peanut mule
 *  Base HD Path:  m/44'/60'/0'/0/{account_index}
 *  
 */

 /**
  * {
  *   "name": "1INCH Token on xDai",
  *   "address": "0x7f7440C5098462f833E123B44B8A03E1d9785BAb",
  *   "symbol": "1INCH",
  *   "decimals": 18,
  *   "chainId": 100,
  *   "logoURI": "https://etherscan.io/token/images/1inch_32.png"
  * },
  * {
  *   "name": "AAH on xDai",
  *   "address": "0x99deb53501ac9b1c9f386f628f284b5cd8b107b9",
  *   "symbol": "AAH",
  *   "decimals": 18,
  *   "chainId": 100,
  *   "logoURI": "https://pbs.twimg.com/profile_images/1365887727330279424/aofb7sV6_400x400.jpg"
  * },
  */
const FraktaFinancial = artifacts.require("FraktaFinancial.sol");

const pk = `0xc3919ed505dd48da1926f9ca42fab2c2a9373951b31fc409fe82ca2113d815ca`
const signerAddress = `0xfcA5312658EBF9fAAaa6bF63f9266296AA41Ed80`
const comptroller = `0x66CA87318bAA1804Af0CB612600C449272734375`
const admin1 = `0x19ddAC7FcA514A10575112f8D1E387a339623f3F`
const admin2 = `0x7c90e7508C706D5E9b29A8614577fd377c39d206`

const honeyswap = {
  factory: `0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7`,
  router: `0x1C232F01118CB8B424793ae03F870aa7D0ac7f77`
}
contract("FraktaFinancial", async accounts => {

  it("Should retrieve owner address", async () => {

    const fraktaFinancial = await  FraktaFinancial.deployed()
    const owner = await fraktaFinancial.getOwner.call()
    assert.equal(signerAddress, owner, `NOT OWNER: ${owner}`)

  });

  it("Should add a comptroller and retrieve the compotroller address", async () => {

    const fraktaFinancial = await  FraktaFinancial.deployed()
    await fraktaFinancial.updateComptroller(comptroller)
    const _comptroller = await fraktaFinancial.getComptroller.call()
    assert.equal(comptroller, _comptroller, `NOT COMPTROLLER: ${_comptroller}`)

  });

  it("Should add 2 admins and retrieve their address", async () => {
    const fraktaFinancial = await  FraktaFinancial.deployed()
    await fraktaFinancial.   addAdmin(admin1)
    await fraktaFinancial.   addAdmin(admin2)
    const admins = await fraktaFinancial.getAdmins.call()
    
    assert.equal(admin1, admins[0], 'NOT ADMIN ' + admins[0])
    assert.equal(admin2, admins[1], 'NOT ADMIN ' + admins[1])
  });
  it("Should add and retrieve contract info", async () => {
    const fraktaFinancial = await  FraktaFinancial.deployed()

    await fraktaFinancial.addContract('honeyswap factory', honeyswap.factory, 100)
    await fraktaFinancial.addContract('honeyswap router', honeyswap.router, 100)

    const honeyswapFactory = await fraktaFinancial.getContractByName.call('honeyswap factory')
    // const honeyswapRouter = await fraktaFinancial.getContractByName.call(honeyswap.router)

    assert.equal(honeyswap.factory, honeyswapFactory._address, 'NOT honeyswap -> ' + JSON.stringify(honeyswapFactory, '', 2))
    // assert.equal(honeyswap.router, honeyswapRouter, 'NOT honeyswap ->' + honeyswapRouter)

  })
  it("Should add and retrieve a token", async () => {
    const fraktaFinancial = await  FraktaFinancial.deployed()

    await fraktaFinancial.addToken('1INCH', `0x7f7440C5098462f833E123B44B8A03E1d9785BAb`, 18, 100)
    await fraktaFinancial.addToken('AAH', `0x99deb53501ac9b1c9f386f628f284b5cd8b107b9`, 18, 100)

    const _1inchToken = await fraktaFinancial.getToken.call('1INCH')
    // const honeyswapRouter = await fraktaFinancial.getContractByName.call(honeyswap.router)

    assert.equal(`0x7f7440C5098462f833E123B44B8A03E1d9785BAb`, _1inchToken._address, 'NOT honeyswap -> ' + JSON.stringify(_1inchToken, '', 2))
    // assert.equal(honeyswap.router, honeyswapRouter, 'NOT honeyswap ->' + honeyswapRouter)

  })
});