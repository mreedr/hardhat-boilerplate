const { ethers, upgrades } = require("hardhat")

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

  console.log("MyContract address:", instance.address)
}

async function upgradeContract() {
  // Upgrading
  // const MyContractV2 = await ethers.getContractFactory("MyContractV2")
  // const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2)

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })