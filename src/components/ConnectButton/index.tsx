import React, { ReactElement } from 'react'

import Button from 'src/components/layout/Button'
import { getNetworkName, getNetworkId } from 'src/config'
//import { getWeb3, setWeb3 } from 'src/logic/wallets/getWeb3'
// import { fetchProvider, removeProvider } from 'src/logic/wallets/store/actions'
// import transactionDataCheck from 'src/logic/wallets/transactionDataCheck'
//import { getSupportedWallets } from 'src/logic/wallets/utils/walletList'
// import { store } from 'src/store'
// import { shouldSwitchNetwork, switchNetwork } from 'src/logic/wallets/utils/network'
// import { transformProviderFromXinfin } from 'src/utils/xinfin'
import { OnboardUser } from 'src/logic/wallets/walletConnection'

const networkId = getNetworkId()
const networkName = getNetworkName().toLowerCase()

// let lastUsedAddress = ''
// let providerName

const ConnectButton = (props: { 'data-testid': string }): ReactElement => (
  <Button color="primary" minWidth={240} onClick={OnboardUser} variant="contained" {...props}>
    Connect
  </Button>
)

export default ConnectButton
