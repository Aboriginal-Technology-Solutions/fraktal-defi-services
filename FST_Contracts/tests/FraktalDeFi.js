const { expect } = require('chai')

describe('FraktalDeFi Contract', () => {
  let FraktalDeFi, fraktalDeFi, owner, addr1, addr2

  beforeEach(async () => {
    FraktalDeFi = await ethers.getContractFactory('FraktalDeFi')
    fraktalDeFi = await FraktalDeFi.deploy()
    [owner, addr1, addr2, _] = await ethers.getSigners()
  })

  describe('Deployment', () => {
    it('Should set the right owner', async () => {
      expect(await fraktalDeFi.owner())to.equal(owner.address)
    })
  })
  describe('addExchange', () => {
    it('Should add an exchange to the exchanges mapping and return the mapping', async () => {
      await fraktalDeFi.addExchange('Honeyswap', )
    })
  })
})