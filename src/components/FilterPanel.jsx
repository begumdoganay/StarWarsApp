import { useState } from 'react'
import '../styles/FilterPanel.css'

const FilterPanel = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    const newFilters = { ...localFilters, [name]: value }
    setLocalFilters(newFilters)
    
    // Only update parent state for search input immediately
    // For other filters, we'll wait for Apply button to avoid excessive filtering
    if (name === 'search') {
      onFilterChange(newFilters)
    }
  }
  
  const handleApplyFilters = () => {
    onFilterChange(localFilters)
  }
  
  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      minSpeed: '',
      maxSpeed: '',
      minCrew: '',
      maxCrew: '',
      manufacturer: ''
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }
  
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '')
  }
  
  return (
    <div className={`filter-panel ${isExpanded ? 'expanded' : ''}`}>
      <div className="filter-bar">
        <div className="search-container">
          <input
            type="text"
            name="search"
            placeholder="Search vessels by name or model..."
            value={localFilters.search}
            onChange={handleInputChange}
            className="search-input"
          />
          {localFilters.search && (
            <button 
              className="clear-search-btn"
              onClick={() => {
                const newFilters = { ...localFilters, search: '' }
                setLocalFilters(newFilters)
                onFilterChange(newFilters)
              }}
            >
              ×
            </button>
          )}
        </div>
        
        <button 
          className={`advanced-filters-toggle ${isExpanded ? 'active' : ''} ${hasActiveFilters() ? 'has-filters' : ''}`}
          onClick={toggleExpand}
        >
          <span>Advanced Filters</span>
          {hasActiveFilters() && <span className="filter-badge" />}
          <span className="toggle-icon">{isExpanded ? '▲' : '▼'}</span>
        </button>
      </div>
      
      {isExpanded && (
        <div className="advanced-filters">
          <div className="filter-group">
            <h3>Speed (km/h)</h3>
            <div className="range-inputs">
              <div className="input-group">
                <label htmlFor="minSpeed">Min:</label>
                <input
                  type="number"
                  id="minSpeed"
                  name="minSpeed"
                  placeholder="Min"
                  value={localFilters.minSpeed}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="maxSpeed">Max:</label>
                <input
                  type="number"
                  id="maxSpeed"
                  name="maxSpeed"
                  placeholder="Max"
                  value={localFilters.maxSpeed}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div className="filter-group">
            <h3>Crew Size</h3>
            <div className="range-inputs">
              <div className="input-group">
                <label htmlFor="minCrew">Min:</label>
                <input
                  type="number"
                  id="minCrew"
                  name="minCrew"
                  placeholder="Min"
                  value={localFilters.minCrew}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="maxCrew">Max:</label>
                <input
                  type="number"
                  id="maxCrew"
                  name="maxCrew"
                  placeholder="Max"
                  value={localFilters.maxCrew}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div className="filter-group">
            <h3>Manufacturer</h3>
            <input
              type="text"
              name="manufacturer"
              placeholder="Filter by manufacturer..."
              value={localFilters.manufacturer}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="filter-actions">
            <button 
              className="apply-filters-btn"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
            
            <button 
              className="clear-filters-btn"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters()}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel