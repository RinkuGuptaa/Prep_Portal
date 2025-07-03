import React, { useState } from 'react';
import { handleError, handleSuccess } from '../utils';
import { API_BASE_URL } from '../utils';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email'); // 'email' or 'success'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to send reset email');
      }

      handleSuccess('Password reset email sent! Check your inbox.');
      setStep('success');

      // Auto close after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (error) {
      handleError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setStep('email');
    setLoading(false);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show" 
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {step === 'email' ? 'Forgot Password' : 'Email Sent'}
            </h5>
            <button 
              type="button" 
              className="close" 
              onClick={handleClose}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body p-4">
            {step === 'email' ? (
              <>
                <p className="text-muted mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-4">
                    <label htmlFor="forgotEmail" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="forgotEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email address"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className={`btn btn-primary w-100 ${loading ? 'disabled' : ''}`}
                  >
                    {loading ? (
                      <span className="d-flex align-items-center justify-content-center">
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mb-4">
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                </div>
                <h6 className="mb-3">Reset Link Sent!</h6>
                <p className="text-muted">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Please check your inbox and follow the instructions.
                </p>
                <p className="text-muted small">
                  Don't see the email? Check your spam folder or try again.
                </p>
              </div>
            )}
          </div>

          <div className="modal-footer justify-content-center">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleClose}
            >
              {step === 'email' ? 'Cancel' : 'Close'}
            </button>
            {step === 'email' && (
              <button 
                type="button" 
                className="btn btn-link"
                onClick={handleClose}
              >
                Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
