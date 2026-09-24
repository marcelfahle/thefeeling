'use client'

import { useEffect, useState } from 'react'
import Logo from '@/components/header/Logo'
import type { FontRole } from '@/lib/fonts/catalog'
import styles from './TypeSpecimen.module.css'

type Font = { id: string; family: string; role: FontRole; why: string; stack: string; enabled: boolean }

const ROLES: { role: FontRole; name: string; desc: string }[] = [
  { role: 'grotesk', name: 'Grotesk', desc: 'The “Helvetica” slot: clean and neutral, for body text or headlines.' },
  { role: 'serif', name: 'Serif', desc: 'The “Times” slot: today’s look, or a more refined version of it.' },
  { role: 'display', name: 'Headline', desc: 'Only for big words: campaign titles, one-liners on a slide.' },
  { role: 'mono', name: 'Typewriter', desc: 'Small credits, captions, the “client / service” lines.' },
]
const SITE_SERIF = "Times, 'Times New Roman', serif"
const KEY = 'tf-font-picks'

function Sample({ role }: { role: FontRole }) {
  if (role === 'display')
    return (
      <>
        <p className={styles.sDisplay}>Talk is cheap.</p>
        <p className={styles.sBody}>Our work is smart. Because we always start out stupid.</p>
      </>
    )
  if (role === 'mono')
    return (
      <>
        <p className={styles.sCredit}>
          Porsche Bank
          <br />
          <b>Ads and Social Media Campaign</b>
          <br />
          <i>Car Subscription</i>
        </p>
        <p className={styles.sBody}>Grüße aus Düsseldorf – 90 Minuten, 12053 Berlin.</p>
      </>
    )
  return (
    <>
      <p className={styles.sHead}>
        donqi Delivery Services
        <br />
        <b>Naming, Branding, Logo Design</b>
      </p>
      <p className={styles.sBody}>
        CoVid was a sucker. But believe it or not, some good things came out of it. For example, the first organic food
        delivery service ever: <b>donqi</b> was born in 2021 with an <i>ambitious</i> goal. Grüße aus Düsseldorf.
      </p>
    </>
  )
}

