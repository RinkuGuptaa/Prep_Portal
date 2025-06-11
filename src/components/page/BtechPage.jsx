import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BtechPageAlt.css';
// import defaultUserImage from './path-to-your-default-user-image.png'; // Optional: if you have a default image

const BtechPageAlt = () => {
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
        // Corrupted user data, treat as logged out
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/'); // Redirect to home/login
      }
    } else {
      // Not authenticated, redirect to home (where login modal can be triggered)
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
    // Optionally, if you have a global setIsAuthenticated function passed as prop:
    // setIsAuthenticated(false); 
    navigate('/'); // Redirect to home page after logout
    // You might want to add a toast notification for successful logout
  };

  const cardData = [
    { title: "B.TECH", link: "/btech/departments", external: false, page: "B_tech_dept.html" },
    { title: "BCA", link: "/bca/departments", external: false, page: "BCA_dept.html" },
    // { title: "Note", link: "https://drive.google.com/drive/folders/13km5M-5PY_waEYAbN_vDUNVtMa_wDh7r", external: false, page: "B_tech_dept.html" }, // Update link as needed
    { title: "AI ChatBox", link: "https://geminichatbot-4wai.onrender.com", external: false }, // Update link as needed
    { title: "Note", link: "https://drive.google.com/drive/folders/13km5M-5PY_waEYAbN_vDUNVtMa_wDh7r", external: false, page: "B_tech_dept.html" }, // Update link as needed

    // { title: "AI ChatBox", link: "http://192.168.221.142:3000/", external: false }, // Update link as needed
    // { title: "Resume Analysis", link: "http://192.168.221.142:8080/", external: false, page: "B_tech_dept.html" }, // Update link as needed

    { title: "Resume Analysis", link: "https://resume-analyzer-cjh8.onrender.com", external: false, page: "B_tech_dept.html" }, // Update link as needed
    { title: "Results", link: "https://astu.ac.in/?page_id=116", external: true },
    { title: "Syllabus", link: "https://astu.ac.in/?page_id=349", external: true },
  ];

  // If user data is not yet loaded or user is not authenticated (being redirected)
  if (!user) {
    // You can show a loading spinner here
    return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
  }

  const userName = user.name || 'User';
  // const userProfilePic = user.profilePictureUrl || defaultUserImage; // Use this if you have a URL and default image
  const userInitials = userName.substring(0, 1).toUpperCase();


  return (
    <div className={`btech-page-container ${darkMode ? 'dark-mode-component' : ''}`}>
      <nav className={`navbar-custom ${darkMode ? 'dark-mode-component' : ''}`}>
        <h1 className="logo-custom">
          <Link to="/" className="text-decoration-none">
            <span className="color-text-custom">Question</span>-Paper
          </Link>
        </h1>
        <button
          className="navbar-toggler-custom d-lg-none"
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Desktop Navbar Items - Aligned to the right */}
        <div className="d-none d-lg-flex align-items-center ms-auto">
          <Link to="/" className="mx-2 nav-link-custom">Home</Link>
          <a href="#services" className="mx-2 nav-link-custom">Services</a>
          <Link to="/team" className="mx-2 nav-link-custom">About</Link>
          <a href="#contact-section" className="mx-2 nav-link-custom">Contact</a>

          {/* User Profile Dropdown */}
          <div className="dropdown mx-2">
            <button
              className={`btn btn-secondary dropdown-toggle d-flex align-items-center ${darkMode ? 'btn-dark' : 'btn-light'}`}
              type="button"
              id="userProfileDropdown"
              data-bs-toggle="dropdown" // Requires Bootstrap JS
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
              <li><Link className="dropdown-item" to="/profile">My Profile</Link></li> {/* Optional: Link to a profile page */}
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
            className="btn btn-sm btn-close-sidebar d-lg-none" // Custom class for styling close
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>
        <Link to="/" onClick={handleSidebarLinkClick} className="sidebar-link-custom">Home</Link>
        <a href="#services" onClick={handleSidebarLinkClick} className="sidebar-link-custom">Services</a>
        <Link to="/about" onClick={handleSidebarLinkClick} className="sidebar-link-custom">About</Link>
        <a href="#contact-section" onClick={handleSidebarLinkClick} className="sidebar-link-custom">Contact</a>
        <Link to="/profile" onClick={handleSidebarLinkClick} className="sidebar-link-custom">My Profile</Link> {/* Optional */}

        <div className="mt-auto p-3"> {/* Pushes buttons to bottom */}
          <button
            onClick={() => { toggleDarkMode(); /* handleSidebarLinkClick(); // Not needed if sidebar stays open */ }}
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

      <div className={`container mt-4 main-content-custom ${sidebarOpen ? 'sidebar-open-push-effect' : ''}`}>
        <div className="row">
          <div className="col-12 text-center">
            <h2 className={`heading-custom ${darkMode ? 'text-white' : 'text-dark'}`}>
              Assam Science and Technology University (ASTU)
            </h2>
          </div>
        </div>

        <div className="row justify-content-center">
          {cardData.map((card, index) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
              <div className={`card custom-card-react ${darkMode ? 'dark-mode-card' : ''}`}>
                <div className="card-body">
                  <h5 className={`card-title-custom ${darkMode ? 'text-light' : 'text-dark'}`}>{card.title}</h5>
                  {card.external ? (
                    <a
                      href={card.link}
                      className="btn btn-primary btn-sm d-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {card.title === "Results" ? "View Result" : "View Syllabus"}
                    </a>
                  ) : (
                    <Link
                      to={card.link}
                      className="btn btn-primary btn-sm d-block"
                    >
                      Access {card.title}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <section id="services" className={`services-section py-5 ${darkMode ? 'dark-services' : ''}`}>
          {/* ... (services section remains unchanged, ensure darkMode classes are correctly applied) ... */}
          {/* Content of services section as provided in the original code */}
          <div className="container">
            <div className="text-center mb-5">
              <h2 className={`section-title ${darkMode ? 'text-light' : 'text-dark'}`}>Our Services</h2>
              <p className={`section-subtitle ${darkMode ? 'text-light' : 'text-muted'}`}>
                Empowering your academic and professional journey with cutting-edge tools
              </p>
            </div>

            <div className="row">
              {/* Service 1 - Notes */}
              <div className="col-lg-4 col-md-6 mb-4">
                <div className={`service-card ${darkMode ? 'dark-service-card' : ''} p-4 h-100`}>
                  <div className="service-icon mb-4">
                    <i className="fas fa-book-open fa-3x" style={{ color: '#4e73df' }}></i>
                  </div>
                  <h3 className={`service-title ${darkMode ? 'text-light' : ''}`}>Comprehensive Notes</h3>
                  <p className={`service-description ${darkMode ? 'text-light' : 'text-muted'}`}>
                    Curated academic notes for all semesters, organized by subject and topic for easy reference.
                  </p>
                  <ul className={`service-features ${darkMode ? 'text-light' : ''}`}>
                    <li>Subject-wise categorization</li>
                    <li>Professor-approved content</li>
                    <li>Regular updates</li>
                  </ul>
                </div>
              </div>

              {/* Service 2 - AI ChatBox */}
              <div className="col-lg-4 col-md-6 mb-4">
                <div className={`service-card ${darkMode ? 'dark-service-card' : ''} p-4 h-100`}>
                  <div className="service-icon mb-4">
                    <i className="fas fa-robot fa-3x" style={{ color: '#1cc88a' }}></i>
                  </div>
                  <h3 className={`service-title ${darkMode ? 'text-light' : ''}`}>AI Chat Assistant</h3>
                  <p className={`service-description ${darkMode ? 'text-light' : 'text-muted'}`}>
                    Get instant answers to your academic queries with our 24/7 AI-powered chatbot.
                  </p>
                  <ul className={`service-features ${darkMode ? 'text-light' : ''}`}>
                    <li>Course-specific assistance</li>
                    <li>Assignment help</li>
                    <li>Exam preparation tips</li>
                  </ul>
                </div>
              </div>

              {/* Service 3 - Resume Analysis */}
              <div className="col-lg-4 col-md-6 mb-4">
                <div className={`service-card ${darkMode ? 'dark-service-card' : ''} p-4 h-100`}>
                  <div className="service-icon mb-4">
                    <i className="fas fa-file-alt fa-3x" style={{ color: '#f6c23e' }}></i>
                  </div>
                  <h3 className={`service-title ${darkMode ? 'text-light' : ''}`}>Resume Analysis</h3>
                  <p className={`service-description ${darkMode ? 'text-light' : 'text-muted'}`}>
                    Professional resume evaluation with personalized feedback to boost your career prospects.
                  </p>
                  <ul className={`service-features ${darkMode ? 'text-light' : ''}`}>
                    <li>ATS compatibility check</li>
                    <li>Industry-specific suggestions</li>
                    <li>Template recommendations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Services Row */}
            <div className="row mt-4">
              {/* Service 4 - Question Papers */}
              <div className="col-lg-6 mb-4">
                <div className={`service-card ${darkMode ? 'dark-service-card' : ''} p-4 h-100`}>
                  <div className="service-icon mb-4">
                    <i className="fas fa-file-pdf fa-3x" style={{ color: '#e74a3b' }}></i>
                  </div>
                  <h3 className={`service-title ${darkMode ? 'text-light' : ''}`}>Question Bank</h3>
                  <p className={`service-description ${darkMode ? 'text-light' : 'text-muted'}`}>
                    Extensive collection of previous year question papers with model answers.
                  </p>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className={`service-features ${darkMode ? 'text-light' : ''}`}>
                        <li>Year-wise archives</li>
                        <li>Semester-wise organization</li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className={`service-features ${darkMode ? 'text-light' : ''}`}>
                        <li>Solved papers</li>
                        <li>Important questions highlighted</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service 5 - Results & Syllabus */}
              <div className="col-lg-6 mb-4">
                <div className={`service-card ${darkMode ? 'dark-service-card' : ''} p-4 h-100`}>
                  <div className="service-icon mb-4">
                    <i className="fas fa-graduation-cap fa-3x" style={{ color: '#36b9cc' }}></i>
                  </div>
                  <h3 className={`service-title ${darkMode ? 'text-light' : ''}`}>Academic Resources</h3>
                  <p className={`service-description ${darkMode ? 'text-light' : 'text-muted'}`}>
                    Direct access to university results and updated syllabus for all courses.
                  </p>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className={`service-features ${darkMode ? 'text-light' : ''}`}>
                        <li>Result analysis</li>
                        <li>Performance trends</li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className={`service-features ${darkMode ? 'text-light' : ''}`}>
                        <li>Detailed syllabus PDFs</li>
                        <li>Subject reference materials</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact-section" className={`py-5 ${darkMode ? 'dark-contact' : ''}`}>
          <h3 className={`mb-3 ${darkMode ? 'text-white' : 'text-dark'}`}>Contact Us</h3>
          <p className={`${darkMode ? 'text-light' : 'text-secondary'}`}>
            Contact details or a contact form can go here...
          </p>
        </section>
      </div>
    </div>
  );
};

export default BtechPageAlt;