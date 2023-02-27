import { createEIP1193Provider, WalletInit, WalletModule, Device, EIP1102Request } from '@web3-onboard/common'
import Onboard, { WalletState } from '@web3-onboard/core'
import { AccountCenterOptions, AccountCenter, ConnectModalOptions } from '@web3-onboard/core/dist/types'
import { InjectedWalletModule, InjectedWalletOptions } from '@web3-onboard/injected-wallets/dist/types'
import walletConnectModule from '@web3-onboard/walletconnect'
import { InjectedProvider } from '@web3-onboard/injected-wallets/dist/types'
import { CustomWindow } from '@web3-onboard/injected-wallets/dist/types'
import { RequestPatch } from '@web3-onboard/common'
import { EthBalanceRequest, SelectAccountsRequest } from '@web3-onboard/common'
import { ProviderRpcError, ProviderRpcErrorCode } from '@web3-onboard/common'

import XDCPayIcon from 'src/assets/icons/xdc-icon.svg'
import VaultIcon from 'src/assets/images/yodaplus_icon.png'
import VaultIconWide from 'src/assets/images/yodaplus-logo-wide.png'
import { getWeb3, setWeb3 } from 'src/logic/wallets/getWeb3'
import { InjectedNameSpace, ProviderLabel } from 'src/logic/wallets/types'
import { fetchProvider } from 'src/logic/wallets/store/actions'
import { store } from 'src/store'
import { transformProviderFromXinfin } from 'src/utils/xinfin'
import { createXDCPayProvider } from './eip1193'

export const isWalletAvailable = (
  provider: InjectedProvider,
  checkProviderIdentity: InjectedWalletModule['checkProviderIdentity'],
  device: Device,
): boolean => {
  // No injected providers exist.
  if (!provider) {
    return false
  }

  // Many injected providers add their own object into window.
  if (checkProviderIdentity({ provider, device })) {
    return true
  }

  // For multiple injected providers, check providers array
  // example coinbase inj wallet pushes over-ridden wallets
  // into a providers array at window.ethereum
  return !!provider.providers?.some((provider) => checkProviderIdentity({ provider, device }))
}

function isXDCPay(provider) {
  //return !!provider && (!!provider.isXDCPay || !!provider.isMetaMask)
  return !!provider && !!provider.isXDCPay
}

async function getAddress() {
  const accounts = await getWeb3().eth.getAccounts()
  if (accounts.length === 0) {
    throw new ProviderRpcError({
      code: ProviderRpcErrorCode.ACCOUNT_ACCESS_REJECTED,
      message: 'User rejected the request.',
    })
  }
  return accounts
}

const xdcPayRequestPatch: RequestPatch = {
  eth_requestAccounts: ({ baseRequest }) => {
    return getWeb3().eth.getAccounts()
  },
  eth_getBalance: async ({ baseRequest }) => {
    const accounts = await getAddress()
    const activeAddress = accounts[0]
    const balanceReq: EthBalanceRequest = {
      method: 'eth_getBalance',
      params: [activeAddress, 'latest'],
    }
    const response = baseRequest(balanceReq)
    return response
  },
  eth_selectAccounts: ({ baseRequest }) => {
    const request: SelectAccountsRequest = {
      method: 'eth_selectAccounts',
    }
    return baseRequest(request)
  },
}

// const xdcPayModule: InjectedWalletModule = {
//   label: 'XDCPay V1',
//   injectedNamespace: InjectedNameSpace.Ethereum,
//   checkProviderIdentity: ({ provider }) => isXDCPay(provider),
//   getIcon: async () => XDCPayIcon,
//   // getInterface: async () => {
//   //   const anyWindow: any = window
//   //   if('ethereum' in window){
//   //     return {
//   //       provider: createXDCPayProvider(window.ethereum),
//   //     }
//   //   }
//   //   window.open('https://chrome.google.com/webstore/detail/xinpay/bocpokimicclpaiekenaeelehdjllofo', '_blank')
//   //   throw new Error('Please install XDCPay before proceeding')

//   // },
//   getInterface: async () => ({
//     provider: createXDCPayProvider(window.ethereum, xdcPayRequestPatch),
//   }),
//   platforms: ['all'],
// }

// const metamaskModule: InjectedWalletModule = {
//   label: ProviderLabel.XDCPay,
//   injectedNamespace: InjectedNameSpace.Ethereum,
//   checkProviderIdentity: ({ provider }) => !!provider && !!provider.isMetaMask,
//   //getIcon: async () => (await import('./icons/metamask')).default,
//   getIcon: async () => XDCPayIcon,
//   getInterface: async () => ({
//     provider: createEIP1193Provider(window.ethereum),
//   }),
//   platforms: ['all'],
// }

export const defaultWalletUnavailableMsg = ({ label }: InjectedWalletModule) =>
  `Please install or enable ${label} to continue`