/** Font picker for the editor's Font menu, set on the studio's own copy. */
export default function TypeSpecimen({ fonts, sizes }: { fonts: Font[]; sizes: { label: string; value: string }[] }) {
  const defaults = fonts.filter((f) => f.enabled).map((f) => f.id)
  const [picks, setPicks] = useState<string[]>(defaults)
  const [copied, setCopied] = useState(false)
  const [head, setHead] = useState('Archivo Black')
  const [body, setBody] = useState('Inter')
  const [size, setSize] = useState('2.25em')

  // per-browser memory of the picks (a convenience only)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(saved)) setPicks(saved)
    } catch {}
  }, [])
  const update = (next: string[]) => {
    setPicks(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {}
  }

  const stackOf = (family: string) => fonts.find((f) => f.family === family)?.stack ?? SITE_SERIF
  const picked = fonts.filter((f) => picks.includes(f.id)).map((f) => f.family)
  const copy = async () => {
    const text = `Fonts for the editor: Standard, ${picked.join(', ')}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.prompt('Copy this list', text)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.top}>
          <div className={styles.intro}>
            <div className={styles.logo}>
              <Logo />
            </div>
            <h1>Pick the fonts for the text editor</h1>
            <p>
              Whatever you pick here shows up in the <b>Font</b> menu when you edit a project text in DatoCMS. We
              suggest 3–5 in total. “Standard” (today’s look, the serif of this headline) is always there. Each sample
              uses your own copy, including umlauts.
            </p>
          </div>
          <span className={styles.label}>{defaults.length} fonts in the editor now</span>
        </div>

        {ROLES.map(({ role, name, desc }) => (
          <section key={role} className={styles.role} aria-labelledby={`h-${role}`}>
            <div className={styles.roleHead}>
              <h2 id={`h-${role}`}>{name}</h2>
              <p>{desc}</p>
            </div>
            <div className={styles.grid}>
              {fonts
                .filter((f) => f.role === role)
                .map((f) => {
                  const on = picks.includes(f.id)
                  return (
                    <article key={f.id} className={styles.card} data-picked={on}>
                      <header>
                        <h3>{f.family}</h3>
                        {f.enabled && <span className={styles.rec}>in the editor</span>}
                      </header>
                      <div className={styles.sample} style={{ fontFamily: f.stack }}>
                        <Sample role={role} />
                      </div>
                      <footer>
                        <p className={styles.why}>{f.why}</p>
                        <button
                          type="button"
                          id={`pick-${f.id}`}
                          className={styles.pick}
                          aria-pressed={on}
                          onClick={() => update(on ? picks.filter((p) => p !== f.id) : [...picks, f.id])}
                        >
                          {on ? 'Picked' : 'Pick'}
                        </button>
                      </footer>
                    </article>
                  )
                })}
            </div>
          </section>
        ))}

        <section className={styles.mixer} aria-labelledby="h-mix">
          <div className={styles.controls}>
            <div className={styles.roleHead}>
              <h2 id="h-mix">Try a mix</h2>
            </div>
            <label htmlFor="mixHead">
              Headline line
              <select id="mixHead" value={head} onChange={(e) => setHead(e.target.value)}>
                <option value="standard">Standard (today)</option>
                {fonts.map((f) => (
                  <option key={f.id}>{f.family}</option>
                ))}
              </select>
            </label>
            <label htmlFor="mixBody">
              Body text
              <select id="mixBody" value={body} onChange={(e) => setBody(e.target.value)}>
                <option value="standard">Standard (today)</option>
                {fonts.map((f) => (
                  <option key={f.id}>{f.family}</option>
                ))}
              </select>
            </label>
            <label htmlFor="mixSize">
              Headline size
              <select id="mixSize" value={size} onChange={(e) => setSize(e.target.value)}>
                {sizes.map((s) => (
                  <option key={s.label} value={s.value}>
                    {s.label} ({s.value})
                  </option>
                ))}
              </select>
            </label>
            <p className={styles.why}>
              Sizes in the editor are steps relative to the block’s base size, so they stay in proportion on phones.
            </p>
          </div>
          <div>
            <div className={styles.slide} aria-live="polite">
              <div className={styles.box}>
                <p style={{ fontFamily: stackOf(head), fontSize: size, lineHeight: 1.05 }}>Talk is cheap.</p>
                <p style={{ fontFamily: stackOf(body) }}>
                  CoVid was a sucker. But believe it or not, some good things came out of it. For example, the first
                  organic food delivery service ever: <b>donqi</b> was born in 2021 with an ambitious goal – to simply
                  get the best food to their customers’ doorsteps.
                </p>
              </div>
            </div>
            <div className={styles.steps} aria-label="Size steps" style={{ fontFamily: stackOf(head) }}>
              {sizes.map((s) => (
                <span key={s.label} style={{ fontSize: `calc(24px * ${parseFloat(s.value)})` }}>
                  <small>{s.label}</small>Aa
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className={styles.tray} role="region" aria-label="Your picks">
        <div className={styles.trayIn}>
          <output htmlFor={picks.map((p) => `pick-${p}`).join(' ')}>
            Font menu: <b>Standard</b>
            {picked.map((n) => (
              <span key={n}>
                , <b>{n}</b>
              </span>
            ))}{' '}
            <span className={styles.why}>({picked.length + 1} total)</span>
          </output>
          <div className={styles.actions}>
            <button type="button" className={`${styles.btn} ${styles.ghost}`} onClick={() => update(defaults)}>
              Reset
            </button>
            <button type="button" className={styles.btn} onClick={copy}>
              {copied ? 'Copied' : 'Copy list'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
