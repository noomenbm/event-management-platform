import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="container header-container">
        {/* Branding Logo */}
        <Link className="logo-link" to="/events" onClick={closeMobileMenu} aria-label="Go to Events">
          <span>Vibe<span className="logo-accent">Vent</span></span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Navigation Menu */}
        <nav className={`navbar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links">
            <li>
              <NavLink
                className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
                to="/events"
                onClick={closeMobileMenu}
              >
                Events
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
                to="/my-bookings"
                onClick={closeMobileMenu}
              >
                My Bookings
              </NavLink>
            </li>
          </ul>

          {/* Theme Switcher & Mock User Profile info */}
          <div className="navbar-actions">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle light/dark theme"
            >
              {theme === 'light' ? (
                /* Moon Icon for Dark Mode toggle */
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                /* Sun Icon for Light Mode toggle */
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>

            {/* Mock User Badge */}
            <div className="user-badge" aria-label="Current user">
              <div className="user-status-dot"></div>
              <span>{currentUser.name}</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
