import { isAddress } from 'web3-utils'

export const transformHashForXinfin = (hash: string) => (isAddress(hash) ? hash.replace(/^0x/, 'xdc') : hash)
