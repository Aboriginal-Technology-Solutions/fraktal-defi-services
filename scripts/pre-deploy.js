const fs = require('fs');
const path = require('path');
const fromWei = (x, u = 18) => ethers.utils.formatUnits(x, u);
const { log } = require('console')
const { tokens } = require('../config')
// write down contracts that you wish to deploy one-by-one (names only, no .sol extension)
// after the run, find the ABIs and addresses in shared/artifacts/contracts
// log(Object.keys(global), network)

let {
  chainId,
  provider
} = network

let deployer = null

let wrappedToken = tokens.filter(x => x.chaindId === chainId).filter(x => x.symbol === 'WMATIC')[0]

let sharedContractAddressDir = `../shared/artifacts/contracts/`
initialize()

log({deployer})
// update the addresses.json file with the new contract address
let addressesFile = fs.readFileSync(path.join(__dirname, `${sharedContractAddressDir}/addresses.json`));
let addressesJson = JSON.parse(addressesFile);

const contracts = [
  `FraktalDefiServices,${wrappedToken.address}`,
  'FraktalDefiServicesToken'
];


const deployedContracts = {}
// DO NOT MODIFY CODE BELOW UNLESS ABSOLUTELY NECESSARY
  // check if addresses.json already exists
function initialize() {
  log(`INITIALIZING`)
  let exists
  
  exists = fs.existsSync(path.join(__dirname, `${sharedContractAddressDir}/addresses.json`))
  
  if (!exists) {
    fs.mkdirSync(path.join(__dirname, `${sharedContractAddressDir}`), {recursive: true})
  
    fs.writeFileSync(
      path.join(__dirname, `${sharedContractAddressDir}/addresses.json`), 
      "{}"
    ); 
  }

}

async function publishContract(contractName, chainId) {
  const [deployer] = await ethers.getSigners();
  // deploy the contract
  let _args = contractName.split(',')
  contractName = _args.shift()
  

  for (let i = 0; i < _args.length; i++) {
    _args[i] = _args[i].replace(`__deployer__`, deployer)
    if (_args[i].includes('[') && _args[i].includes('[')) {
      let tmp = _args[i].replace('[', '').replace(']', '').split('.')[0]
      log(`YUP`, {tmp, deployedContracts})
      let _tmpContract = await ethers.getContractFactory(tmp)
      _args[i] = deployedContracts[_tmpContract]
    }
  }
  const contractFactory = await ethers.getContractFactory(contractName);

  const contract = (_args.length) ?  await contractFactory.deploy(..._args) : await contractFactory.deploy()

  deployedContracts[contract] = contract.address

  console.log(contractName + " contract address: " + contract.address);

  fs.copyFileSync(
    path.join(__dirname, "../artifacts/contracts/" + contractName + ".sol/" + contractName + ".json"), //source
    path.join(__dirname, `${sharedContractAddressDir}` + contractName + ".json") // destination
  );


  if (!addressesJson[contractName]) {
    addressesJson[contractName] = {};
  }

  addressesJson[contractName][chainId] = contract.address;
  
  fs.writeFileSync(
    path.join(__dirname, `${sharedContractAddressDir}/addresses.json`), 
    JSON.stringify(addressesJson)
  ); 
}

async function main() {
  const [deployer] = await ethers.getSigners();

  let networkData = await deployer.provider.getNetwork()
  console.log("Chain ID:", networkData.chainId);

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  
  for (cont of contracts) {
    console.log("Starting Account balance:", fromWei(await deployer.getBalance()));
    await publishContract(cont, networkData.chainId);
    
  }
  console.log("Ending Account balance:", fromWei(await deployer.getBalance()));
}
  
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
