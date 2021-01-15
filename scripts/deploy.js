const { ethers, upgrades } = require("hardhat")
const fs = require('fs')

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  )

  // Deploying
  const MyContract = await ethers.getContractFactory("MyContract")
  const instance = await upgrades.deployProxy(MyContract, [process.env.TEST_FORWARDER_ADDR])
  await instance.deployed()

  // build these contract addresses into client/artifacts
  // create josn file
  // { "ContractName": "0x0000" }

  fs.writeFileSync('./client/artifacts/addresses.json', `{ "MyContract": "${instance.address}" }`)
  console.log("Contract address written to: ./client/artifacts/addresses.json")
}

// async function upgradeContract() {
//   // Upgrading
//   const MyContractV2 = await ethers.getContractFactory("MyContractV2")
//   const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2)
// }

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })