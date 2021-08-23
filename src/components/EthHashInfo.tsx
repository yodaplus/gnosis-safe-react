import React from 'react'
import { EthHashInfo as EthHashInfoExternal } from '@gnosis.pm/safe-react-components'

import { transformHashForXinfin } from 'src/utils/xinfin'

const EthHashInfo = ({ hash, ...restProps }: React.ComponentProps<typeof EthHashInfoExternal>) => {
  const xinfinHash = transformHashForXinfin(hash)

  return <EthHashInfoExternal hash={xinfinHash} {...restProps} />
}

export default EthHashInfo
