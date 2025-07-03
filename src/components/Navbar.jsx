import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navbarRef = useRef(null);

  const handleNavToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const handleEducationClick = (e) => {
    const user = localStorage.getItem('user');
    if (!user) {
      e.preventDefault();
      toast.error('Please log in or sign up to access Education.', {
        position: "top-center",
        autoClose: 3000,
      });
      const modal = document.getElementById('authModal');
      if (modal) {
        window.$('#authModal').modal('show');
      }
    } else {
      toast.success('Welcome to Education!', {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  // Close navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavCollapsed(true);
      }
    };

    // Add when the menu is open
    if (!isNavCollapsed) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavCollapsed]);

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark"
      ref={navbarRef}
    >
      <Link className="navbar-brand" to="/">
        <img src="/assets/Logo1.png" alt="Books and Particles Logo" style={{ width: '50px' }} />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        onClick={handleNavToggle}
        aria-expanded={!isNavCollapsed}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div 
        className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`}
        id="navbarNav"
      >
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={() => setIsNavCollapsed(true)}>Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/overview" onClick={() => setIsNavCollapsed(true)}>Overview</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/team" onClick={() => setIsNavCollapsed(true)}>Team</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/enterprise" onClick={() => setIsNavCollapsed(true)}>Enterprise</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/btech" onClick={(e) => {
              handleEducationClick(e);
              setIsNavCollapsed(true);
            }}>
              Education
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact" onClick={() => setIsNavCollapsed(true)}>Contact</Link>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link"
              data-toggle="modal"
              data-target="#authModal"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setIsNavCollapsed(true)}
            >
              Log In
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;