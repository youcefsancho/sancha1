import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Quran from '../pages/Quran'
import Hadith from '../pages/Hadith'
import Podcasts from '../pages/Podcasts'
import Videos from '../pages/Videos'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quran" element={<Quran />} />
      <Route path="/hadith" element={<Hadith />} />
      <Route path="/podcasts" element={<Podcasts />} />
      <Route path="/videos" element={<Videos />} />
    </Routes>
  )
}
