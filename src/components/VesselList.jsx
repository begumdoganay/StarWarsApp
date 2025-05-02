import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FavoritesContext } from '../App'
import VesselCard from './VesselCard'
import FilterPanel from './FilterPanel'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import '../styles/VesselList.css'

const VesselList = () => {
  const [vessels, setVessels] = useState([])
  const [filteredVessels, setFilteredVessels] = useState([])
  const [nextPage, setNextPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    minSpeed: '',
    maxSpeed: '',
    minCrew: '',
    maxCrew: '',
    manufacturer: ''
  })

  // Extract vessel ID from URL for proper routing
  const getVesselId = (url) => {
    const parts = url.split('/')
    return parts[parts.length - 2]
  }

  // Fetch vessels from the Star Wars API
  const fetchVessels = async (url) => {
    try {
      const isInitialLoad = url === 'https://swapi.dev/api/starships/'
      if (isInitialLoad) setLoading(true)
      else setLoadingMore(true)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch vessels')
      }
      
      const data = await response.json()
      
      // Add an id field based on the URL to make routing easier
      const vesselsWithIds = data.results.map(vessel => ({
        ...vessel,
        id: getVesselId(vessel.url)
      }))
      
      if (isInitialLoad) {
        setVessels(vesselsWithIds)
        setFilteredVessels(vesselsWithIds)
      } else {
        setVessels(prev => [...prev, ...vesselsWithIds])
        setFilteredVessels(prev => [...prev, ...vesselsWithIds])
      }
      
      setNextPage(data.next)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchVessels('https://swapi.dev/api/starships/')
  }, [])

  // Apply filters whenever vessels or filters change
  useEffect(() => {
    if (vessels.length === 0) return
    
    const filtered = vessels.filter(vessel => {
      // Search by name or model
      const searchMatch = 
        vessel.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        vessel.model.toLowerCase().includes(filters.search.toLowerCase())
      
      // Filter by speed (handle unknown/N/A values)
      const speed = vessel.max_atmosphering_speed
      const speedValue = speed === 'unknown' || speed === 'n/a' ? 0 : parseInt(speed.replace(/[^\d]/g, ''))
      const minSpeedMatch = !filters.minSpeed || speedValue >= parseInt(filters.minSpeed)
      const maxSpeedMatch = !filters.maxSpeed || speedValue <= parseInt(filters.maxSpeed)
      
      // Filter by crew size (handle unknown/N/A values)
      const crew = vessel.crew
      const crewValue = crew === 'unknown' || crew === 'n/a' ? 0 : parseInt(crew.replace(/[^\d-]/g, '').split('-')[0])
      const minCrewMatch = !filters.minCrew || crewValue >= parseInt(filters.minCrew)
      const maxCrewMatch = !filters.maxCrew || crewValue <= parseInt(filters.maxCrew)
      
      // Filter by manufacturer
      const manufacturerMatch = !filters.manufacturer || 
        vessel.manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase())
      
      return searchMatch && minSpeedMatch && maxSpeedMatch && 
             minCrewMatch && maxCrewMatch && manufacturerMatch
    })
    
    setFilteredVessels(filtered)
  }, [vessels, filters])

  const loadMore = () => {
    if (nextPage && !loadingMore) {
      fetchVessels(nextPage)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="vessel-list-container">
      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
      
      {filteredVessels.length === 0 ? (
        <div className="no-results">
          <h3>No vessels match your criteria</h3>
          <button onClick={() => setFilters({
            search: '',
            minSpeed: '',
            maxSpeed: '',
            minCrew: '',
            maxCrew: '',
            manufacturer: ''
          })}>Clear filters</button>
        </div>
      ) : (
        <>
          <div className="vessel-count">
            Showing {filteredVessels.length} vessels
            {filteredVessels.length !== vessels.length && 
              ` (filtered from ${vessels.length} total)`}
          </div>
          
          <div className="vessel-grid">
            {filteredVessels.map(vessel => (
              <VesselCard key={vessel.name} vessel={vessel} />
            ))}
          </div>
          
          {nextPage && (
            <div className="load-more">
              <button 
                onClick={loadMore} 
                disabled={loadingMore}
                className="load-more-btn"
              >
                {loadingMore ? 'Loading...' : 'Load More Vessels'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default VesselList