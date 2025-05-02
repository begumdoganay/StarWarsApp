import { Routes, Route } from 'react-router-dom'
import { useState, createContext } from 'react'
import Header from './components/Header'
import VesselList from './components/VesselList'
import VesselDetail from './components/VesselDetail'
import CompareVessels from './components/CompareVessels'
import Favorites from './components/Favorites'
import NotFound from './components/NotFound'
import './styles/App.css'

// Create context for favorites functionality
export const FavoritesContext = createContext()

function App() {
  const [favorites, setFavorites] = useState([])

  const addToFavorites = (vessel) => {
    if (!favorites.some(fav => fav.url === vessel.url)) {
      setFavorites([...favorites, vessel])
    }
  }

  const removeFromFavorites = (vesselUrl) => {
    setFavorites(favorites.filter(vessel => vessel.url !== vesselUrl))
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<VesselList />} />
            <Route path="/vessel/:id" element={<VesselDetail />} />
            <Route path="/compare" element={<CompareVessels />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer>
          <p>Galactic Vessels Explorer &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </FavoritesContext.Provider>
  )
}

export default App