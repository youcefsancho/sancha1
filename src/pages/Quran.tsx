import { useEffect, useState } from 'react'
import { audioUrl, reciters, searchQuran, surah, surahs, tafsir } from '../lib/api'
import { play } from '../lib/player'
import { useLocal } from '../hooks/useLocal'

const LANGS: Record<string, string> = { 'en.sahih': 'English', 'fr.hamidullah': 'Français', 'es.cortes': 'Español', 'tr.diyanet': 'Türkçe', 'id.indonesian': 'Indonesia', 'ur.jalandhry': 'اردو' }
const sel = 'glass flex-1 bg-night px-3 py-2 outline-none'

export default function Quran() {
  const [list, setList] = useState<any[]>([])
  const [recs, setRecs] = useState<any[]>([])
  const [open, setOpen] = useState<number | null>(null)
  const [rows, setRows] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<any[]>([])
  const [tf, setTf] = useState<{ k: string; t: string } | null>(null)
  const [err, setErr] = useState('')
  const [lang, setLang] = useLocal('sancha.lang', 'en.sahih')
  const [rec, setRec] = useLocal('sancha.reciter', 'ar.alafasy')
  const [night, setNight] = useLocal('sancha.night', false)
  const [marks, setMarks] = useLocal<string[]>('sancha.marks', [])
  const [last, setLast] = useLocal<any>('sancha.last', null)

  useEffect(() => {
    surahs().then(setList).catch(() => setErr('Could not load the surah list. Check your connection.'))
    reciters().then(setRecs).catch(() => {})
  }, [])

  useEffect(() => {
    if (open == null) return
    setRows([]); setErr(''); setTf(null)
    surah(open, lang)
      .then(([ar, tl, tr]) => setRows(ar.ayahs.map((a: any, i: number) => ({ ...a, tl: tl.ayahs[i].text, tr: tr.ayahs[i].text }))))
      .catch(() => setErr('Could not load this surah. Check your connection.'))
  }, [open, lang])

  const find = () => (q.trim().length > 2 ? searchQuran(q.trim(), lang).then(setHits).catch(() => setErr('Search failed.')) : setHits([]))
  const listen = (a: any) => {
    const s = list[open! - 1]
    setLast({ n: open, name: s?.englishName, a: a.numberInSurah })
    play(audioUrl(rec, a.number), `${s?.englishName} ${a.numberInSurah}`, 'Quran')
  }
  const toggleTafsir = (a: any) => {
    const k = `${open}:${a.numberInSurah}`
    if (tf?.k === k) return setTf(null)
    setTf({ k, t: 'Loading…' })
    tafsir(open!, a.numberInSurah).then(t => setTf({ k, t })).catch(() => setTf({ k, t: 'Tafsir needs a connection.' }))
  }

  if (open == null) return (
    <div>
      <h2 className="text-2xl font-bold">Quran</h2>
      <input value={q} onChange={e => { setQ(e.target.value); setHits([]) }} onKeyDown={e => e.key === 'Enter' && find()} placeholder="Filter surahs, or press Enter to search verses" className="glass mt-4 w-full bg-transparent px-4 py-3 outline-none placeholder:text-white/40" />
      {err && <p className="mt-3 text-sm text-gold">{err}</p>}
      {last && <button className="glass tap mt-3 w-full p-3 text-left" onClick={() => setOpen(last.n)}><span className="text-xs text-white/50">Continue reading</span><br />{last.name}, verse {last.a}</button>}
      {marks.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{marks.map(m => <button key={m} className="glass tap px-3 py-1 text-sm text-gold" onClick={() => setOpen(+m.split(':')[0])}>{m}</button>)}</div>}
      {hits.map(h => <button key={h.number} className="glass tap mt-2 block w-full p-3 text-left text-sm" onClick={() => setOpen(h.surah.number)}><span className="text-gold">{h.surah.englishName} {h.numberInSurah}</span><br />{h.text}</button>)}
      {!hits.length && list.filter(s => (s.englishName + s.name).toLowerCase().includes(q.toLowerCase())).map(s => (
        <button key={s.number} className="glass tap mt-2 flex w-full items-center justify-between px-4 py-3 text-left" onClick={() => setOpen(s.number)}>
          <span><span className="block font-semibold">{s.number}. {s.englishName}</span><span className="text-xs text-white/50">{s.englishNameTranslation}, {s.numberOfAyahs} verses</span></span>
          <span className="font-arabic text-2xl text-gold">{s.name.replace('سورة ', '')}</span>
        </button>
      ))}
    </div>
  )

  return (
    <div className={night ? 'night -mx-4 -mt-6 min-h-screen bg-black px-4 pt-6' : ''}>
      <div className="flex items-center justify-between gap-2">
        <button className="tap rounded-full px-3 py-1 text-gold" onClick={() => setOpen(null)}>Back</button>
        <h2 className="font-bold">{list[open - 1]?.englishName}</h2>
        <button className="tap rounded-full px-3 py-1 text-sm" onClick={() => setNight(!night)}>{night ? 'Day' : 'Night'}</button>
      </div>
      <div className="mt-3 flex gap-2 text-sm">
        <select className={sel} value={lang} onChange={e => setLang(e.target.value)}>{Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select className={sel} value={rec} onChange={e => setRec(e.target.value)}>{recs.map(r => <option key={r.identifier} value={r.identifier}>{r.englishName}</option>)}</select>
      </div>
      {err && <p className="mt-3 text-sm text-gold">{err}</p>}
      {rows.map(a => {
        const k = `${open}:${a.numberInSurah}`
        return (
          <article key={a.number} className={`glass mt-3 p-4 ${last?.n === open && last?.a === a.numberInSurah ? 'ring-1 ring-gold/60' : ''}`}>
            <p dir="rtl" className="font-arabic text-3xl leading-[2.4]">{a.text}</p>
            <p className="mt-2 text-sm italic text-emerald/80">{a.tl}</p>
            <p className="mt-1 text-white/80">{a.tr}</p>
            <div className="mt-3 flex gap-1 text-sm text-gold">
              <button className="tap rounded-full px-3 py-1" onClick={() => listen(a)}>Play {a.numberInSurah}</button>
              <button className="tap rounded-full px-3 py-1" onClick={() => setMarks(m => (m.includes(k) ? m.filter(x => x !== k) : [...m, k]))}>{marks.includes(k) ? 'Saved' : 'Save'}</button>
              <button className="tap rounded-full px-3 py-1" onClick={() => toggleTafsir(a)}>Tafsir</button>
            </div>
            {tf?.k === k && <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-white/70">{tf.t}</p>}
          </article>
        )
      })}
      {!rows.length && !err && <p className="mt-6 text-center text-white/50">Loading…</p>}
    </div>
  )
}
