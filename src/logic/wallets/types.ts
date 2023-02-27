import type { ExternalProvider } from '@ethersproject/providers'
import { WalletModule, Platform, Device } from '@web3-onboard/common'

/**
 * The `ProviderIdentityFlag` is a property on an injected provider
 * that uniquely identifies that provider
 */
export enum ProviderIdentityFlag {
  MetaMask = 'isMetaMask',
  XDCPay = 'isXDCPay',
}

export enum ProviderLabel {
  MetaMask = 'MetaMask',
  XDCPay = 'XDCPay',
}

export enum InjectedNameSpace {
  Ethereum = 'ethereum',
  Web3 = 'web3',
}

export type InjectedProvider = ExternalProvider & Record<string, boolean> & Record<string, InjectedProvider[]>

export type WalletFilters = {
  /**A provider label mapped to a list of excluded platforms
   * or a boolean indicating if it should be included. */
  [key in ProviderLabel | string]?: Platform[] | boolean | 'unavailable'
}

export interface InjectedWalletOptions {
  /**A list of injected wallets to include that
   * are not included by default here: ./packages/injected/ */
  custom?: InjectedWalletModule[]
  /**A mapping of a provider label to a list of filtered platforms
   * or a boolean indicating if it should be included or not.
   * By default all wallets listed in ./packages/injected/
   * are included add them to here to remove them. */
  filter?: WalletFilters
  /**Will display wallets to be selected even if they
   * are not currently available to the end user.
   */
  displayUnavailable?: boolean
  /**A function that allows for customizing the message to be displayed if the wallet
   * is unavailable
   */
  walletUnavailableMessage?: (wallet: WalletModule) => string
  /**Function that can be used to sort the order of wallets that are displayed */
  sort?: (wallets: WalletModule[]) => WalletModule[]
}

export interface InjectedWalletModule extends WalletModule {
  injectedNamespace: InjectedNameSpace
  checkProviderIdentity: (helpers: { provider: any; device: Device }) => boolean
  platforms: Platform[]
}
