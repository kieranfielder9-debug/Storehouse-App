import Storehouse from './Storehouse.jsx'
import WisdomWalletSite from './wisdom-wallet/WisdomWalletSite.jsx'

export default function App() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('site') === 'wisdom-wallet') return <WisdomWalletSite />
  return <Storehouse />
}
