import { useEffect, useState } from 'react'

/** useState that persists to localStorage (bookmarks, last read, favorites, watch later). */
export function useLocal<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? (JSON.parse(s) as T) : init } catch { return init }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage full or blocked */ } }, [key, v])
  return [v, setV] as const
}
