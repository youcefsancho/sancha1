import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { hadithOfDay, prayerTimes, qibla } from '../lib/api'
import { useLocal } from '../hooks/useLocal'
import Star from '../components/Star'

const NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
const mins = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

export default function Home() {
  const [times, setTimes] = useState<Record<string, string>>()
  const [deg, setDeg] = useState<number>()
  const [h, setH] = useState<any>()
  const [y, setY] = useState(0)
  const [last] = useLocal<any>('sancha.last', null)

  useEffect(() => {
    hadithOfDay().then(setH).catch(() => {})
    navigator.geolocation?.getCurrentPosition(p => {
      const { latitude: la, longitude: lo } = p.coords
      prayerTimes(la, lo).then(setTimes).catch(() => {})
      qibla(la, lo).then(setDeg).catch(() => {})
    })
    const f = () => setY(window.scrollY) // parallax
    addEventListener('scroll', f)
    return () => removeEventListener('scroll', f)
  }, [])

  const now = new Date(), cur = now.getHours() * 60 + now.getMinutes()
  const next = times && (NAMES.find(n => mins(times[n]) > cur) ?? 'Fajr')

  return (
    <div className="space-y-4">
      <section className="relative -mx-4 -mt-6 overflow-hidden px-6 pb-10 pt-16">
        <div className="absolute -right-24 -top-10" style={{ transform: `translateY(${y * 0.25}px)` }}><Star className="spin h-96 w-96 text-gold/25" /></div>
        <div className="relative">
          <p className="text-sm text-white/60">As-salamu alaykum</p>
          {times && next ? (
            <>
              <p className="mt-3 text-white/60">Next prayer</p>
              <p className="text-5xl font-bold">{next}</p>
              <p className="text-2xl text-gold">{times[next].slice(0, 5)}</p>
            </>
          ) : <p className="mt-3 max-w-xs text-lg">Allow location to see today's prayer times and the Qibla.</p>}
        </div>
      </section>

      {times && (
        <div className="glass grid grid-cols-5 p-3 text-center text-xs">
          {NAMES.map(n => <div key={n} className={n === next ? 'text-emerald' : 'text-white/60'}><p>{n}</p><p className="mt-1 font-semibold">{times[n].slice(0, 5)}</p></div>)}
        </div>
      )}

      {last && <Link to="/quran" className="glass tap block p-4"><p className="text-xs text-white/50">Continue reading</p><p className="font-semibold">{last.name}, verse {last.a}</p></Link>}

      {deg != null && (
        <div className="glass flex items-center gap-4 p-4">
          <div className="grid h-16 w-16 place-items-center rounded-full border border-gold/40"><div className="h-12 w-0.5 origin-center bg-gradient-to-b from-emerald to-transparent" style={{ transform: `rotate(${deg}deg)` }} /></div>
          <div><p className="font-semibold">Qibla</p><p className="text-sm text-white/60">{Math.round(deg)}° clockwise from true north</p></div>
        </div>
      )}

      {h && (
        <div className="glass p-5">
          <p className="text-xs text-violet">Hadith of the day</p>
          <p className="mt-2 line-clamp-6 leading-relaxed text-white/90">{h.text}</p>
          <p className="mt-3 text-sm text-gold">Nawawi {h.hadithnumber}</p>
        </div>
      )}
    </div>
  )
}
