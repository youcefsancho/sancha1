import { useEffect, useState } from 'react'

// One shared <audio> element lives outside React, so playback continues while you navigate.
export const audio = new Audio()
export const meta = { title: '', sub: '' }
let timer: number | undefined

export function play(src: string, title: string, sub = '') {
  meta.title = title; meta.sub = sub; audio.src = src; audio.play().catch(() => {})
  if ('mediaSession' in navigator) navigator.mediaSession.metadata = new MediaMetadata({ title, artist: sub }) // lock-screen controls
}
/** Pause after `min` minutes (0 cancels). */
export function sleepIn(min: number) { clearTimeout(timer); if (min) timer = window.setTimeout(() => audio.pause(), min * 60000) }

/** Re-render the caller whenever the audio state changes. */
export function usePlayer() {
  const [, tick] = useState(0)
  useEffect(() => {
    const f = () => tick(n => n + 1), ev = ['timeupdate', 'play', 'pause', 'loadedmetadata', 'ratechange', 'volumechange']
    ev.forEach(e => audio.addEventListener(e, f))
    return () => ev.forEach(e => audio.removeEventListener(e, f))
  }, [])
}
