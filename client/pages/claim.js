const ethers = require('ethers')
import { useProvider } from '../contexts/Web3Provider'

export default function Claim({ abis }) {
  const { provider } = useProvider()
  return <div>hi {JSON.stringify(provider)}</div>
}

export async function getStaticProps(context) {
  console.log('initial props is working..')
  return {
    props: {
      abis: []
    }
  }
}