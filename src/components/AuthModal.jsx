import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../utils';

const AuthModal = ({ onClose, setIsAuthenticated }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = activeTab === 'login' ? 'login' : 'register';
    const { name, email, password } = formData;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          activeTab === 'login' 
            ? { email, password }
            : { name, email, password }
        )
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Something went wrong');
      }

      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      setIsAuthenticated(true);
      
      toast.success(`Successfully ${activeTab === 'login' ? 'logged in' : 'registered'}!`, {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        onClose();
        navigate('/btech'); // <-- FIXED: use the correct route
      }, 2000);

    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
      });
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade" id="authModal" tabIndex="-1" role="dialog" aria-labelledby="authModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="authModalLabel">
              {activeTab === 'login' ? 'Log In' : 'Sign Up'}
            </h5>
            <button 
              type="button" 
              className="close" 
              data-dismiss="modal" 
              aria-label="Close" 
              onClick={onClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body p-4">
            <ul className="nav nav-tabs nav-justified mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => setActiveTab('login')}
                >
                  Login
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'signup' ? 'active' : ''}`}
                  onClick={() => setActiveTab('signup')}
                >
                  Sign Up
                </button>
              </li>
            </ul>

            <form onSubmit={handleSubmit}>
              {activeTab === 'signup' && (
                <div className="form-group mb-3">
                  <label htmlFor="signupName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="signupName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength="3"
                  />
                </div>
              )}

              <div className="form-group mb-3">
                <label htmlFor="loginEmail" className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="loginEmail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="loginPassword" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="loginPassword"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary w-100 ${loading ? 'disabled' : ''}`}
              >
                {loading ? (
                  <span className="d-flex align-items-center justify-content-center">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </span>
                ) : (
                  activeTab === 'login' ? 'Log In' : 'Sign Up'
                )}
              </button>
            </form>

            {activeTab === 'login' && (
              <div className="mt-4 text-center">
                <button 
                  className="btn btn-link p-0"
                  onClick={() => {
                    onClose();
                    toast.info('Forgot password functionality to be implemented');
                  }}
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>   

          <div className="modal-footer justify-content-center">
            <p className="text-muted mb-0">
              {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                className="btn btn-link p-0" 
                onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
              >
                {activeTab === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

// http://localhost:8080/api/auth/${endpoint}