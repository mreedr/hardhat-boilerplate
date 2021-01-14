const { ethers, upgrades } = require("hardhat")
const { expect } = require("chai")

const { FORWARDER_ADDR } = require('config.json')

describe("Upgrade", function () {
    it('should succesfully deploy proxy contract & call initialize', async function () {
      const MyContract = await ethers.getContractFactory("MyContract")
      const myContractInstance = await upgrades.deployProxy(MyContract, [FORWARDER_ADDR])
      await myContractInstance.deployed()
      expect(await myContractInstance.x()).to.equal(42)
    })

    it('should succesfully deploy V2', async function() {
      // const MyContract = await ethers.getContractFactory("MyContract")
      // const myContractInstance = await upgrades.deployProxy(MyContract, [42])
      // await myContractInstance.deployed()
    })
})