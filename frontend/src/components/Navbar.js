import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🔧 Incident Management</Link>
      <ul className="navbar-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/incidents" className={location.pathname === '/incidents' ? 'active' : ''}>
            Incidents
          </Link>
        </li>
        <li>
          <Link to="/incidents/new" className={location.pathname === '/incidents/new' ? 'active' : ''}>
            Create Incident
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
