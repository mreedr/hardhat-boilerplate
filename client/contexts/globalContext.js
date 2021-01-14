// src/context/state.js
import { createContext, useContext } from 'react'

const AppContext = createContext()

export function AppWrapper({ children }) {
  let sharedState = {/* whatever you want */}

  return (
    <AppContext.Provider value={sharedState}>
      {children}
    </AppContext.Provider>
  )
}
// react hook for each page that want's to use this context
export function useAppContext() {
  return useContext(AppContext)
}
