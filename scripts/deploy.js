const fs = require('fs');
const path = require('path');
const fromWei = (x, u = 18) => ethers.utils.formatUnits(x, u);
const { log } = require('console')
// write down contracts that you wish to deploy one-by-one (names only, no .sol extension)
// after the run, find the ABIs and addresses in shared/artifacts/contracts

let _addressesFile = fs.readFileSync(path.join(__dirname, "../shared/artifacts/contracts/addresses.json"));
let addresses = JSON.parse(_addressesFile);


const contracts = [
  'FraktalDefiServicesToken'
];


const deployedContracts = {}
// DO NOT MODIFY CODE BELOW UNLESS ABSOLUTELY NECESSARY
  // check if addresses.json already exists
let exists = fs.existsSync(path.join(__dirname, "../shared/artifacts/contracts/addresses.json"));

// if not, created the file
if (!exists) {
  fs.writeFileSync(
    path.join(__dirname, "../shared/artifacts/contracts/addresses.json"), 
    "{}"
  ); 
}


async function publishContract(contractName, chainId) {
  // deploy the contract
  let _args = contractName.split(',')
  contractName = _args.shift()
  
  log({
    contractName,
    _args: [..._args]
  })

  for (let i = 0; i < _args.length; i++) {
    if (_args[i].includes('[') && _args[i].includes('[')) {
      let tmp = _args[i].replace('[', '').replace(']', '').split('.')[0]
      log({tmp, deployedContracts})
      let _tmpContract = await ethers.getContractFactory(tmp)
      _args[i] = deployedContracts[_tmpContract]
    }
  }

  log({
    contractName,
    _args: [..._args]
  })

  const contractFactory = await ethers.getContractFactory(contractName);
  const contract = (_args.length) ?  await contractFactory.deploy(..._args) : await contractFactory.deploy()

  deployedContracts[contract] = contract.address

  console.log(contractName + " contract address: " + contract.address);

  if (!fs.existsSync(path.join(__dirname, "../shared/artifacts/contracts/") ))
    fs.mkdirSync(path.join(__dirname, "../shared/artifacts/contracts/"), {recursive: true})
  // copy the contract JSON file to front-end and add the address field in it
  fs.copyFileSync(
    path.join(__dirname, "../artifacts/contracts/" + contractName + ".sol/" + contractName + ".json"), //source
    path.join(__dirname, "../shared/artifacts/contracts/" + contractName + ".json") // destination
  );

  // update the addresses.json file with the new contract address
  let addressesFile = fs.readFileSync(path.join(__dirname, "../shared/artifacts/contracts/addresses.json"));
  let addressesJson = JSON.parse(addressesFile);

  if (!addressesJson[contractName]) {
    addressesJson[contractName] = {};
  }

  addressesJson[contractName][chainId] = contract.address;
  
  fs.writeFileSync(
    path.join(__dirname, "../shared/artifacts/contracts/addresses.json"), 
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
  
  console.log("Account balance:", fromWei(await deployer.getBalance()));

  for (cont of contracts) {
    await publishContract(cont, networkData.chainId);
  }
}
  
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
