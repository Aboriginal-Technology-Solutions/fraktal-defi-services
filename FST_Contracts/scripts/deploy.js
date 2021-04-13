const fs = require('fs');

async function main () {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying smart contracts with the account: ${deployer.address}`)

  const balance = await deployer.getBalance();
  console.log(`Current balance: ${(parseFloat(balance.toString() / 10 ** 18).toFixed(2))} xDai`)

  // const FraktalDeFi = await ethers.getContractFactory('FraktalDeFi')
  // const fraktalDeFi = await FraktalDeFi.deploy()

  // console.log(`FraktalDeFi Address: ${fraktalDeFi.address}`)

  const UniPony = await ethers.getContractFactory('UniPony')
  const uniPony = await UniPony.deploy('0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7')

  console.log(`UniPony Address: ${uniPony.address}`)

  
  const data = {
    // fraktalDeFi: {
    //   address: fraktalDeFi.address,
    //   abi: JSON.parse(fraktalDeFi.interface.format('json'))
    // },
    uniPony: {
      address: uniPony.address,
      abi: JSON.parse(uniPony.interface.format('json'))
    }
  };
  fs.writeFileSync(__dirname + '/../config/FraktalDeFi.json', JSON.stringify(data)); 
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })


//   const fs = require('fs');

// async function main() {
//   const [deployer] = await ethers.getSigners();
//   console.log(`Deploying contracts with the account: ${deployer.address}`);
  
//   const balance = await deployer.getBalance();
//   console.log(`Account balance: ${balance.toString()}`);

//   const uniPony = await ethers.getContractFactory('uniPony');
//   const uniPony = await uniPony.deploy();
//   console.log(`uniPony address: ${uniPony.address}`);

//   const data = {
//     address: uniPony.address,
//     abi: JSON.parse(uniPony.interface.format('json'))
//   };
//   fs.writeFileSync('frontend/src/uniPony.json', JSON.stringify(data)); 
// }

// main()
//   .then(() => process.exit(0))
//   .catch(error => {
//     console.error(error);
//     process.exit(1);
//   });
