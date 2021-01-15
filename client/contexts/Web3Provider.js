import { createContext, useContext } from 'react'
const ethers = require('ethers')
const Web3ProviderCtx = createContext()

export function Web3Provider({ children }) {
  let provider = new ethers.providers.JsonRpcProvider(process.env.TEST_WS_CONNECTION)
  // do I initialize all the contracts here? probably not since they will need to be fetched
  // well... I guess I could build them into the project
  // I don't think so
  return (
    <Web3ProviderCtx.Provider value={{ provider }}>
      {children}
    </Web3ProviderCtx.Provider>
  )
}
// react hook for each page that want's to use this context
export function useProvider() {
  return useContext(Web3ProviderCtx)
}
