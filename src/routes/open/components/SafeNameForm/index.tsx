import { createStyles, makeStyles } from '@material-ui/core/styles'
import * as React from 'react'
import styled from 'styled-components'

import OpenPaper from 'src/components/Stepper/OpenPaper'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { composeValidators, required, validAddressBookName } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import { FIELD_NAME } from 'src/routes/open/components/fields'
import { secondary, sm } from 'src/theme/variables'

const styles = createStyles({
  root: {
    display: 'flex',
    maxWidth: '440px',
  },
  text: {
    flexWrap: 'nowrap',
  },
  dot: {
    marginRight: sm,
  },
  links: {
    '&>a': {
      color: secondary,
    },
  },
})

const StyledField = styled(Field)`
  &.MuiTextField-root {
    width: 460px;
  }
`

const useSafeNameStyles = makeStyles(styles)

const SafeNameForm = ({ safeName }: { safeName: string }): React.ReactElement => {
  const classes = useSafeNameStyles()

  return (
    <>
      <Block margin="lg">
        <Paragraph color="primary" noMargin size="lg">
          You are about to create a new Safe with one or more owners. First, let&apos;s give your new Safe a name. This
          name is only stored locally and will never be shared with Yodaplus or any third parties.
        </Paragraph>
      </Block>
      <Block className={classes.root} margin="lg">
        <StyledField
          component={TextField}
          defaultValue={safeName}
          name={FIELD_NAME}
          placeholder="Name of the new Safe"
          text="Safe name"
          type="text"
          validate={composeValidators(required, validAddressBookName)}
          testId="create-safe-name-field"
        />
      </Block>
    </>
  )
}

const SafeNamePageComponent = () =>
  function SafeNamePage(controls, { values }): React.ReactElement {
    const { safeName } = values
    return (
      <OpenPaper controls={controls}>
        <SafeNameForm safeName={safeName} />
      </OpenPaper>
    )
  }

export default SafeNamePageComponent
