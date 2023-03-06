import XDCLogo from 'src/config/assets/token_xdc.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, NetworkConfig, WALLETS, FEATURES } from 'src/config/networks/network.d'

const PAGE_URL = `${window.location.protocol}//${window.location.hostname}`

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: `${PAGE_URL}:8001/v1`,
  txServiceUrl: `${PAGE_URL}:8000/api/v1`,
  safeUrl: `https://mainnet.yplusvault.com`,
  gasPrice: 1_000_000_000,
  rpcServiceUrl: `${PAGE_URL}:8083`,
  safeAppsRpcServiceUrl: `${PAGE_URL}:8083`,
  networkExplorerName: 'XinFinScan',
  networkExplorerUrl: 'https://explorer.xinfin.network',
  networkExplorerApiUrl: 'https://explorer.xinfin.network/publicAPI',
}

const xinfin: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
      safeUrl: 'http://localhost:3000',
      clientGatewayUrl: `https://mainnet.yplusvault.com:8001/v1`,
      txServiceUrl: `https://mainnet.yplusvault.com:8000/api/v1`,
      rpcServiceUrl: `https://mainnet.yplusvault.com:8083`,
      safeAppsRpcServiceUrl: `https://mainnet.yplusvault.com:8083`,
    },
    staging: {
      ...baseConfig,
    },
    production: {
      ...baseConfig,
      safeUrl: 'http://localhost:3000',
      clientGatewayUrl: `https://mainnet.yplusvault.com:8001/v1`,
      txServiceUrl: `https://mainnet.yplusvault.com:8000/api/v1`,
      rpcServiceUrl: `https://mainnet.yplusvault.com:8083`,
      safeAppsRpcServiceUrl: `https://mainnet.yplusvault.com:8083`,
    },
  },
  network: {
    id: ETHEREUM_NETWORK.XINFIN,
    backgroundColor: '#E8673C',
    textColor: '#ffffff',
    label: 'Xinfin Mainnet',
    isTestNet: false,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'XDC',
      symbol: 'XDC',
      decimals: 18,
      logoUri: XDCLogo,
    },
  },
  disabledWallets: [WALLETS.FORTMATIC],
  disabledFeatures: [FEATURES.ERC1155, FEATURES.SPENDING_LIMIT],
}

export default xinfin
