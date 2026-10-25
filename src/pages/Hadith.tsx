import { useEffect, useState } from 'react'
import { COLLECTIONS, hadith } from '../lib/api'
import { useLocal } from '../hooks/useLocal'

type C = keyof typeof COLLECTIONS
const chip = (on: boolean) => `tap shrink-0 rounded-full px-4 py-1.5 text-sm ${on ? 'bg-emerald text-night' : 'glass text-white/70'}`

export default function Hadith() {
  const [c, setC] = useState<C>('nawawi')
  const [book, setBook] = useState(1)
  const [data, setData] = useState<{ title: string; items: any[] }>()
  const [q, setQ] = useState('')
  const [favView, setFavView] = useState(false)
  const [err, setErr] = useState('')
  const [favs, setFavs] = useLocal<any[]>('sancha.hadithfavs', [])

  useEffect(() => {
    setData(undefined); setErr('')
    hadith(c, c === 'nawawi' ? 0 : book).then(setData).catch(() => setErr('Could not load this collection. Check your connection.'))
  }, [c, book])

  const key = (h: any) => h.id ?? `${c}:${h.hadithnumber}`
  const items = (favView ? favs : data?.items ?? []).filter(h => h.text.toLowerCase().includes(q.toLowerCase())).slice(0, 80)
  const toggleFav = (h: any) => setFavs(f => (f.some(x => x.id === key(h)) ? f.filter(x => x.id !== key(h)) : [...f, { ...h, id: key(h), c: h.c ?? c }]))
  const share = (h: any) => { const t = `${h.text}\n(${h.c ?? c} ${h.hadithnumber}) via SANCHA`; navigator.share ? navigator.share({ text: t }).catch(() => {}) : navigator.clipboard?.writeText(t) }

  return (
    <div>
      <h2 className="text-2xl font-bold">Hadith</h2>
      <div className="mt-4 flex gap-2 overflow-x-auto">
        {(Object.keys(COLLECTIONS) as C[]).map(k => <button key={k} className={chip(!favView && c === k)} onClick={() => { setFavView(false); setC(k); setBook(1) }}>{k === 'nawawi' ? '40 Nawawi' : `Sahih ${k[0].toUpperCase() + k.slice(1)}`}</button>)}
        <button className={chip(favView)} onClick={() => setFavView(!favView)}>Favorites</button>
      </div>
      {!favView && COLLECTIONS[c].books > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">{Array.from({ length: COLLECTIONS[c].books }, (_, i) => i + 1).map(n => <button key={n} className={chip(book === n)} onClick={() => setBook(n)}>Book {n}</button>)}</div>
      )}
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by keyword" className="glass mt-3 w-full bg-transparent px-4 py-3 outline-none placeholder:text-white/40" />
      {!favView && data && <p className="mt-3 text-sm text-gold">{data.title}</p>}
      {err && <p className="mt-3 text-sm text-gold">{err}</p>}
      {favView && !favs.length && <p className="mt-6 text-center text-white/50">Tap Save on a hadith to keep it here.</p>}
      {items.map(h => (
        <article key={key(h)} className="glass mt-3 p-4">
          <p className="leading-relaxed text-white/90">{h.text}</p>
          <div className="mt-3 flex items-center justify-between text-sm text-gold">
            <span>{h.c ?? c} {h.hadithnumber}</span>
            <span><button className="tap rounded-full px-3 py-1" onClick={() => toggleFav(h)}>{favs.some(x => x.id === key(h)) ? 'Saved' : 'Save'}</button><button className="tap rounded-full px-3 py-1" onClick={() => share(h)}>Share</button></span>
          </div>
        </article>
      ))}
      {!data && !err && !favView && <p className="mt-6 text-center text-white/50">Loading…</p>}
    </div>
  )
}
