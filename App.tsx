import { useEffect, useState } from 'react'
import AppRoutes from './routes'
import Splash from './components/Splash'
import BottomNav from './components/BottomNav'
import MiniPlayer from './components/MiniPlayer'

export default function App() {
  const [ready, setReady] = useState(false)
  // Touch ripple + tiny haptic tick on anything marked .tap
  useEffect(() => {
    const f = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest('.tap') as HTMLElement | null
      if (!el) return
      const r = el.getBoundingClientRect(), s = document.createElement('span')
      s.className = 'ripple'; s.style.left = e.clientX - r.left + 'px'; s.style.top = e.clientY - r.top + 'px'
      el.appendChild(s); setTimeout(() => s.remove(), 600); navigator.vibrate?.(8)
    }
    document.addEventListener('pointerdown', f)
    return () => document.removeEventListener('pointerdown', f)
  }, [])
  return (
    <>
      {!ready && <Splash done={() => setReady(true)} />}
      <main className="mx-auto max-w-xl px-4 pb-56 pt-6"><AppRoutes /></main>
      <MiniPlayer />
      <BottomNav />
    </>
  )
}
