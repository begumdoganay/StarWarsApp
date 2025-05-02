import { Link } from 'react-router-dom'
import '../styles/NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="space-animation">
        <div className="stars"></div>
        <div className="planet"></div>
        <div className="astronaut">👨‍🚀</div>
      </div>
      
      <h1>404</h1>
      <h2>Lost in Space</h2>
      <p>The page you're looking for seems to have drifted into a black hole.</p>
      
      <Link to="/" className="return-home">
        Return to the Fleet
      </Link>
    </div>
  )
}

export default NotFound