import { useEffect, useState } from 'react'
const ethers = require('ethers')
import { useProvider } from '../contexts/Web3Provider'

export default function Claim({ address, abi }) {
  const { provider, send } = useProvider()
  const [ val, setVal ] = useState()
  let contract = new ethers.Contract(address, abi, provider)
  console.log('render')

  useEffect(() => {
    contract.on('ValSet', async (addr, val) => {
      console.log('event happened', addr, val.toString())
      setVal(val.toString())
    })
    return () => contract.removeAllListeners()
  }, [])

  useEffect(() => {
    (async () => {
      contract = contract.connect(provider)
      let version = await contract.versionRecipient()
      console.log(version)

      await send(async (signer) => {
        console.log('my address: ', await signer.getAddress())
        contract = contract.connect(signer)
        await contract.setVal(Date.now())
        let val = await contract.getVal(await signer.getAddress())
        setVal(val.toString())
      })
    })()
  }, [])

  return <div>hello {val}</div>
}

export async function getStaticProps(/*context*/) {
  return {
    props: {
      abi: require('../artifacts/contracts/MyContract.sol/MyContract.json').abi,
      address: require('../artifacts/addresses.json')['MyContract'],
    }
  }
}