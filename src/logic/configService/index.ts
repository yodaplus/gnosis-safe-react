import axios from 'axios'
import { getNetworkId } from 'src/config'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { APPS_STORAGE_KEY, getEmptySafeApp } from 'src/routes/safe/components/Apps/utils'
import { StoredSafeApp } from 'src/routes/safe/components/Apps/types'

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
  const persistedAppList = (await loadFromStorage<(StoredSafeApp & { disabled?: boolean })[]>(APPS_STORAGE_KEY)) || []

  console.log('🚀 ~ file: index.ts:23 ~ fetchSafeAppsList ~ persistedAppList:', persistedAppList)

  const checkExistense = persistedAppList.filter((app) => app.url === 'https://governance.comtechglobal.ae/')

  console.log('🚀 ~ file: index.ts:27 ~ fetchSafeAppsList ~ checkExistense:', checkExistense.length >= 1)

  if (checkExistense.length < 1) {
    persistedAppList.push({ url: 'https://governance.comtechglobal.ae/', disabled: false })
    saveToStorage(APPS_STORAGE_KEY, persistedAppList)
  }

  // ****

  // await loadFromStorage<(StoredSafeApp & { disabled?: boolean })[]>(APPS_STORAGE_KEY)

  // console.log('🚀 ~ file: index.ts:23 ~ fetchSafeAppsList ~ persistedAppList:', persistedAppList[0].url)

  // const newAppList = [
  //   { url: 'https://governance.comtechglobal.ae/', disabled: false },
  //   ...persistedAppList.map(({ url, disabled }) => ({ url, disabled })),
  // ]
  // saveToStorage(APPS_STORAGE_KEY, newAppList)
  // saveToStorage(APPS_STORAGE_KEY, [{ url: 'https://governance.comtechglobal.ae/', disabled: false }])

  const networkId = getNetworkId()
  return axios.get(`${CONFIG_SERVICE_URL}${Endpoints['SAFE_APPS']}?chainId=${networkId}`).then(({ data }) => data)
}
