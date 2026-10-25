import { useEffect, useState } from 'react'
import { videos, YT_KEY } from '../lib/api'
import { useLocal } from '../hooks/useLocal'

type V = { id: string; title: string; thumb: string }
// Category -> [search query, shorts only?]
const CATS: Record<string, [string, boolean]> = { 'Quran recitation': ['quran recitation', false], Lectures: ['islamic lecture', false], Kids: ['islamic stories for kids', false], Shorts: ['islamic reminder', true] }

export default function Videos() {
  const [cat, setCat] = useState('Lectures')
  const [list, setList] = useState<V[]>([])
  const [now, setNow] = useState<V | null>(null)
  const [err, setErr] = useState('')
  const [later, setLater] = useLocal<V[]>('sancha.later', [])

  useEffect(() => {
    if (cat === 'Watch later') return
    if (!YT_KEY) return setErr('Add your YouTube key as VITE_YT_KEY in .env to load videos.')
    setErr(''); setList([])
    videos(...CATS[cat]).then(r => setList(r.map(i => ({ id: i.id.videoId, title: i.snippet.title, thumb: i.snippet.thumbnails.medium.url })))).catch(() => setErr('Could not load videos. The API key or quota may be the problem.'))
  }, [cat])

  const shown = cat === 'Watch later' ? later : list
  const saved = (v: V) => later.some(x => x.id === v.id)
  return (
    <div>
      <h2 className="text-2xl font-bold">Videos</h2>
      {now && (
        <div className="mt-4">
          <iframe title={now.title} src={`https://www.youtube-nocookie.com/embed/${now.id}?autoplay=1`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="aspect-video w-full rounded-2xl" />
          <div className="mt-2 flex items-center justify-between gap-2"><p className="line-clamp-2 text-sm font-semibold">{now.title}</p><button className="tap shrink-0 rounded-full px-3 py-1 text-sm text-gold" onClick={() => setLater(l => (saved(now) ? l.filter(x => x.id !== now.id) : [...l, now]))}>{saved(now) ? 'Saved' : 'Watch later'}</button></div>
        </div>
      )}
      <div className="mt-4 flex gap-2 overflow-x-auto">{[...Object.keys(CATS), 'Watch later'].map(k => <button key={k} className={`tap shrink-0 rounded-full px-4 py-1.5 text-sm ${cat === k ? 'bg-emerald text-night' : 'glass text-white/70'}`} onClick={() => { setErr(''); setCat(k) }}>{k}</button>)}</div>
      {err && cat !== 'Watch later' && <p className="mt-3 text-sm text-gold">{err}</p>}
      {cat === 'Watch later' && !later.length && <p className="mt-6 text-center text-white/50">Open a video and tap Watch later to keep it here.</p>}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {shown.map(v => <button key={v.id} className="glass tap p-2 text-left" onClick={() => { setNow(v); scrollTo({ top: 0, behavior: 'smooth' }) }}><img src={v.thumb} alt="" className="aspect-video w-full rounded-xl object-cover" /><p className="mt-2 line-clamp-2 text-xs">{v.title}</p></button>)}
      </div>
    </div>
  )
}
