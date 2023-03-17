import React from 'react'
import styled from 'styled-components'
import { Card, Button, Title, Text, Divider, Dot, Icon } from '@gnosis.pm/safe-react-components'

import Link from 'src/components/layout/Link'
import Block from 'src/components/layout/Block'
import { LOAD_ADDRESS, OPEN_ADDRESS } from 'src/routes/routes'
import { OnboardUser } from 'src/logic/wallets/walletConnection'
import { useSelector } from 'react-redux'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 24px 0 0 0;
`
const StyledCardDouble = styled(Card)`
  display: flex;
  padding: 0;
`
const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 20px 0 0;
  max-width: 27%;
  height: 276px;
`
const CardsCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  width: 50%;
`
const StyledButton = styled(Button)`
  margin-top: auto !important;
  text-decoration: none;
`
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 0 16px 0;

  h5 {
    color: white;
  }
`
const StyledTitle = styled(Title)`
  margin: 0 0 0 16px;
`
const StyledTitleOnly = styled(Title)`
  margin: 0 0 16px 0;
`

type Props = {
  isOldMultisigMigration?: boolean
}

export const WelcomeLayout = ({ isOldMultisigMigration }: Props): React.ReactElement => {
  const provider = useSelector(providerNameSelector)
  return (
    <Block>
      {/* Title */}
      <Title size="md" strong>
        Welcome to Yodaplus Multi-Sig Safe.
      </Title>

      {/* Subtitle */}
      <Title size="xs">
        {isOldMultisigMigration ? (
          <>
            We will replicate the owner structure from your existing Yodaplus MultiSig to let you test the new
            interface. As soon as you feel comfortable, start moving funds to your new Safe.
          </>
        ) : (
          <>
            Yodaplus Multi-Sig Safe is the most trusted platform to manage digital assets on XinFin Block Chain. <br />{' '}
            Here is how to get started:{' '}
          </>
        )}
      </Title>

      <>
        <Wrapper>
          {/* Connect wallet */}
          <StyledCard>
            <TitleWrapper>
              <Dot color="primary">
                {!provider ? <Title size="xs">1</Title> : <Icon color="white" type="check" size="md" />}
              </Dot>
              <StyledTitle size="sm" strong withoutMargin>
                Connect wallet
              </StyledTitle>
            </TitleWrapper>
            <Text size="xl">
              Yodaplus Multi-Sig Safe supports a wide range of wallets that you can choose to interact with your Safe.
            </Text>
            <StyledButton
              size="lg"
              color="primary"
              variant="contained"
              onClick={OnboardUser}
              disabled={!!provider}
              data-testid="connect-btn"
            >
              <Text size="xl" color="white">
                Connect wallet
              </Text>
            </StyledButton>
          </StyledCard>

          <StyledCardDouble disabled={!provider}>
            {/* Create safe */}
            <CardsCol>
              <TitleWrapper>
                <Dot color="primary">
                  <Title size="xs">2</Title>
                </Dot>
                <StyledTitle size="sm" strong withoutMargin>
                  Create Safe
                </StyledTitle>
              </TitleWrapper>
              <Text size="xl">
                Create a new Safe that is controlled by one or multiple owners. <br />
                You will be required to pay a network fee for creating your new Safe.
              </Text>
              <StyledButton size="lg" color="primary" variant="contained" component={Link} to={OPEN_ADDRESS}>
                <Text size="xl" color="white">
                  + Create new Safe
                </Text>
              </StyledButton>
            </CardsCol>

            <Divider orientation="vertical" />

            {/* Load safe */}
            <CardsCol>
              <StyledTitleOnly size="sm" strong withoutMargin>
                Add existing Safe
              </StyledTitleOnly>
              <Text size="xl">
                Already have a Safe? Do you want to access your Safe from a different device? Easily add it using your
                Safe address.
              </Text>
              <StyledButton
                variant="bordered"
                iconType="safe"
                iconSize="sm"
                size="lg"
                color="secondary"
                component={Link}
                to={LOAD_ADDRESS}
              >
                <Text size="xl" color="secondary">
                  Add existing Safe
                </Text>
              </StyledButton>
            </CardsCol>
          </StyledCardDouble>
        </Wrapper>
      </>
    </Block>
  )
}
