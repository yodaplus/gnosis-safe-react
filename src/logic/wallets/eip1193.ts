import {
  RequestPatch,
  Balance,
  ChainId,
  EIP1193Provider,
  ProviderAccounts,
  ProviderRpcError,
} from '@web3-onboard/common'

/**
 * Takes a provider instance along with events
 * and requests to override and returns an EIP1193 provider
 *
 *  ## Example:
 *
 * *Overriding events: *
 * ```typescript
 * ```
 *
 * @param provider The provider to patch
 * @param requestPatch An `object` with the method to patch
 * and the implementation with which to patch
 * @param events Events to patch
 * @returns An EIP1193 Provider
 */
export const createXDCPayProvider = (provider: any, requestPatch?: RequestPatch): EIP1193Provider => {
  let baseRequest: any
  if (provider.request) {
    // Copy the original request method and bind the provider context to it
    baseRequest = provider.request.bind(provider)
  } else if (provider.sendAsync) {
    baseRequest = createRequest(provider)
  }

  const request: EIP1193Provider['request'] = async ({ method, params }) => {
    const key = method as keyof RequestPatch

    // If the request method is set to null
    // this indicates this method is not supported
    if (requestPatch && requestPatch[key] === null) {
      throw new ProviderRpcError({
        code: 4200,
        message: `The Provider does not support the requested method: ${method}`,
      })
    }

    if (requestPatch && requestPatch[key]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // @TODO - Fix this type error
      return requestPatch[key]({ baseRequest, params })
    } else if (baseRequest) {
      return baseRequest({ method, params })
    } else {
      throw new ProviderRpcError({
        code: 4200,
        message: `The Provider does not support the requested method: ${method}`,
      })
    }
  }
  provider.request = request
  return provider
}

interface JsonRpcResponse {
  id: string | undefined
  jsonrpc: '2.0'
  method: string
  result?: ProviderAccounts | Balance | ProviderAccounts | ChainId | null
  error?: string
}

const createRequest = (provider: any): EIP1193Provider['request'] =>
  (({ method, params }) =>
    new Promise((resolve, reject) => {
      if (method !== 'wallet_getPermissions') {
        provider.sendAsync(
          {
            id: 0,
            jsonrpc: '2.0',
            method,
            params,
          },
          (error: string, { result }: JsonRpcResponse) => {
            if (error) {
              // hack implemented to make XDCPayV1 error messages propagate.
              // error.stack is currently sent in error.message
              // causing JSON parsing issue
              const stringConstructor = 'String'.constructor
              if (error.constructor === stringConstructor) {
                reject(JSON.parse(error))
              } else {
                const errorObject = Object(error)
                if ('message' in errorObject) {
                  reject(errorObject.message)
                } else {
                  reject()
                }
              }
            } else {
              resolve(result == undefined ? null : (result as any))
            }
          },
        )
      }
    })) as EIP1193Provider['request']
