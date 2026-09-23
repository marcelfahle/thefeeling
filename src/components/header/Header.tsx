import Link from 'next/link'
import clsx from 'clsx'
import Logo from './Logo'
import Home from './Home'
import BackToArchive from './BackToArchive'
import AboutButton from './AboutButton'
import styles from './Header.module.css'

export type HeaderAction = 'default' | 'static' | 'backhome' | 'backarchive' | 'toabout'

type Props = {
  backto?: string
  action?: HeaderAction
  size?: 'big' | 'small'
  flipped?: boolean
  position?: 'relative' | 'fixed'
  siteTitle?: string
}

/** Port of Header.js. Palette colors come from `html[data-palette]` CSS variables. */
export default function Header({
  backto = '/',
  action = 'default',
  size = 'big',
  flipped = false,
  position = 'relative',
  siteTitle = 'THE FEELING',
}: Props) {
  const Back =
    action === 'backhome' ? Home : action === 'backarchive' ? BackToArchive : action === 'toabout' ? AboutButton : null
  return (
    <div className={clsx(styles.header, styles[position], size === 'big' && styles.big)}>
      <Link href={backto}>
        {Back ? (
          <div className={clsx(styles.flipper, flipped && styles.flipped)}>
            <Logo siteTitle={siteTitle} />
            <Back className="back" siteTitle={siteTitle} />
          </div>
        ) : action === 'static' ? (
          <div className={styles.static}>
            <Logo siteTitle={siteTitle} />
          </div>
        ) : (
          <Logo siteTitle={siteTitle} />
        )}
      </Link>
    </div>
  )
}
