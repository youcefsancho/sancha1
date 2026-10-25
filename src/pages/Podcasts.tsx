import { useEffect, useState } from 'react'
import { episodes, shows } from '../lib/api'
import { play } from '../lib/player'

// Category -> iTunes search terms. "Featured" mixes the shows you named.
const CATS: Record<string, string[]> = {
  Featured: ['Yaqeen Institute', 'Bayyinah', 'Mufti Menk', 'Omar Suleiman'],
  Tafsir: ['quran tafsir podcast'], Seerah: ['seerah podcast'], Family: ['muslim family podcast'], Motivation: ['islamic motivation podcast'],
}

export default function Podcasts() {
  const [cat, setCat] = useState('Featured')
  const [list, setList] = useState<any[]>([])
  const [show, setShow] = useState<any>()
  const [eps, setEps] = useState<any[]>([])
  const [err, setErr] = useState('')

  useEffect(() => {
    setErr('')
    const terms = CATS[cat]
    Promise.all(terms.map(t => shows(t, terms.length > 1 ? 2 : 8)))
      .then(r => setList(r.flat().filter((s, i, a) => s.feedUrl && a.findIndex(x => x.collectionId === s.collectionId) === i)))
      .catch(() => setErr('Could not load podcasts. Check your connection.'))
  }, [cat])

  const pick = (s: any) => { setShow(s); setEps([]); episodes(s.feedUrl).then(setEps).catch(() => setErr('This feed could not be loaded.')) }

  if (show) return (
    <div>
      <button className="tap rounded-full px-3 py-1 text-gold" onClick={() => setShow(undefined)}>Back</button>
      <div className="mt-3 flex items-center gap-4"><img src={show.artworkUrl600} alt="" className="h-20 w-20 rounded-2xl" /><div><h2 className="font-bold">{show.collectionName}</h2><p className="text-sm text-white/60">{show.artistName}</p></div></div>
      {err && <p className="mt-3 text-sm text-gold">{err}</p>}
      {eps.map(e => <button key={e.guid ?? e.title} className="glass tap mt-2 block w-full p-3 text-left" onClick={() => play(e.enclosure.link, e.title, show.collectionName)}><span className="line-clamp-2 text-sm font-semibold">{e.title}</span><span className="text-xs text-white/50">{String(e.pubDate).slice(0, 10)}</span></button>)}
      {!eps.length && !err && <p className="mt-6 text-center text-white/50">Loading episodes…</p>}
    </div>
  )

  return (
    <div>
      <h2 className="text-2xl font-bold">Podcasts</h2>
      <div className="mt-4 flex gap-2 overflow-x-auto">{Object.keys(CATS).map(k => <button key={k} className={`tap shrink-0 rounded-full px-4 py-1.5 text-sm ${cat === k ? 'bg-emerald text-night' : 'glass text-white/70'}`} onClick={() => setCat(k)}>{k}</button>)}</div>
      {err && <p className="mt-3 text-sm text-gold">{err}</p>}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {list.map(s => <button key={s.collectionId} className="glass tap p-3 text-left" onClick={() => pick(s)}><img src={s.artworkUrl600} alt="" className="aspect-square w-full rounded-xl object-cover" /><p className="mt-2 line-clamp-2 text-sm font-semibold">{s.collectionName}</p><p className="truncate text-xs text-white/50">{s.artistName}</p></button>)}
      </div>
    </div>
  )
}
