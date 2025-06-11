import React from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { toast } from 'react-toastify'; 
const Navbar = () => {
  const navigate = useNavigate();

 const handleEducationClick = (e) => {
    const user = localStorage.getItem('user');
    if (!user) {
      e.preventDefault();
      toast.error('Please log in or sign up to access Education.', {
        position: "top-center",
        autoClose: 3000,
      });
      // Open the login/signup modal
      const modal = document.getElementById('authModal');
      if (modal) {
        // Bootstrap modal show
        window.$('#authModal').modal('show');
      }
    } else {
      toast.success('Welcome to Education!', {
        position: "top-center",
        autoClose: 1500,
      });
    }
    // else allow navigation
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <Link className="navbar-brand" to="/">
        <img src="/assets/Logo1.png" alt="Books and Particles Logo" style={{ width: '50px' }} />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/overview">Overview</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/team">Team</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/enterprise">Enterprise</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/btech" onClick={handleEducationClick} >
              Education
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">Contact</Link>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link"
              data-toggle="modal"
              data-target="#authModal"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
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