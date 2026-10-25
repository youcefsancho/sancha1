import { NavLink } from 'react-router-dom'

// [path, label, 24px icon path]
const TABS: [string, string, string][] = [
  ['/', 'Home', 'M3 11l9-8 9 8v10h-6v-6H9v6H3z'],
  ['/quran', 'Quran', 'M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z'],
  ['/hadith', 'Hadith', 'M5 4h14v16H5zM9 9h6M9 13h6'],
  ['/podcasts', 'Podcasts', 'M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM6 11a6 6 0 0012 0M12 17v4'],
  ['/videos', 'Videos', 'M4 5h16v14H4zM10 9l5 3-5 3z'],
]

export default function BottomNav() {
  return (
    <nav className="glass fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-xl justify-around rounded-3xl p-1.5 pb-[max(.375rem,env(safe-area-inset-bottom))]">
      {TABS.map(([to, label, d]) => (
        <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `tap flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-xs transition ${isActive ? 'bg-emerald/15 text-emerald' : 'text-white/50'}`}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
