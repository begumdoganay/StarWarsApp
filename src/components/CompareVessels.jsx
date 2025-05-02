import { useState, useEffect, useContext } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { FavoritesContext } from '../App'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import '../styles/CompareVessels.css'

const CompareVessels = () => {
  const location = useLocation()
  const { favorites } = useContext(FavoritesContext)
  const [selectedVessels, setSelectedVessels] = useState([])
  const [availableVessels, setAvailableVessels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Initial setup based on navigation state
  useEffect(() => {
    const initialSetup = async () => {
      try {
        setLoading(true)
        
        // If we came from a vessel detail page with a specific vessel
        if (location.state?.vessel) {
          setSelectedVessels([location.state.vessel])
        }
        // If we came from favorites with multiple vessels
        else if (location.state?.vessels) {
          // Limit to maximum 3 vessels for comparison
          setSelectedVessels(location.state.vessels.slice(0, 3))
        }
        
        // Use favorites as available vessels
        if (favorites.length > 0) {
          setAvailableVessels(favorites.filter(
            fav => !selectedVessels.some(selected => selected.url === fav.url)
          ))
        } else {
          // Fetch some vessels if no favorites
          const response = await fetch('https://swapi.dev/api/starships/?page=1')
          if (!response.ok) throw new Error('Failed to fetch vessels')
          
          const data = await response.json()
          const vesselsWithIds = data.results.map(vessel => ({
            ...vessel,
            id: getVesselId(vessel.url)
          }))
          
          setAvailableVessels(vesselsWithIds.filter(
            vessel => !selectedVessels.some(selected => selected.url === vessel.url)
          ))
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    initialSetup()
  }, [location.state, favorites])
  
  // Extract vessel ID from URL
  const getVesselId = (url) => {
    const parts = url.split('/')
    return parts[parts.length - 2]
  }
  
  const addVesselToComparison = (vessel) => {
    if (selectedVessels.length < 3) {
      setSelectedVessels([...selectedVessels, vessel])
      setAvailableVessels(availableVessels.filter(v => v.url !== vessel.url))
    }
  }
  
  const removeVesselFromComparison = (vessel) => {
    setSelectedVessels(selectedVessels.filter(v => v.url !== vessel.url))
    setAvailableVessels([...availableVessels, vessel])
  }
  
  // Format values for comparison
  const formatValue = (value, unit = '') => {
    if (value === 'unknown' || value === 'n/a') return 'Unknown'
    
    // Try to parse as number for comparison
    const num = parseFloat(value.replace(/,/g, ''))
    if (!isNaN(num)) {
      return `${num.toLocaleString()}${unit ? ` ${unit}` : ''}`
    }
    
    return value
  }
  
  // Helper to determine the "best" value for a spec
  const getBestValueClass = (values, spec) => {
    // Skip if we don't have enough vessels to compare
    if (values.length < 2) return {}
    
    const numericValues = values
      .map(v => parseFloat(v.replace(/,/g, '')))
      .filter(v => !isNaN(v))
    
    if (numericValues.length < 2) return {}
    
    // For these specs, higher is better
    const higherIsBetter = [
      'hyperdrive_rating', 'MGLT', 'cargo_capacity', 
      'passengers', 'length'
    ]
    
    // For these specs, lower is better
    const lowerIsBetter = ['cost_in_credits', 'crew']
    
    // Determine best value
    let bestValue
    if (higherIsBetter.includes(spec)) {
      bestValue = Math.max(...numericValues)
    } else if (lowerIsBetter.includes(spec)) {
      bestValue = Math.min(...numericValues)
    } else {
      return {}
    }
    
    // Return classes for each value
    return numericValues.reduce((acc, val, index) => {
      if (val === bestValue) {
        acc[index] = 'best-value'
      }
      return acc
    }, {})
  }
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  
  return (
    <div className="compare-container">
      <h1>Compare Vessels</h1>
      
      <div className="comparison-selection">
        <div className="selected-vessels">
          <h2>Selected for Comparison ({selectedVessels.length}/3)</h2>
          
          {selectedVessels.length === 0 ? (
            <p className="no-selection">Select vessels to compare</p>
          ) : (
            <div className="selected-vessels-list">
              {selectedVessels.map(vessel => (
                <div key={vessel.url} className="selected-vessel-item">
                  <div className="vessel-info">
                    <h3>{vessel.name}</h3>
                    <p>{vessel.model}</p>
                  </div>
                  <button 
                    className="remove-vessel-btn"
                    onClick={() => removeVesselFromComparison(vessel)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {selectedVessels.length < 3 && (
          <div className="available-vessels">
            <h2>Available Vessels</h2>
            
            {availableVessels.length === 0 ? (
              <p className="no-available">No more vessels available</p>
            ) : (
              <div className="available-vessels-list">
                {availableVessels
                  .filter(vessel => !selectedVessels.some(v => v.url === vessel.url))
                  .slice(0, 6) // Show only first 6 for simplicity
                  .map(vessel => (
                    <div key={vessel.url} className="available-vessel-item">
                      <div className="vessel-info">
                        <h3>{vessel.name}</h3>
                        <p>{vessel.model}</p>
                      </div>
                      <button 
                        className="add-vessel-btn"
                        onClick={() => addVesselToComparison(vessel)}
                        disabled={selectedVessels.length >= 3}
                      >
                        Add
                      </button>
                    </div>
                  ))
                }
                
                {availableVessels.length > 6 && (
                  <div className="more-available">
                    <p>+ {availableVessels.length - 6} more vessels</p>
                    <Link to="/" className="browse-all-link">Browse All</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {selectedVessels.length > 0 && (
        <div className="comparison-table-container">
          <h2>Comparison</h2>
          
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Specification</th>
                {selectedVessels.map(vessel => (
                  <th key={vessel.url}>{vessel.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="spec-name">Model</td>
                {selectedVessels.map(vessel => (
                  <td key={vessel.url}>{vessel.model}</td>
                ))}
              </tr>
              
              <tr>
                <td className="spec-name">Class</td>
                {selectedVessels.map(vessel => (
                  <td key={vessel.url}>{formatValue(vessel.starship_class)}</td>
                ))}
              </tr>
              
              <tr>
                <td className="spec-name">Manufacturer</td>
                {selectedVessels.map(vessel => (
                  <td key={vessel.url}>{formatValue(vessel.manufacturer)}</td>
                ))}
              </tr>
              
              <tr>
                <td className="spec-name">Cost</td>
                {selectedVessels.map((vessel, index) => {
                  const values = selectedVessels.map(v => v.cost_in_credits)
                  const classes = getBestValueClass(values, 'cost_in_credits')
                  return (
                    <td 
                      key={vessel.url} 
                      className={classes[index] || ''}
                    >
                      {formatValue(vessel.cost_in_credits, 'credits')}
                    </td>
                  )
                })}
              </tr>
              
              <tr>
                <td className="spec-name">Length</td>
                {selectedVessels.map((vessel, index) => {
                  const values = selectedVessels.map(v => v.length)
                  const classes = getBestValueClass(values, 'length')
                  return (
                    <td 
                      key={vessel.url}
                      className={classes[index] || ''}
                    >
                      {formatValue(vessel.length, 'm')}
                    </td>
                  )
                })}
              </tr>
              
              <tr>
                <td className="spec-name">Max Speed</td>
                {selectedVessels.map((vessel, index) => {
                  const values = selectedVessels.map(v => v.max_atmosphering_speed)
                  const classes = getBestValueClass(values, 'max_atmosphering_speed')
                  return (
                    <td 
                      key={vessel.url}
                      className={classes[index] || ''}
                    >
                      {formatValue(vessel.max_atmosphering_speed, 'km/h')}
                    </td>
                  )
                })}
              </tr>
              
              <tr>
                <td className="spec-name">Hyperdrive Rating</td>
                {selectedVessels.map((vessel, index) => {
                  const values = selectedVessels.map(v => v.hyperdrive_rating)
                  const classes = getBestValueClass(values, 'hyperdrive_rating')
                  return (
                    <td 
                      key={vessel.url}
                      className={classes[index] || ''}
                    >
                      {formatValue(vessel.hyperdrive_rating)}
                    </td>
                  )
                })}
              </tr>
              
              <tr>
                <td className="spec-name">MGLT</td>
                {selectedVessels.map((vessel, index) => {
                  const values = selectedVessels.map(v => v.MGLT)
                  const classes = getBestValueClass(values, 'MGLT')
                  return (
                    <td 
                      key={vessel.url}
                      className={classes[index] || ''}
                    >
                      {formatValue(vessel.MGLT)}
                    </td>
                  )
                })}
              </tr>
              
              <tr>
                <td className="spec-name">Crew</td>
                {selectedVessels.map((vessel, index) => {
                  const values = selectedVessels.map(v => v.crew)
                  const classes = getBestValueClass(values, 'crew')
                  return (
                    <td 
                      key={vessel.url}
                      className={classes[index] || ''}
                    >
                      {formatValue(vessel.crew)}
                    </td>
                  )
                })}
              </tr>
              
              <tr>
                <td className="spec-name">Passengers</td>
                {selectedVessels.map((vessel, index) => {
                  const values = selectedVessels.map(v => v.passengers)
                  const classes = getBestValueClass(values, 'passengers')
                  return (
                    <td 
                      key={vessel.url}
                      className={classes[index] || ''}
                    >
                      {formatValue(vessel.passengers)}
                    </td>
                  )
                })}
              </tr>
              
              <tr>
                <td className="spec-name">Cargo Capacity</td>
                {selectedVessels.map((vessel, index) => {
                  const values = selectedVessels.map(v => v.cargo_capacity)
                  const classes = getBestValueClass(values, 'cargo_capacity')
                  return (
                    <td 
                      key={vessel.url}
                      className={classes[index] || ''}
                    >
                      {formatValue(vessel.cargo_capacity, 'kg')}
                    </td>
                  )
                })}
              </tr>
              
              <tr>
                <td className="spec-name">Consumables</td>
                {selectedVessels.map(vessel => (
                  <td key={vessel.url}>{formatValue(vessel.consumables)}</td>
                ))}
              </tr>
            </tbody>
          </table>
          
          <div className="comparison-legend">
            <div className="legend-item">
              <span className="legend-marker best-value"></span>
              <span className="legend-text">Best value</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompareVessels