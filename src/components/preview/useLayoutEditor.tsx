'use client'

import type { IParallax } from '@react-spring/parallax'
import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { saveLayout, type LayoutChange } from '@/actions/layout'
import type { CollageItem } from '@/lib/datocms/queries'
import { LIMITS, clamp, dwToWidth, dxToXPosition, dyToYOffset, moveTile, n } from '@/lib/layout/math'
import styles from './LayoutEditor.module.css'

type Field = 'xPosition' | 'width' | 'yOffset' | 'speed'
type Fields = Partial<Record<Field, number>>
type Draft = Record<string, Fields>

const SNAKE: Record<Field, keyof LayoutChange['fields']> = {
  xPosition: 'x_position',
  width: 'width',
  yOffset: 'y_offset',
  speed: 'speed',
}
const widthOf = (w: number | null | undefined) => (!w ? 100 : w)

type Gesture = {
  id: string
  index: number
  mode: 'move' | 'resize'
  startX: number
  startY: number
  itemW: number
  centerX: number
  x0: number
  w0: number
  shift: boolean
}

/** Drops fields equal to the record's current value, and records left with no changes. */
function normalize(draft: Draft, items: CollageItem[]): Draft {
  const byId = new Map(items.map((it) => [it.id, it]))
  const out: Draft = {}
  for (const [id, fields] of Object.entries(draft)) {
    const it = byId.get(id)
    if (!it) continue
    const kept: Fields = {}
    for (const [k, v] of Object.entries(fields) as [Field, number][]) {
      const current = k === 'width' ? widthOf(it.width) : n(it[k])
      if (v !== current) kept[k] = v
    }
    if (Object.keys(kept).length) out[id] = kept
  }
  return out
}

/**
 * Layout mode for the desktop collage (plan phase 7): drag to move, drag the right edge to resize,
 * arrows to nudge, speed stepper, undo/redo, then "Save as draft" through the CMA.
 */
