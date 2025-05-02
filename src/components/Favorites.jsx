import { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FavoritesContext } from '../App'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import '../styles/VesselDetail.css'

const VesselDetail = () => {
  const { id } = useParams()
  const [vessel, setVessel] = useState(null)
  const [pilots, setPilots] = useState([])
  const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { favorites, addToFavorites, removeFromFavorites } = useContext(FavoritesContext)
  const navigate = useNavigate()
  
  const isFavorite = vessel ? favorites.some(fav => fav.url === vessel.url) : false
  
  useEffect(() => {
    const fetchVesselDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://swapi.dev/api/starships/${id}/`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch vessel details')
        }
        
        const data = await response.json()
        setVessel(data)
        
        // Fetch pilots if available
        if (data.pilots.length > 0) {
          const pilotPromises = data.pilots.map(url => fetch(url).then(res => res.json()))
          const pilotData = await Promise.all(pilotPromises)
          setPilots(pilotData)
        }
        
        // Fetch films if available
        if (data.films.length > 0) {
          const filmPromises = data.films.map(url => fetch(url).then(res => res.json()))
          const filmData = await Promise.all(filmPromises)
          setFilms(filmData)
        }
        
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchVesselDetails()
  }, [id])
  
  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(vessel.url)
    } else {
      addToFavorites(vessel)
    }
  }
  
  const formatSpecValue = (value) => {
    return value === 'unknown' || value === 'n/a' ? 'Unknown' : value
  }
  
  const formatWithCommas = (value) => {
    if (value === 'unknown' || value === 'n/a') return 'Unknown'
    
    // Try to parse as number
    const num = parseInt(value.replace(/,/g, ''))
    if (isNaN(num)) return value
    
    // Format with commas
    return num.toLocaleString()
  }
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!vessel) return <ErrorMessage message="Vessel not found" />

  return (
    <div className="vessel-detail">
      <div className="vessel-detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        
        <button 
          className={`detail-favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
          onClick={handleFavoriteToggle}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          <span className="star-icon">{isFavorite ? '★' : '☆'}</span>
        </button>
      </div>
      
      <div className="vessel-profile">
        <h1 className="vessel-name">{vessel.name}</h1>
        <p className="vessel-model">{vessel.model}</p>
        
        <div className="vessel-class">
          <span className="vessel-class-label">Class:</span>
          <span className="vessel-class-value">{vessel.starship_class}</span>
        </div>
      </div>
      
      <div className="specs-section">
        <h2>Specifications</h2>
        
        <div className="specs-grid">
          <div className="spec-item">
            <span className="spec-label">Manufacturer</span>
            <span className="spec-value">{formatSpecValue(vessel.manufacturer)}</span>
          </div>
          
          <div className="spec-item">
            <span className="spec-label">Cost</span>
            <span className="spec-value">
              {vessel.cost_in_credits !== 'unknown' ? 
                `${formatWithCommas(vessel.cost_in_credits)} credits` : 
                'Unknown'}
            </span>
          </div>
          
          <div className="spec-item">
            <span className="spec-label">Length</span>
            <span className="spec-value">
              {vessel.length !== 'unknown' ? `${formatWithCommas(vessel.length)} m` : 'Unknown'}
            </span>
          </div>
          
          <div className="spec-item">
            <span className="spec-label">Max Speed</span>
            <span className="spec-value">
              {vessel.max_atmosphering_speed !== 'unknown' ? 
                `${formatWithCommas(vessel.max_atmosphering_speed)} km/h` : 
                'Unknown'}
            </span>
          </div>
          
          <div className="spec-item">
            <span className="spec-label">Hyperdrive Rating</span>
            <span className="spec-value">{formatSpecValue(vessel.hyperdrive_rating)}</span>
          </div>
          
          <div className="spec-item">
            <span className="spec-label">MGLT</span>
            <span className="spec-value">{formatSpecValue(vessel.MGLT)}</span>
          </div>
        </div>
      </div>
      
      <div className="capacity-section">
        <h2>Capacity & Crew</h2>
        
        <div className="specs-grid">
          <div className="spec-item">
            <span className="spec-label">Crew</span>
            <span className="spec-value">{formatWithCommas(vessel.crew)}</span>
          </div>
          
          <div className="spec-item">
            <span className="spec-label">Passengers</span>
            <span className="spec-value">{formatWithCommas(vessel.passengers)}</span>
          </div>
          
          <div className="spec-item">
            <span className="spec-label">Cargo Capacity</span>
            <span className="spec-value">
              {vessel.cargo_capacity !== 'unknown' ? 
                `${formatWithCommas(vessel.cargo_capacity)} kg` : 
                'Unknown'}
            </span>
          </div>
          
          <div className="spec-item">
            <span className="spec-label">Consumables</span>
            <span className="spec-value">{formatSpecValue(vessel.consumables)}</span>
          </div>
        </div>
      </div>
      
      {pilots.length > 0 && (
        <div className="pilots-section">
          <h2>Known Pilots</h2>
          <ul className="pilots-list">
            {pilots.map(pilot => (
              <li key={pilot.url} className="pilot-item">
                <span className="pilot-icon">👨‍✈️</span>
                <span className="pilot-name">{pilot.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {films.length > 0 && (
        <div className="films-section">
          <h2>Appeared In</h2>
          <ul className="films-list">
            {films.map(film => (
              <li key={film.url} className="film-item">
                <span className="film-icon">🎬</span>
                <span className="film-title">{film.title}</span>
                <span className="film-year">({new Date(film.release_date).getFullYear()})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="action-buttons">
        <Link to="/compare" state={{ vessel }} className="compare-button">
          Compare With Other Vessels
        </Link>
      </div>
    </div>
  )
}

export default VesselDetail