function injected(options?: InjectedWalletOptions): WalletInit {
  if (typeof window === 'undefined') return () => null

  return (helpers) => {
    const { device } = helpers

    const { custom = [], filter = {}, displayUnavailable, sort, walletUnavailableMessage } = options || {}

    // combine custom with standard wallets and dedupe
    const allWallets = [...custom]

    const wallets = allWallets.reduce((acc, wallet) => {
      const { label, platforms, injectedNamespace, checkProviderIdentity } = wallet

      const walletFilters = filter[label]
      const filteredWallet = walletFilters === false
      const provider = window[injectedNamespace] as CustomWindow['ethereum']

      const walletAvailable = isWalletAvailable(provider, checkProviderIdentity, device)

      let excludedDevice = false

      // dev specified platform filters
      if (
        Array.isArray(walletFilters) &&
        (walletFilters.includes(device.type) || walletFilters.includes(device.os.name))
      ) {
        excludedDevice = true
      }

      // unavailable filter
      if (walletFilters === 'unavailable' && !walletAvailable) {
        excludedDevice = true
      }

      // wallet specified platform filters
      const invalidPlatform =
        !platforms.includes('all') && !platforms.includes(device.type) && !platforms.includes(device.os.name)

      const supportedWallet =
        !filteredWallet && !excludedDevice && !invalidPlatform && (walletAvailable || displayUnavailable)

      if (supportedWallet) {
        acc.push(
          // modify wallet to display error if unavailable but displayUnavailable is set
          displayUnavailable && !walletAvailable
            ? {
                ...wallet,
                getInterface: async () => {
                  throw new Error(
                    walletUnavailableMessage ? walletUnavailableMessage(wallet) : defaultWalletUnavailableMsg(wallet),
                  )
                },
              }
            : // otherwise add wallet to list as is
              wallet,
        )
      }

      return acc
    }, [] as InjectedWalletModule[])

    if (wallets.length) {
      const moreThanOneWallet = wallets.length > 1

      // if more than one wallet, then remove detected wallet
      const formattedWallets = wallets
        .filter((wallet) => {
          const { label } = wallet
          return !(label === ProviderLabel.MetaMask && moreThanOneWallet)
        })
        // then map to the WalletModule interface
        .map(({ label, getIcon, getInterface }: InjectedWalletModule) => ({
          label,
          getIcon,
          getInterface,
        }))
        // default sort by alphabetical
        .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0))

      return sort ? sort(formattedWallets) : formattedWallets
    }

    return []
  }
}

function providerIdentityCheck(provider: { chainId: any; isMetaMask: any }) {
  if (provider.chainId) {
    return !!provider && !!provider.isMetaMask && !!provider.chainId
  } else {
    return isXDCPay(provider)
  }
}

function providerInterface(window) {
  if ('chainId' in window.ethereum) {
    return createEIP1193Provider(window.ethereum)
  } else {
    return createXDCPayProvider(window.ethereum, xdcPayRequestPatch)
  }
}

const moduleToInject: InjectedWalletModule = {
  label: ProviderLabel.XDCPay,
  injectedNamespace: InjectedNameSpace.Ethereum,
  checkProviderIdentity: ({ provider }) => providerIdentityCheck(provider),
  getIcon: async () => XDCPayIcon,
  getInterface: async () => ({
    provider: providerInterface(window),
  }),
  platforms: ['all'],
}
const injectedWalletOpts: InjectedWalletOptions = {
  custom: [moduleToInject],
  displayUnavailable: true,
}

const web3 = getWeb3()
let lastUsedAddress = ''
let providerName

const walletConnect = walletConnectModule({
  bridge: 'https://bridge.walletconnect.org',
  qrcodeModalOptions: {
    mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar'],
  },
  connectFirstChainId: true,
})

const enabledChains = [
  {
    id: '0x32',
    token: 'XDC',
    label: 'XDC-Mainnet',
    rpcUrl: 'https://rpc.xinfin.yodaplus.net',
    //icon: XDCPayIcon,
  },
  {
    id: '0x33',
    token: 'TXDC',
    label: 'XDC-Apothem',
    rpcUrl: 'https://rpc-apothem.xinfin.yodaplus.net',
    //icon: XDCPayIcon,
  },
]

const yplusVaultMetadata = {
  name: 'YplusVault',
  icon: VaultIcon, // svg string icon ?
  logo: VaultIconWide, // svg string logo
  description: 'Multisig Vault for XDC Network',
  recommendedInjectedWallets: [
    { name: 'XDCPay', url: 'https://chrome.google.com/webstore/detail/xinpay/bocpokimicclpaiekenaeelehdjllofo' },
  ],
}

const onboardAccountCentre: AccountCenterOptions = {
  desktop: {
    position: 'bottomRight',
    enabled: true,
    minimal: false,
  },
  mobile: {
    position: 'bottomLeft',
    enabled: false,
    minimal: false,
  },
}

const connectOptions: ConnectModalOptions = {
  showSidebar: true,
  //autoConnectLastWallet: true
}

const onboard = Onboard({
  wallets: [injected(injectedWalletOpts), walletConnect],
  chains: enabledChains,
  appMetadata: yplusVaultMetadata,
  accountCenter: onboardAccountCentre,
  connect: connectOptions,
})

function processStateUpdate(state) {
  const [connectedWallet] = state.wallets
  if (connectedWallet) {
    const address = connectedWallet.provider.selectedAddress
    const chain = connectedWallet.provider.chainId
    providerName = connectedWallet.label
    console.log('Connected [' + providerName + ':' + address + ':' + chain + ']')

    if (!lastUsedAddress && address) {
      lastUsedAddress = address
      store.dispatch(fetchProvider(providerName))
    }

    setWeb3(transformProviderFromXinfin(connectedWallet.provider))
  } else {
    lastUsedAddress = ''
    providerName = undefined
  }
}

async function connectWallet() {
  const state = onboard.state.select()
  const { unsubscribe } = state.subscribe((update) => processStateUpdate(update))
  await onboard.connectWallet()
}

export async function disconnectWallet() {
  // disconnect the first wallet in the wallets array
  const [primaryWallet] = onboard.state.get().wallets
  await onboard.disconnectWallet({ label: primaryWallet.label })
}

export const OnboardUser = async (): Promise<boolean> => {
  connectWallet()
  const [connectedWallet] = onboard.state.get().wallets
  if (!connectedWallet) {
    return false
  }
  return true
}

export const PrimaryWallet = async (): Promise<WalletState> => {
  const [primaryWallet] = onboard.state.get().wallets
  return primaryWallet
}
