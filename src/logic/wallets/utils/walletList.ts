import { WalletInitOptions, WalletModule } from 'bnc-onboard/dist/src/interfaces'
import { getNetworkId, getRpcServiceUrl, getNetworkConfigDisabledWallets } from 'src/config'
import { WALLETS } from 'src/config/networks/network.d'
import WALLET_ICONS from 'src/components/AppLayout/Header/components/WalletIcon/icons'
import { WALLET_PROVIDER } from 'src/logic/wallets/getWeb3'

const networkId = getNetworkId()
const disabledWallets = getNetworkConfigDisabledWallets()

type Wallet = WalletInitOptions & {
  desktop: boolean
  walletName: WALLETS
}

const rpcUrl = getRpcServiceUrl()
const wallets: Wallet[] = [
  {
    walletName: WALLETS.WALLET_CONNECT,
    // as stated in the documentation, `infuraKey` is not mandatory if rpc is provided
    rpc: { [networkId]: rpcUrl },
    desktop: true,
    bridge: 'https://safe-walletconnect.gnosis.io/',
    preferred: true,
  },
]

const customWallets: WalletModule[] = [
  {
    name: 'XinPay',
    iconSrc: WALLET_ICONS[WALLET_PROVIDER.XINPAY].src,
    iconSrcSet: WALLET_ICONS[WALLET_PROVIDER.XINPAY].src,
    wallet: async (helpers) => {
      const { createModernProviderInterface } = helpers
      const provider = (window as any).ethereum
      const network = provider?.publicConfigStore?._state?.networkVersion
      const correctWallet = network === '50' || network === '51'

      return {
        provider,
        interface: correctWallet ? createModernProviderInterface(provider) : null,
      }
    },
    type: 'injected',
    link: 'https://chrome.google.com/webstore/detail/xinpay/bocpokimicclpaiekenaeelehdjllofo',
    installMessage: (wallets) => {
      const { currentWallet, selectedWallet } = wallets
      if (currentWallet) {
        return `You have ${currentWallet} installed already but if you would prefer to use ${selectedWallet} instead, then click below to install.`
      }

      return `You will need to install ${selectedWallet} to continue. Click below to install.`
    },
    desktop: true,
    mobile: false,
    preferred: true,
  },
]

export const getSupportedWallets = () => {
  const { isDesktop } = window

  const filteredWallets = isDesktop
    ? wallets.filter((wallet) => wallet.desktop).map(({ desktop, ...rest }) => rest)
    : wallets.map(({ desktop, ...rest }) => rest).filter((w) => !disabledWallets.includes(w.walletName))

  return [...customWallets, ...filteredWallets]
}
