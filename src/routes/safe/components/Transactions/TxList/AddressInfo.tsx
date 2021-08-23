import React, { ReactElement } from 'react'

import { getExplorerInfo } from 'src/config'
import EthHashInfo from 'src/components/EthHashInfo'
import { useKnownAddress } from './hooks/useKnownAddress'

type Props = {
  address: string
  name?: string | undefined
  avatarUrl?: string | undefined
}

export const AddressInfo = ({ address, name, avatarUrl }: Props): ReactElement | null => {
  const toInfo = useKnownAddress(address, { name, image: avatarUrl })

  if (address === '') {
    return null
  }

  return (
    <EthHashInfo
      hash={address}
      name={toInfo.name}
      showAvatar
      customAvatar={toInfo.image}
      showCopyBtn
      explorerUrl={getExplorerInfo(address)}
    />
  )
}
