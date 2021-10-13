import XDCLogo from 'src/config/assets/token_xdc.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, NetworkConfig, WALLETS, FEATURES } from 'src/config/networks/network.d'

const PAGE_URL = `${window.location.protocol}//${window.location.hostname}`

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: `${PAGE_URL}:8001/v1`,
  txServiceUrl: `${PAGE_URL}:8000/api/v1`,
  safeUrl: `https://safe.xinfin.yodaplus.net`,
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
      clientGatewayUrl: `https://safe.xinfin.yodaplus.net:8001/v1`,
      txServiceUrl: `https://safe.xinfin.yodaplus.net:8000/api/v1`,
      rpcServiceUrl: `https://safe.xinfin.yodaplus.net:8083`,
      safeAppsRpcServiceUrl: `https://safe.xinfin.yodaplus.net:8083`,
    },
    staging: {
      ...baseConfig,
    },
    production: {
      ...baseConfig,
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
  disabledFeatures: [FEATURES.CONTRACT_INTERACTION, FEATURES.ERC1155, FEATURES.SAFE_APPS, FEATURES.SPENDING_LIMIT],
}

export default xinfin
