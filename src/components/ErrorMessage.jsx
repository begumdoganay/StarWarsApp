import { Link } from 'react-router-dom'
import '../styles/ErrorMessage.css'

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h2 className="error-title">Houston, we have a problem!</h2>
      <p className="error-message">{message || 'An unexpected error occurred'}</p>
      <div className="error-actions">
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
        <Link to="/" className="home-link">Return to Home</Link>
      </div>
    </div>
  )
}

export default ErrorMessage