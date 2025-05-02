import '../styles/LoadingSpinner.css'

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="star-spinner">
          <div className="star-inner"></div>
        </div>
      </div>
      <p className="loading-text">Loading data from a galaxy far, far away...</p>
    </div>
  )
}

export default LoadingSpinner