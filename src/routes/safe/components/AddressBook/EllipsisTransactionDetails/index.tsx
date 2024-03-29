import { ClickAwayListener, createStyles, Divider } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { push } from 'connected-react-router'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { sameString } from 'src/utils/strings'
import { ADDRESS_BOOK_DEFAULT_NAME } from 'src/logic/addressBook/model/addressBook'
import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'
import { SAFE_ROUTES } from 'src/routes/routes'
import { safeAddressFromUrl } from 'src/logic/safe/store/selectors'
import { xs } from 'src/theme/variables'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { generatePath } from 'src/utils/xinfin'

const useStyles = makeStyles(
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      margin: `0 ${xs}`,
      borderRadius: '50%',
      transition: 'background-color .2s ease-in-out',
      '&:hover': {
        backgroundColor: '#F0EFEE',
      },
      outline: 'none',
    },
    increasedPopperZindex: {
      zIndex: 2001,
    },
  }),
)

type EllipsisTransactionDetailsProps = {
  address: string
  sendModalOpenHandler?: () => void
}

export const EllipsisTransactionDetails = ({
  address,
  sendModalOpenHandler,
}: EllipsisTransactionDetailsProps): React.ReactElement => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const dispatch = useDispatch()
  const currentSafeAddress = useSelector(safeAddressFromUrl)
  const isOwnerConnected = useSelector(grantedSelector)

  const recipientName = useSelector((state) => addressBookEntryName(state, { address }))
  // We have to check that the name returned is not UNKNOWN
  const isStoredInAddressBook = !sameString(recipientName, ADDRESS_BOOK_DEFAULT_NAME)

  const handleClick = (event) => setAnchorEl(event.currentTarget)

  const closeMenuHandler = () => setAnchorEl(null)

  const addOrEditEntryHandler = () => {
    const addressBookPath = generatePath(SAFE_ROUTES.ADDRESS_BOOK, {
      safeAddress: currentSafeAddress,
    })

    dispatch(push(`${addressBookPath}?entryAddress=${address}`))
    closeMenuHandler()
  }

  return (
    <ClickAwayListener onClickAway={closeMenuHandler}>
      <div className={classes.container} role="menu" tabIndex={0}>
        <MoreHorizIcon onClick={handleClick} onKeyDown={handleClick} />
        <Menu anchorEl={anchorEl} id="simple-menu" keepMounted onClose={closeMenuHandler} open={Boolean(anchorEl)}>
          {sendModalOpenHandler
            ? [
                <MenuItem key="send-again-button" onClick={sendModalOpenHandler} disabled={!isOwnerConnected}>
                  Send Again
                </MenuItem>,
                <Divider key="divider" />,
              ]
            : null}
          {isStoredInAddressBook ? (
            <MenuItem onClick={addOrEditEntryHandler}>Edit Address book Entry</MenuItem>
          ) : (
            <MenuItem onClick={addOrEditEntryHandler}>Add to address book</MenuItem>
          )}
        </Menu>
      </div>
    </ClickAwayListener>
  )
}
