import { createContext, useContext, useEffect, useState } from 'react'
const ethers = require('ethers')
const { RelayProvider } = require('@opengsn/gsn')
const Web3HttpProvider = require( 'web3-providers-http')

const Web3ProviderCtx = createContext()

export function Web3Provider({ children }) {
  // websocket connection can't do events for some reasaon????
  // let provider = new ethers.providers.WebSocketProvider(process.env.NEXT_PUBLIC_TEST_WS_CONNECTION)
  let provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_TEST_HTTP_CONNECTION)
  let gsnConfig = {
    paymasterAddress: process.env.NEXT_PUBLIC_PAYMASTER_ADDRESS,
    loggerConfiguration: {
      logLevel: 'error'
    }
  }

  let send = async (fn) => {
    let gsnProvider = await RelayProvider.newProvider({
      provider: new Web3HttpProvider(process.env.NEXT_PUBLIC_TEST_HTTP_CONNECTION),
      config: gsnConfig
    }).init()
    let from = gsnProvider.newAccount().address
    // wrap gsnPrivder with ethersProvider to interact with our contracts
    let ethersGSNProvider = new ethers.providers.Web3Provider(gsnProvider)
    // pre wrap all accounts in ethersGSNProvider)
    await fn(ethersGSNProvider.getSigner(from))
    // TODO: remove the key somehow
  }

  return (
    <Web3ProviderCtx.Provider value={{ provider, send }}>
      {children}
    </Web3ProviderCtx.Provider>
  )
}
// react hook for each page that want's to use this context
export function useProvider() {
  return useContext(Web3ProviderCtx)
}
