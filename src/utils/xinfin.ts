import { isAddress } from 'web3-utils'
import { generatePath as generatePathOriginal } from 'react-router-dom'

export const transformHashForXinfin = (hash: string) => (isAddress(hash) ? hash.replace(/^0x/, 'xdc') : hash)

export const transformHashFromXinfin = (hash: string) => {
  const candidate = hash.replace(/^xdc/, '0x')

  return isAddress(candidate) ? candidate : hash
}

export const generatePath: typeof generatePathOriginal = (path, params) => {
  if (params && 'safeAddress' in params) {
    ;(params as any).safeAddress = transformHashForXinfin((params as any).safeAddress)
  }

  try {
    return generatePathOriginal(path, params)
  } catch {
    return ''
  }
}
