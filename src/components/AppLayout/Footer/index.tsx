import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import * as React from 'react'

import GnoButtonLink from 'src/components/layout/ButtonLink'
import Link from 'src/components/layout/Link'
import { screenSm, secondary, sm } from 'src/theme/variables'

const useStyles = makeStyles({
  footer: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: '1',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: '0 auto',
    maxWidth: '100%',
    padding: `20px ${sm} 20px`,
    width: `${screenSm}px`,
  },
  item: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '13px',
    textDecoration: 'none',
  },
  link: {
    color: secondary,
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
  sep: {
    color: 'rgba(0, 0, 0, 0.54)',
    margin: '0 10px',
  },
  buttonLink: {
    padding: '0',
  },
} as any)

// const appVersion = process.env.REACT_APP_APP_VERSION ? `v${process.env.REACT_APP_APP_VERSION} ` : 'Versions'
const appVersion = 'Beta Version'

const Footer = (): React.ReactElement => {
  const date = new Date()
  const classes = useStyles()

  return (
    <footer className={classes.footer}>
      <span className={classes.item}>©{date.getFullYear()} Yodaplus</span>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item)} target="_blank">
        Terms
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item)} target="_blank">
        Privacy
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item)} target="_blank">
        Licenses
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item)} target="_blank">
        Imprint
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item)} target="_blank">
        Cookie Policy
      </Link>
      <span className={classes.sep}>-</span>
      <GnoButtonLink className={cn(classes.item)}>Preferences</GnoButtonLink>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item)} target="_blank">
        {appVersion}
      </Link>
    </footer>
  )
}

export default Footer
