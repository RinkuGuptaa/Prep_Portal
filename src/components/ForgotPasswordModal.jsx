import React from 'react';

const ForgotPasswordModal = () => {
  return (
    <div className="modal fade" id="forgotPasswordModal" tabindex="-1" role="dialog" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="forgotPasswordModalLabel">Forgot Password</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label for="forgotEmail">Email address</label>
                <input type="email" className="form-control" id="forgotEmail" placeholder="Enter your email" required />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary">Verify</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;