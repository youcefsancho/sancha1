import { useState } from 'react'
import { audio, meta, sleepIn, usePlayer } from '../lib/player'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2], SLEEP = [0, 15, 30, 60]

/** Global player: seek bar, skip 10s, speed, sleep timer, mute. Shown once something has been played. */
export default function MiniPlayer() {
  usePlayer()
  const [sl, setSl] = useState(0)
  if (!audio.src) return null
  const d = isFinite(audio.duration) ? audio.duration : 0
  const btn = 'tap rounded-full px-3 py-1 text-xs text-white/80'
  return (
    <div className="glass fixed inset-x-3 bottom-24 z-40 mx-auto max-w-xl p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0"><p className="truncate text-sm font-semibold">{meta.title}</p><p className="truncate text-xs text-white/50">{meta.sub}</p></div>
        <div className="flex items-center">
          <button className={btn} onClick={() => (audio.currentTime -= 10)}>-10s</button>
          <button className="tap grid h-10 w-10 place-items-center rounded-full bg-emerald text-night" onClick={() => (audio.paused ? audio.play() : audio.pause())}>{audio.paused ? '▶' : '❚❚'}</button>
          <button className={btn} onClick={() => (audio.currentTime += 10)}>+10s</button>
        </div>
      </div>
      <input type="range" className="mt-2 w-full accent-emerald" min={0} max={d} step={1} value={audio.currentTime} onChange={e => (audio.currentTime = +e.target.value)} />
      <div className="flex justify-between">
        <button className={btn} onClick={() => (audio.playbackRate = SPEEDS[(SPEEDS.indexOf(audio.playbackRate) + 1) % SPEEDS.length])}>{audio.playbackRate}x</button>
        <button className={btn} onClick={() => { const n = SLEEP[(SLEEP.indexOf(sl) + 1) % SLEEP.length]; setSl(n); sleepIn(n) }}>{sl ? `Sleep in ${sl} min` : 'Sleep timer off'}</button>
        <button className={btn} onClick={() => (audio.muted = !audio.muted)}>{audio.muted ? 'Unmute' : 'Mute'}</button>
      </div>
    </div>
  )
}
