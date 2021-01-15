const { ethers } = require("hardhat")
const { RelayProvider } = require('@opengsn/gsn')
const Web3HttpProvider = require( 'web3-providers-http')
const GsnTestEnvironment = new require('@opengsn/gsn/dist/GsnTestEnvironment').GsnTestEnvironment

let accounts = [{
    address: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
}, {
    address: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
}, {
    address: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
}, {
    address: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
    privateKey: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"
}, {
    address: "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
    privateKey: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a"
}, {
    address: "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
    privateKey: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba"
}, {
    address: "0x976ea74026e726554db657fa54763abd0c3a0aa9",
    privateKey: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e"
}, {
    address: "0x14dc79964da2c08b23698b3d3cc7ca32193d9955",
    privateKey: "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356"
}, {
    address: "0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f",
    privateKey: "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97"
}, {
    address: "0xa0ee7a142d267c1f36714e4a8f75612f20a79720",
    privateKey: "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6"
}, {
    address: "0xbcd4042de499d14e55001ccbb24a551f3b954096",
    privateKey: "0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897"
}, {
    address: "0x71be63f3384f5fb98995898a86b02fb2426c5788",
    privateKey: "0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82"
}, {
    address: "0xfabb0ac9d68b0b445fb7357272ff202c5651694a",
    privateKey: "0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1"
}, {
    address: "0x1cbd3b2770909d4e10f157cabc84c7264073c9ec",
    privateKey: "0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd"
}, {
    address: "0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097",
    privateKey: "0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa"
}, {
    address: "0xcd3b766ccdd6ae721141f452c550ca635964ce71",
    privateKey: "0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61"
}, {
    address: "0x2546bcd3c84621e976d8185a91a922ae77ecec30",
    privateKey: "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0"
}, {
    address: "0xbda5747bfd65f08deb54cb465eb87d40e51b197e",
    privateKey: "0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd"
}, {
    address: "0xdd2fd4581271e230360230f9337d5c0430bf44c0",
    privateKey: "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0"
}, {
    address: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
    privateKey: "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"
}]

let gsnSigners
let defaultSigners
let pmAddress
let semaphore = false
const getInstance = async (opt) => {
    // setup default options
    let { paymasterAddress, useGSN } = {
        useGSN: true,
        paymasterAddress: (await GsnTestEnvironment.loadDeployment()).paymasterAddress,
        ...opt
    }

    if ((!gsnSigners && !semaphore) || paymasterAddress !== pmAddress) {
        semaphore = true // mark awaited constructor
        pmAddress = paymasterAddress
        // fallback to localhoast gsn paymaster if none is provided
        let config = {
            paymasterAddress,
            loggerConfiguration: {
                logLevel: 'error',
                // loggerUrl: 'logger.opengsn.org'
            }
        }
        let gsnProvider = await RelayProvider.newProvider({
            provider: new Web3HttpProvider('http://localhost:8545'),
            config
        }).init()
        // add default accounts to the gsnProvider
        let signers = []
        for (let account of accounts) {
            gsnProvider.addAccount({
                address: account.address,
                privateKey: Buffer.from(account.privateKey.replace('0x',''),'hex')
            })
            signers.push(account.address)
        }
        // add some unfunded accounts for testing
        for (let i = 0; i < 10; i++) {
            let from = gsnProvider.newAccount().address
            signers.push(from)
        }
        // wrap gsnPrivder with ethersProvider to interact with our contracts
        let ethersGSNProvider = new ethers.providers.Web3Provider(gsnProvider)
        // pre wrap all accounts in ethersGSNProvider
        gsnSigners = signers.map((addr) => ethersGSNProvider.getSigner(addr))
        // also initialize default signers in case caller wants to bypass the gsn
        defaultSigners = await ethers.getSigners()
    }
    return useGSN ? gsnSigners : defaultSigners || await ethers.getSigners()
}
module.exports = getInstance