import { useEffect } from 'react'
import Star from './Star'

export default function Splash({ done }: { done: () => void }) {
  useEffect(() => { const t = setTimeout(done, 2200); return () => clearTimeout(t) }, [])
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-night">
      <div className="text-center">
        <Star className="spin mx-auto h-28 w-28 text-gold" sw={1.2} />
        <h1 className="mt-6 text-3xl font-bold tracking-[.3em] text-gold">SANCHA</h1>
        <p className="mt-1 font-arabic text-xl text-emerald">بسم الله الرحمن الرحيم</p>
        <div className="mx-auto mt-8 h-1 w-40 overflow-hidden rounded bg-white/10"><div className="bar h-full bg-gradient-to-r from-emerald to-gold" /></div>
      </div>
    </div>
  )
}
