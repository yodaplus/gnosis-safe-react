import EtherLogo from 'src/config/assets/token_eth.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, NetworkConfig, WALLETS } from 'src/config/networks/network.d'
import { ETHGASSTATION_API_KEY } from 'src/utils/constants'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'http://localhost:8001/v1',
  txServiceUrl: 'http://localhost:8000/api/v1',
  safeUrl: 'https://rinkeby.gnosis-safe.io/app',
  gasPriceOracle: {
    url: `https://ethgasstation.info/json/ethgasAPI.json?api-key=${ETHGASSTATION_API_KEY}`,
    gasParameter: 'average',
    gweiFactor: '1e8',
  },
  rpcServiceUrl: 'http://localhost:8083',
  safeAppsRpcServiceUrl: 'http://localhost:8083',
  networkExplorerName: 'XinFinScan',
  networkExplorerUrl: 'https://explorer.apothem.network',
  networkExplorerApiUrl: 'https://explorer.apothem.network/publicAPI',
}

const rinkeby: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
      safeUrl: 'http://localhost:3000',
    },
    staging: {
      ...baseConfig,
      safeUrl: 'https://safe-team-rinkeby.staging.gnosisdev.com/app/',
    },
    production: {
      ...baseConfig,
      clientGatewayUrl: 'https://safe-client.rinkeby.gnosis.io/v1',
      txServiceUrl: 'https://safe-transaction.rinkeby.gnosis.io/api/v1',
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
      logoUri: EtherLogo,
    },
  },
  disabledWallets: [WALLETS.FORTMATIC],
}

export default rinkeby
