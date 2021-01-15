import '../styles/globals.css'
import { Contracts } from '../contexts/Web3Provider'

function MyApp({ Component, pageProps }) {
  return (
    <Contracts>
      <Component {...pageProps} />
    </Contracts>
  )
}
export default MyApp
