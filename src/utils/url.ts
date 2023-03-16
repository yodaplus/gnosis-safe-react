export const isValidURL = (url: string, protocolsAllowed = ['https:', 'http:']): boolean => {
  try {
    const urlInfo = new URL(url)
    return protocolsAllowed.includes(urlInfo.protocol)
  } catch (error) {
    return false
  }
}

export const isSameURL = (url1: string, url2: string): boolean => {
  try {
    const a = new URL(url1)
    const b = new URL(url2)
    return a.href === b.href
  } catch (error) {
    return false
  }
}

export const parseToHttps = (url: any) => {
  const _url = url
  const url_split = _url.split(':')
  if (url_split[0] === 'https') {
    return url
  }
  return _url.replace(/^http/, 'https')
}
