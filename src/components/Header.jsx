import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FavoritesContext } from '../App'
import '../styles/Header.css'

const Header = () => {
  const { favorites } = useContext(FavoritesContext)
  
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <span className="logo-icon">🚀</span>
          <h1>Galactic Vessels Explorer</h1>
        </Link>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <NavLink 
              to="/" 
              className={({isActive}) => isActive ? 'active' : ''}
              end
            >
              Vessels
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/compare" 
              className={({isActive}) => isActive ? 'active' : ''}
            >
              Compare
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/favorites" 
              className={({isActive}) => isActive ? 'active' : ''}
            >
              Favorites {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header