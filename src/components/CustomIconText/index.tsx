import React, { ReactElement } from 'react'

import EthHashInfo from 'src/components/EthHashInfo'

type Props = {
  address: string
  iconUrl?: string
  iconUrlFallback?: string
  text?: string
}

export const CustomIconText = ({ address, iconUrl, text, iconUrlFallback }: Props): ReactElement => (
  <EthHashInfo
    hash={address}
    showHash={false}
    avatarSize="sm"
    showAvatar
    customAvatar={iconUrl || undefined}
    customAvatarFallback={iconUrlFallback}
    name={text}
    textSize="xl"
  />
)
