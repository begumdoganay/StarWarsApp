import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FavoritesContext } from '../App'
import '../styles/VesselCard.css'

const VesselCard = ({ vessel }) => {
  const { favorites, addToFavorites, removeFromFavorites } = useContext(FavoritesContext)
  
  const isFavorite = favorites.some(fav => fav.url === vessel.url)
  
  const handleFavoriteClick = (e) => {
    e.preventDefault() // Prevent navigating to detail page
    if (isFavorite) {
      removeFromFavorites(vessel.url)
    } else {
      addToFavorites(vessel)
    }
  }
  
  // Function to determine vessel class based on length
  const getVesselClass = (length) => {
    const lengthNum = parseFloat(length)
    if (isNaN(lengthNum) || length === 'unknown') return 'unknown'
    if (lengthNum < 50) return 'small'
    if (lengthNum < 300) return 'medium'
    if (lengthNum < 1000) return 'large'
    return 'capital'
  }
  
  const vesselClass = getVesselClass(vessel.length)
  
  return (
    <Link to={`/vessel/${vessel.id}`} className="vessel-card-link">
      <div className={`vessel-card vessel-class-${vesselClass}`}>
        <div className="vessel-card-header">
          <h2 className="vessel-name">{vessel.name}</h2>
          <button 
            className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
        
        <div className="vessel-icon">
          {vesselClass === 'small' && '🛸'}
          {vesselClass === 'medium' && '🚀'}
          {vesselClass === 'large' && '🛰️'}
          {vesselClass === 'capital' && '🌌'}
          {vesselClass === 'unknown' && '❓'}
        </div>
        
        <div className="vessel-specs">
          <p className="vessel-model">
            <span className="spec-label">Model:</span> {vessel.model}
          </p>
          <p className="vessel-speed">
            <span className="spec-label">Speed:</span> {vessel.max_atmosphering_speed}
          </p>
          <p className="vessel-manufacturer">
            <span className="spec-label">Manufacturer:</span> 
            <span className="manufacturer-text">
              {vessel.manufacturer.length > 30
                ? vessel.manufacturer.substring(0, 30) + '...'
                : vessel.manufacturer}
            </span>
          </p>
        </div>
        
        <div className="vessel-card-footer">
          <span className="vessel-class-badge">
            {vesselClass.charAt(0).toUpperCase() + vesselClass.slice(1)} Class
          </span>
          <span className="view-details">View Details →</span>
        </div>
      </div>
    </Link>
  )
}

export default VesselCard