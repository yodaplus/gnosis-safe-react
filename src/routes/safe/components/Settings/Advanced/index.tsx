import { Text, theme, Title } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { useStyles } from './style'

import Block from 'src/components/layout/Block'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'

const InfoText = styled(Text)`
  margin-top: 16px;
`

const Bold = styled.strong`
  color: ${theme.colors.text};
`

const Advanced = (): ReactElement => {
  const classes = useStyles()
  const { nonce } = useSelector(currentSafe) ?? {}
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Settings', label: 'Advanced' })
  }, [trackEvent])

  return (
    <>
      {/* Nonce */}
      <Block className={classes.container}>
        <Title size="xs" withoutMargin>
          Safe Nonce
        </Title>
        <InfoText size="lg">
          For security reasons, transactions made with Yodaplus Multi-Sig Safe need to be executed in order. The nonce
          shows you which transaction will be executed next. You can find the nonce for a transaction in the transaction
          details.
        </InfoText>
        <InfoText color="secondaryLight" size="xl">
          Current Nonce: <Bold>{nonce}</Bold>
        </InfoText>
      </Block>
    </>
  )
}

export default Advanced