export function useLayoutEditor(items: CollageItem[], active: boolean, parallaxRef: React.RefObject<IParallax | null>) {
  const [draft, setDraft] = useState<Draft>({})
  const [past, setPast] = useState<Draft[]>([])
  const [future, setFuture] = useState<Draft[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [drag, setDrag] = useState<{ id: string; dx: number; dy: number; width?: number } | null>(null)
  const [guide, setGuide] = useState(false)
  const [conflicts, setConflicts] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState<string[]>([]) // saved, waiting for realtime to catch up
  const base = useRef<Record<string, string>>({}) // id → _updatedAt when first edited
  const gesture = useRef<Gesture | null>(null)

  // drop overrides once realtime delivers matching values (e.g. right after a save)
  useEffect(() => {
    setDraft((d) => {
      const next = normalize(d, items)
      for (const id of Object.keys(base.current)) if (!next[id]) delete base.current[id]
      return Object.keys(next).length === Object.keys(d).length ? d : next
    })
  }, [items])

  const displayed = useMemo(() => items.map((it) => (draft[it.id] ? { ...it, ...draft[it.id] } : it)), [items, draft])
  const pending = Object.keys(draft).filter((id) => !saved.includes(id)).length

  const commit = useCallback(
    (update: (d: Draft) => Draft, touched: string[] = []) => {
      const next = normalize(update(draft), items)
      for (const id of Object.keys(next)) {
        if (!base.current[id]) base.current[id] = items.find((it) => it.id === id)!._updatedAt
      }
      setPast((p) => [...p.slice(-99), draft])
      setFuture([])
      setDraft(next)
      if (touched.length) setSaved((s) => s.filter((id) => !touched.includes(id)))
    },
    [draft, items]
  )

  const setFields = useCallback(
    (changes: Record<string, Fields>) =>
      commit((d) => {
        const next = { ...d }
        for (const [id, f] of Object.entries(changes)) next[id] = { ...next[id], ...f }
        return next
      }, Object.keys(changes)),
    [commit]
  )

  const moveY = useCallback(
    (index: number, units: number, push: boolean) => {
      if (index === 0 || units === 0) return
      const ys = moveTile(
        displayed.map((it) => it.yOffset),
        index,
        units,
        push
      )
      const changes: Record<string, Fields> = {}
      ys.forEach((y, j) => {
        if (y !== n(displayed[j].yOffset)) changes[displayed[j].id] = { yOffset: y }
      })
      setFields(changes)
    },
    [displayed, setFields]
  )

  const undo = useCallback(() => {
    if (!past.length) return
    setFuture([draft, ...future])
    setPast(past.slice(0, -1))
    setDraft(past[past.length - 1])
    setSaved([])
  }, [past, future, draft])
  const redo = useCallback(() => {
    if (!future.length) return
    setPast([...past, draft])
    setFuture(future.slice(1))
    setDraft(future[0])
    setSaved([])
  }, [past, future, draft])

  // keyboard: arrows nudge (Shift = 10), Cmd/Ctrl+Z undo, Shift+Cmd/Ctrl+Z redo, Esc deselects
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
        return
      }
      if (e.key === 'Escape') return setSelected(null)
      if (!selected) return
      const i = displayed.findIndex((it) => it.id === selected)
      if (i < 0) return
      const step = e.shiftKey ? 10 : 1
      const it = displayed[i]
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const x = clamp(n(it.xPosition) + (e.key === 'ArrowLeft' ? -step : step), ...LIMITS.xPosition)
        setFields({ [it.id]: { xPosition: x } })
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        moveY(i, e.key === 'ArrowUp' ? -step : step, false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, selected, displayed, setFields, moveY, undo, redo])

  // warn before leaving with unsaved layout changes
  useEffect(() => {
    if (!pending) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [pending])

  const viewportH = () => parallaxRef.current?.space || window.innerHeight

  function onPointerDown(e: React.PointerEvent<HTMLSpanElement>, it: CollageItem, index: number) {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const itemW = (el.parentElement as HTMLElement).clientWidth
    const resize = !!(e.target as HTMLElement).closest('[data-layout-handle]')
    setSelected(it.id)
    el.setPointerCapture(e.pointerId)
    gesture.current = {
      id: it.id,
      index,
      mode: resize ? 'resize' : 'move',
      startX: e.clientX,
      startY: e.clientY,
      itemW,
      centerX: rect.left + rect.width / 2,
      x0: n(it.xPosition),
      w0: widthOf(it.width),
      shift: e.shiftKey,
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLSpanElement>) {
    const g = gesture.current
    if (!g) return
    const dx = e.clientX - g.startX
    const dy = g.index === 0 ? 0 : e.clientY - g.startY
    if (g.mode === 'resize') {
      setDrag({ id: g.id, dx: 0, dy: 0, width: dwToWidth(g.w0, dx, g.itemW) })
    } else {
      setDrag({ id: g.id, dx, dy })
      setGuide(Math.abs(g.centerX + dx - window.innerWidth / 2) < 6)
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLSpanElement>) {
    const g = gesture.current
    gesture.current = null
    setDrag(null)
    setGuide(false)
    if (!g) return
    const dx = e.clientX - g.startX
    const dy = g.index === 0 ? 0 : e.clientY - g.startY
    if (g.mode === 'resize') {
      if (dx) setFields({ [g.id]: { width: dwToWidth(g.w0, dx, g.itemW) } })
      return
    }
    const x = dxToXPosition(g.x0, dx, g.itemW)
    const units = dyToYOffset(dy, viewportH())
    if (x !== g.x0 && units === 0) setFields({ [g.id]: { xPosition: x } })
    else if (units !== 0) {
      const ys = moveTile(
        displayed.map((it) => it.yOffset),
        g.index,
        units,
        g.shift || e.shiftKey
      )
      const changes: Record<string, Fields> = {}
      ys.forEach((y, j) => {
        if (y !== n(displayed[j].yOffset)) changes[displayed[j].id] = { yOffset: y }
      })
      if (x !== g.x0) changes[g.id] = { ...changes[g.id], xPosition: x }
      setFields(changes)
    }
  }

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const changes: LayoutChange[] = Object.entries(draft).map(([id, f]) => ({
        id,
        baseUpdatedAt: base.current[id] ?? items.find((it) => it.id === id)!._updatedAt,
        fields: Object.fromEntries(Object.entries(f).map(([k, v]) => [SNAKE[k as Field], v])),
      }))
      const results = await saveLayout(changes)
      const nextConflicts: Record<string, string> = {}
      for (const r of results) {
        if (r.status === 'conflict') nextConflicts[r.id] = 'Changed elsewhere — reload tile values'
        if (r.status === 'error') nextConflicts[r.id] = r.message ?? 'Could not save'
      }
      setConflicts(nextConflicts)
      setSaved(results.filter((r) => r.status === 'saved').map((r) => r.id))
      // saved overrides stay applied until realtime brings the same values (no flicker)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const discard = () => {
    commit(() => ({}))
    setConflicts({})
    setSaved([])
  }
  const reloadTile = (id: string) => {
    commit((d) => {
      const next = { ...d }
      delete next[id]
      return next
    })
    delete base.current[id]
    setConflicts((c) => Object.fromEntries(Object.entries(c).filter(([k]) => k !== id)))
  }

  const tileProps = (it: CollageItem, index: number) => {
    const d = drag?.id === it.id ? drag : null
    return {
      className: clsx(
        styles.editable,
        index === 0 && styles.pinned,
        selected === it.id && styles.selected,
        d && styles.dragging,
        conflicts[it.id] && styles.conflict
      ),
      style: {
        ...(d ? { transform: `translate(${d.dx}px, ${d.dy}px)` } : {}),
        ...(d?.width ? { ['--max-width' as string]: `${d.width}%` } : {}),
      } as React.CSSProperties,
      title: index === 0 ? 'First tile is pinned to the top (horizontal only)' : undefined,
      onPointerDown: (e: React.PointerEvent<HTMLSpanElement>) => onPointerDown(e, it, index),
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture: (e: React.MouseEvent) => e.preventDefault(),
    }
  }

  const tileChrome = (it: CollageItem, index: number) => {
    const d = drag?.id === it.id ? drag : null
    return (
      <>
        {(selected === it.id || conflicts[it.id]) && (
          <span className={styles.chip} onPointerDown={(e) => e.stopPropagation()}>
            x {n(it.xPosition)} · w {d?.width ?? widthOf(it.width)} · y {n(it.yOffset) > 0 ? '+' : ''}
            {n(it.yOffset)} · speed
            <button
              title="Speed −5"
              onClick={() => setFields({ [it.id]: { speed: clamp(n(it.speed) - 5, ...LIMITS.speed) } })}
            >
              −
            </button>
            {n(it.speed)}
            <button
              title="Speed +5"
              onClick={() => setFields({ [it.id]: { speed: clamp(n(it.speed) + 5, ...LIMITS.speed) } })}
            >
              +
            </button>
            {index === 0 && <span className={styles.warn}>pinned</span>}
            {conflicts[it.id] && (
              <>
                <span className={styles.warn}>{conflicts[it.id]}</span>
                <button style={{ width: 'auto', padding: '0 4px' }} onClick={() => reloadTile(it.id)}>
                  reload
                </button>
              </>
            )}
          </span>
        )}
        <span className={styles.handle} data-layout-handle title="Drag to change width" />
      </>
    )
  }

  const overlay = (
    <>
      {guide && <span className={styles.guide} />}
      {pending > 0 && (
        <div className={styles.savebar} data-layout-savebar>
          <span>
            {pending} unsaved change{pending === 1 ? '' : 's'}
            {error && <span className={styles.hint}> · {error}</span>}
            {!error && <span className={styles.hint}> · Shift-drag pushes tiles below · ⌘Z undo</span>}
          </span>
          <button className="secondary" onClick={discard} disabled={saving}>
            Discard
          </button>
          <button onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save as draft'}
          </button>
        </div>
      )}
    </>
  )

  return { items: displayed, tileProps, tileChrome, overlay, pending }
}
