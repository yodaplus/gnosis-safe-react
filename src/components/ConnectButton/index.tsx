import React, { ReactElement } from 'react'

import Button from 'src/components/layout/Button'
import { getNetworkId } from 'src/config'
import { getWeb3, setWeb3 } from 'src/logic/wallets/getWeb3'
import { fetchProvider } from 'src/logic/wallets/store/actions'
import { store } from 'src/store'
import { shouldSwitchNetwork, switchNetwork } from 'src/logic/wallets/utils/network'

const walletSelect = () => {
  if (!window.ethereum) {
    return false
  }

  setWeb3(window.ethereum as any)
  store.dispatch(fetchProvider('XinPay'))
  return true
}

walletSelect()

export const onboard = {
  getState(): any {
    return {
      wallet: {
        provider: window.ethereum,
        name: 'XinPay',
        type: 'sdk',
        connect: () => {},
      } as any,
    }
  },
  walletReset(): any {},
  walletSelect,
  walletCheck(): any {
    return true
  },
}

const checkWallet = async (): Promise<boolean> => {
  const ready = onboard.walletCheck()

  if (shouldSwitchNetwork()) {
    try {
      await switchNetwork(onboard.getState().wallet, getNetworkId())
      return true
    } catch (e) {
      e.log()
      return false
    }
  }

  return await ready
}

export const onboardUser = async (): Promise<boolean> => {
  // before calling walletSelect you want to check if web3 has been instantiated
  // which indicates that a wallet has already been selected
  // and web3 has been instantiated with that provider
  const web3 = getWeb3()
  const walletSelected = web3 ? true : await onboard.walletSelect()
  return walletSelected && checkWallet()
}

export const onConnectButtonClick = async (): Promise<void> => {
  const walletSelected = await onboard.walletSelect()

  // perform wallet checks only if user selected a wallet
  if (walletSelected) {
    await checkWallet()
  }
}

const ConnectButton = (props: { 'data-testid': string }): ReactElement => (
  <Button color="primary" minWidth={240} onClick={onConnectButtonClick} variant="contained" {...props}>
    Connect
  </Button>
)

export default ConnectButton
