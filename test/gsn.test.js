// const { ethers, upgrades } = require("hardhat")
const { expect } = require("chai")
const { ethers } = require("ethers")
const GsnTestEnvironment = new require('@opengsn/gsn/dist/GsnTestEnvironment').GsnTestEnvironment

const { getSigners, deployContract, deployUpgradableContract } = require('./utils')
const PaymasterABI = require('../artifacts/@opengsn/gsn/contracts/interfaces/IPaymaster.sol/IPaymaster.json').abi

describe('GSN', function () {
    let owner
    let emptyAccount
    let contractInstance
    let relayHubAddress
    let forwarderAddress
    let paymasterAddress
    beforeEach(async function () {
        [owner,,,,,,,,,,,,,,,,,,,,emptyAccount] = await getSigners()
        // use localhost gsn forwarderAddress
        let { forwarderAddress: fa, relayHubAddress: rha, paymasterAddress: pma } = await GsnTestEnvironment.loadDeployment()
        relayHubAddress = rha
        forwarderAddress = fa
        paymasterAddress = pma
        contractInstance = await deployUpgradableContract('MyContract', [forwarderAddress], owner)
        contractInstance = contractInstance.connect(emptyAccount)
    })

    it('should send tx over gsn', async function() {
        expect(await emptyAccount.getBalance()).to.equal(0)

        let testInstance = new ethers.Contract(paymasterAddress, PaymasterABI, owner)
        let paymasterRelayBalance = await testInstance.getRelayHubDeposit()
        expect(paymasterRelayBalance).to.not.equal(0)

        let tx = await contractInstance.connect(emptyAccount).setVal(15)
        expect(tx.confirmations).to.be.above(0)

        let afterBalance = await testInstance.getRelayHubDeposit()
        expect(afterBalance).to.be.below(paymasterRelayBalance)
        console.log(paymasterRelayBalance.toString(), afterBalance.toString())

        let val = await contractInstance.connect(emptyAccount).getVal(await emptyAccount.getAddress())
        expect(val).to.equal(15)
    })

    it('should deploy paymaster', async function() {
        let [owner] = await getSigners({ useGSN: false })
        let paymasterInstance = await deployContract('Paymaster', [], owner)
        expect(paymasterInstance.address).to.not.be.undefined

        await paymasterInstance.setRelayHub(relayHubAddress)
        let paymasterRelayHubAddr = await paymasterInstance.getHubAddr()
        expect(paymasterRelayHubAddr).to.equal(relayHubAddress)

        await paymasterInstance.setTrustedForwarder(forwarderAddress)
        let paymasterForwarder = await paymasterInstance.trustedForwarder()
        expect(paymasterForwarder).to.equal(forwarderAddress)

        await paymasterInstance.setTarget(contractInstance.address)
        let target = await paymasterInstance.ourTarget()
        expect(target).to.equal(contractInstance.address)

        // fund paymaster
        let value = ethers.utils.parseEther("1.0")
        await owner.sendTransaction({
            to: paymasterInstance.address,
            value
        })

        let paymasterRelayBalance = await paymasterInstance.getRelayHubDeposit()
        expect(paymasterRelayBalance).to.equal(value)

        // configure signers to use new paymasterAddress
        let [acct] = await getSigners({ paymasterAddress: paymasterInstance.address })
        contractInstance = contractInstance.connect(acct)
        await contractInstance.setVal(42)
        let val = await contractInstance.getVal(await acct.getAddress())
        expect(val).to.equal(42)

        paymasterRelayBalance = await paymasterInstance.getRelayHubDeposit()
        expect(paymasterRelayBalance).to.be.below(value)
    })
})