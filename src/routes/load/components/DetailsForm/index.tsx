import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import CheckCircle from '@material-ui/icons/CheckCircle'
import React, { ReactElement, ReactNode } from 'react'
import { FormApi } from 'final-form'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'

import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import { StepperPageFormProps } from 'src/components/Stepper'
import AddressInput from 'src/components/forms/AddressInput'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import {
  mustBeEthereumAddress,
  noErrorsOn,
  required,
  composeValidators,
  validAddressBookName,
} from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { FIELD_LOAD_ADDRESS, FIELD_LOAD_NAME } from 'src/routes/load/components/fields'
import { secondary } from 'src/theme/variables'
import { getSafeInfo } from 'src/logic/safe/utils/safeInformation'
import { addressBookName } from 'src/logic/addressBook/store/selectors'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    maxWidth: '460px',
    marginTop: '12px',
  },
  check: {
    color: '#03AE60',
    height: '20px',
  },
  links: {
    '&>a': {
      color: secondary,
    },
  },
})

export const SAFE_ADDRESS_NOT_VALID = 'Address given is not a valid Safe address'

// In case of an error here, it will be swallowed by final-form
// So if you're experiencing any strang behaviours like freeze or hanging
// Don't mind to check if everything is OK inside this function :)
export const safeFieldsValidation = async (values): Promise<Record<string, string>> => {
  const errors = {}
  const address = values[FIELD_LOAD_ADDRESS]

  if (!address || mustBeEthereumAddress(address) !== undefined) {
    return errors
  }

  // If getSafeInfo does not provide data, it's not a valid safe.
  const safeInfo = await getSafeInfo(address).catch(() => null)
  if (!safeInfo) {
    errors[FIELD_LOAD_ADDRESS] = SAFE_ADDRESS_NOT_VALID
  }

  return errors
}

interface DetailsFormProps {
  errors: Record<string, string>
  form: FormApi
}

const DetailsForm = ({ errors, form }: DetailsFormProps): ReactElement => {
  const classes = useStyles()
  const { safeAddress } = useParams<{ safeAddress?: string }>()
  const safeName = useSelector((state) => (safeAddress ? addressBookName(state, { address: safeAddress }) : undefined))

  const handleScan = (value: string, closeQrModal: () => void): void => {
    form.mutators.setValue(FIELD_LOAD_ADDRESS, value)
    closeQrModal()
  }

  return (
    <>
      <Block margin="md">
        <Paragraph color="primary" noMargin size="md">
          You are about to add an existing Yodaplus Multi-Sig Safe. First, choose a name and enter the Safe address. The
          name is only stored locally and will never be shared with Yodaplus or any third parties.
          <br />
          Your connected wallet does not have to be the owner of this Safe. In this case, the interface will provide you
          a read-only view.
        </Paragraph>
      </Block>
      <Block className={classes.root}>
        <Col xs={11}>
          <Field
            defaultValue={safeName}
            component={TextField}
            name={FIELD_LOAD_NAME}
            placeholder="Name of the Safe*"
            text="Safe name"
            type="text"
            validate={composeValidators(required, validAddressBookName)}
            testId="load-safe-name-field"
          />
        </Col>
      </Block>
      <Block className={classes.root} margin="lg">
        <Col xs={11}>
          <AddressInput
            defaultValue={safeAddress}
            fieldMutator={(val) => {
              form.mutators.setValue(FIELD_LOAD_ADDRESS, val)
            }}
            // eslint-disable-next-line
            // @ts-ignore
            inputAdornment={
              noErrorsOn(FIELD_LOAD_ADDRESS, errors) && {
                endAdornment: (
                  <InputAdornment position="end">
                    <CheckCircle className={classes.check} data-testid="valid-address" />
                  </InputAdornment>
                ),
              }
            }
            name={FIELD_LOAD_ADDRESS}
            placeholder="Safe Address*"
            text="Safe Address"
            testId="load-safe-address-field"
          />
        </Col>
        <Col center="xs" className={classes} middle="xs" xs={1}>
          <ScanQRWrapper handleScan={handleScan} />
        </Col>
      </Block>
    </>
  )
}

const DetailsPage = () =>
  function LoadSafeDetails(controls: ReactNode, { errors, form }: StepperPageFormProps): ReactElement {
    return (
      <OpenPaper controls={controls}>
        <DetailsForm errors={errors} form={form} />
      </OpenPaper>
    )
  }

export default DetailsPage
