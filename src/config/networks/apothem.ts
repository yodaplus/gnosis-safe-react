import XDCLogo from 'src/config/assets/token_xdc.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, NetworkConfig, WALLETS, FEATURES } from 'src/config/networks/network.d'

const PAGE_URL = `${window.location.protocol}//${window.location.hostname}`

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: `${PAGE_URL}:8001/v1`,
  txServiceUrl: `${PAGE_URL}:8000/api/v1`,
  safeUrl: `https://apothem.yplusvault.com`,
  gasPrice: 1_000_000_000,
  rpcServiceUrl: `${PAGE_URL}:8083`,
  safeAppsRpcServiceUrl: `${PAGE_URL}:8083`,
  networkExplorerName: 'XinFinScan',
  networkExplorerUrl: 'https://explorer.apothem.network',
  networkExplorerApiUrl: 'https://explorer.apothem.network/publicAPI',
}

const apothem: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
      safeUrl: 'http://localhost:3000',
      clientGatewayUrl: `https://apothem.yplusvault.com:8001/v1`,
      txServiceUrl: `https://apothem.yplusvault.com:8000/api/v1`,
      rpcServiceUrl: `https://apothem.yplusvault.com:8083`,
      safeAppsRpcServiceUrl: `https://apothem.yplusvault.com:8083`,
    },
    staging: {
      ...baseConfig,
    },
    production: {
      ...baseConfig,
    },
  },
  network: {
    id: ETHEREUM_NETWORK.APOTHEM,
    backgroundColor: '#E8673C',
    textColor: '#ffffff',
    label: 'Apothem',
    isTestNet: true,
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

export default apothem
