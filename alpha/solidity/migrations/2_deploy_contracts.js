const FraktaFinancial = artifacts.require("FraktaFinancial.sol");

const contracts = {

}

module.exports = async function (deployer) {
  const deployment = {
    fraktaFinancial: {}
  }

  await deployer.deploy(FraktaFinancial)
  const fraktaFinancial = FraktaFinancial.deployed()
  
  contract.fraktaFinancial = fraktaFinancial.address


}