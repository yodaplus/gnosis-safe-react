import ReactGA from 'react-ga'
import { Dispatch } from 'redux'

import addProvider from './addProvider'

import { getNetworkInfo } from 'src/config'
import { NOTIFICATIONS, enhanceSnackbarForAction } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { getProviderInfo, getWeb3 } from 'src/logic/wallets/getWeb3'
import { makeProvider } from 'src/logic/wallets/store/model/provider'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

export const processProviderResponse = (dispatch, provider) => {
  const walletRecord = makeProvider(provider)
  dispatch(addProvider(walletRecord))
}

const handleProviderNotification = (provider, dispatch) => {
  const { available, loaded } = provider

  if (!loaded) {
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
    return
  }

  if (getNetworkInfo().isTestNet) {
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TESTNET_VERSION_MSG)))
  }

  if (getNetworkInfo().id === ETHEREUM_NETWORK.XINFIN) {
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.BETA_VERSION_MSG)))
  }

  if (available) {
    // NOTE:
    // if you want to be able to dispatch a `closeSnackbar` action later on,
    // you SHOULD pass your own `key` in the options. `key` can be any sequence
    // of number or characters, but it has to be unique to a given snackbar.

    ReactGA.event({
      category: 'Wallets',
      action: 'Connect a wallet',
      label: provider.name,
    })
  } else {
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.UNLOCK_WALLET_MSG)))
  }
}

export default (providerName: string) =>
  async (dispatch: Dispatch): Promise<void> => {
    const web3 = getWeb3()
    const providerInfo = await getProviderInfo(web3, providerName)
    await handleProviderNotification(providerInfo, dispatch)
    processProviderResponse(dispatch, providerInfo)
  }
