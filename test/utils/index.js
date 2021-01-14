const { ethers, upgrades } = require("hardhat")
const signers = require('./signers')

module.exports = {
    getSigners: async (opt) => await signers(opt),
    deployContract: async (contractName, args, deployer) => {
        let contractFactory = await ethers.getContractFactory(contractName)
        let contractInstance = await contractFactory.deploy(args)
        await contractInstance.deployed()
        return contractInstance.connect(deployer)
    },
    deployUpgradableContract: async (contractName, args, deployer) => {
        let contractFactory = await ethers.getContractFactory(contractName)
        let contractInstance = await upgrades.deployProxy(contractFactory, args)
        await contractInstance.deployed()
        return contractInstance.connect(deployer)
    },
    upgradeContract: async (v2ContractName, v1Address) => {
        const contractV2 = await ethers.getContractFactory(v2ContractName)
        return await upgrades.upgradeProxy(v1Address, contractV2)
    }
}
