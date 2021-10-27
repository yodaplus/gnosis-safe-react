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

const traverseXdcObjRec = (obj) => {
  const mapValue = (value) => {
    if (typeof value === 'string' && /^xdc/.test(value)) {
      return value.replace(/^xdc/, '0x')
    }

    if (typeof value === 'object') {
      return traverseXdcObjRec(value)
    }

    return value
  }

  if (obj instanceof Array) {
    return obj.map(mapValue)
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, mapValue(value)]))
  }

  return obj
}

export const transformProviderFromXinfin = (provider: any) => {
  const _sendAsync = provider.constructor.prototype.sendAsync
  provider.sendAsync = function (payload, callback) {
    return _sendAsync.call(this, payload, (error, response) => {
      callback(error, traverseXdcObjRec(response))
    })
  }

  return provider
}
