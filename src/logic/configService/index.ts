// import axios from 'axios'
// import { getNetworkId } from 'src/config'
// import { CONFIG_SERVICE_URL } from 'src/utils/constants'

export type AppData = {
  url: string
  name?: string
  disabled?: boolean
  description?: string
  networks: number[]
  custom?: boolean
  iconUrl?: string
}

enum Endpoints {
  SAFE_APPS = '/safe-apps/',
}

export const fetchSafeAppsList = async (): Promise<AppData[]> => {
  const preloadedApps = [
    {
      url: 'https://governance.comtechglobal.ae/',
      name: 'Comtech Gold',
      description: 'Tokenize Comtech Gold',
      networks: [50, 51],
      custom: false,
      iconUrl: 'https://governance.comtechglobal.ae/favicon/apple-touch-icon.png',
    },
  ]
  return preloadedApps
}
