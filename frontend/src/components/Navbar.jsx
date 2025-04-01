import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ user, onLogout }) => {
  // Create a display name that falls back to 'User' if username is undefined
  const displayName = user?.username || 'User';

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Recipe App</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/saved-recipes" className="nav-link">Saved Recipes</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
            <span className="user-name">Welcome, {displayName}</span>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 