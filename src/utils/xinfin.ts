import { isAddress } from 'web3-utils'

export const transformHashForXinfin = (hash: string) => (isAddress(hash) ? hash.replace(/^0x/, 'xdc') : hash)

export const transformHashFromXinfin = (hash: string) => {
  const candidate = hash.replace(/^xdc/, '0x')

  return isAddress(candidate) ? candidate : hash
}
