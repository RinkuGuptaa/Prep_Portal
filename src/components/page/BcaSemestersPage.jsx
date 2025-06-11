// src/components/BcaSemestersPage.js (or your chosen path)
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Renamed Link to RouterLink to avoid conflict
import './BtechPageAlt.css'; // Reusing the same CSS for consistency

// Optional: if you have a default image
// import defaultUserImage from './path-to-your-default-user-image.png';

const BcaSemestersPage = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Authentication check and user data loading
    const token = localStorage.getItem('token');
    const userDataString = localStorage.getItem('user');

    if (token && userDataString) {
      try {
        const parsedUser = JSON.parse(userDataString);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/'); // Redirect to home/login
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode-global');
    } else {
      document.body.classList.remove('dark-mode-global');
    }
    return () => {
      document.body.classList.remove('dark-mode-global');
    };
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarLinkClick = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const semesterCardData = [
    { title: "1st Semester", Link: "https://drive.google.com/drive/folders/14O8n-iE4aUsp3d_8qIsApQI915qeXPP6?usp=drive_link" },
    { title: "2nd Semester", Link: "https://drive.google.com/drive/folders/14PCyGmmDj7Y2aXWk2hg2-_roaaxvYptj?usp=drive_link" },
    { title: "3rd Semester", Link: "https://drive.google.com/drive/folders/14Qe8k4tRaKtxvCKh4iHLLXE1oYxOO-QP?usp=drive_link" },
    { title: "4th Semester", Link: "https://drive.google.com/drive/folders/14UekNAoOgqK4aiRoajKEW5_lKh6gTrOg?usp=drive_link" },
    { title: "5th Semester", Link: "https://drive.google.com/drive/folders/14dx1MNJP4eXxm6hEaY0_E1dUZcabRLEJ?usp=drive_link" },
    { title: "6th Semester", Link: "https://drive.google.com/drive/folders/14g8_2KHo8zf7-YHVVyGR5LesEjx3M3Qn?usp=drive_link" },
  ];

  if (!user) {
    return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
  }

  const userName = user.name || 'User';
  const userInitials = userName.substring(0, 1).toUpperCase();

  return (
    <div className={`btech-page-container ${darkMode ? 'dark-mode-component' : ''}`}>
      {/* Navbar */}
      <nav className={`navbar-custom ${darkMode ? 'dark-mode-component' : ''}`}>
        <h1 className="logo-custom">
          <RouterLink to="/" className="text-decoration-none"> {/* Changed Link to RouterLink */}
            <span className="color-text-custom">Question</span>-Paper
          </RouterLink>
        </h1>
        <button
          className="navbar-toggler-custom d-lg-none"
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="d-none d-lg-flex align-items-center ms-auto">
          <RouterLink to="/" className="mx-2 nav-link-custom">Home</RouterLink> {/* Changed Link to RouterLink */}
          <RouterLink to="/about" className="mx-2 nav-link-custom">About</RouterLink> {/* Changed Link to RouterLink */}
          <div className="dropdown mx-2">
            <button
              className={`btn btn-secondary dropdown-toggle d-flex align-items-center ${darkMode ? 'btn-dark' : 'btn-light'}`}
              type="button"
              id="userProfileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt={userName} className="rounded-circle me-2" style={{ width: '24px', height: '24px', objectFit: 'cover' }} />
              ) : (
                <span className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '24px', height: '24px', fontSize: '0.8rem' }}>
                  {userInitials}
                </span>
              )}
              {userName}
            </button>
            <ul className={`dropdown-menu dropdown-menu-end ${darkMode ? 'dropdown-menu-dark' : ''}`} aria-labelledby="userProfileDropdown">
              <li><RouterLink className="dropdown-item" to="/profile">My Profile</RouterLink></li> {/* Changed Link to RouterLink */}
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div>
          <button
            onClick={toggleDarkMode}
            className="btn-circle-custom mx-2"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar-custom ${sidebarOpen ? 'open' : ''} ${darkMode ? 'dark-mode-sidebar' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-3 p-3 border-bottom">
          <div className="d-flex align-items-center">
            {user.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt={userName} className="rounded-circle me-2" style={{ width: '30px', height: '30px', objectFit: 'cover' }} />
              ) : (
                <span className={`rounded-circle d-flex align-items-center justify-content-center me-2 ${darkMode ? 'bg-light text-dark' : 'bg-primary text-white'}`} style={{ width: '30px', height: '30px', fontSize: '1rem' }}>
                  {userInitials}
                </span>
              )}
            <h2 className="sidebar-title-custom mb-0 fs-5">{userName}</h2>
          </div>
          <button
            className="btn btn-sm btn-close-sidebar d-lg-none"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>
        <RouterLink to="/" onClick={handleSidebarLinkClick} className="sidebar-link-custom">Home</RouterLink> {/* Changed Link to RouterLink */}
        <RouterLink to="/about" onClick={handleSidebarLinkClick} className="sidebar-link-custom">About</RouterLink> {/* Changed Link to RouterLink */}
        <RouterLink to="/profile" onClick={handleSidebarLinkClick} className="sidebar-link-custom">My Profile</RouterLink> {/* Changed Link to RouterLink */}
        <div className="mt-auto p-3">
          <button
            onClick={() => { toggleDarkMode(); }}
            className={`btn w-100 mb-2 ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
            aria-label="Toggle dark mode in sidebar"
          >
            {darkMode ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}
          </button>
          <button
              onClick={() => { handleLogout(); handleSidebarLinkClick(); }}
              className="btn btn-danger w-100"
          >
              <i className="fas fa-sign-out-alt me-2"></i>Logout
          </button>
        </div>
      </div>
      {sidebarOpen && <div className="sidebar-overlay d-lg-none" onClick={toggleSidebar}></div>}

      {/* Main Content for BCA Semesters */}
      <div className={`container mt-5 main-content-custom ${sidebarOpen ? 'sidebar-open-push-effect' : ''}`}>
        <div className="row">
          <div className="col-12 text-center">
            <h2 className={`heading-custom ${darkMode ? 'text-white' : 'text-dark'}`}>
              BCA Previous-years Question-Papers
            </h2>
          </div>
        </div>

        <div className="row justify-content-center">
          {semesterCardData.map((sem, index) => (
            <div className="col-lg-4 col-md-4 col-sm-6 mb-4" key={index}>
              <div className={`card custom-card-react ${darkMode ? 'dark-mode-card' : ''}`}>
                <div className="card-body text-center">
                  <h5 className={`card-title-custom ${darkMode ? 'text-light' : 'text-dark'}`}>{sem.title}</h5>
                  {/* MODIFIED PART HERE */}
                  <a
                    href={sem.Link} // Use the Google Drive link directly
                    className="btn btn-primary btn-sm d-block"
                    target="_blank" // Open link in a new tab
                    rel="noopener noreferrer" // Security measure for external links
                  >
                    Question paper
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BcaSemestersPage;