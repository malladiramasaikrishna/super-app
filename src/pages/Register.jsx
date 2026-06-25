import React from 'react';
import RegistrationForm from '../components/RegistrationForm';

const Register = () => {
  return (
    <div className="register-page">
      {/* Left Banner Section */}
      <div className="register-left">
        <img 
          src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80" 
          alt="Concert background" 
          className="register-left-bg"
        />
        <div className="register-left-overlay">
          <h1 className="register-left-title">Discover new things on<br />Superapp</h1>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="register-right">
        <div className="register-form-container">
          <h1 className="app-logo">Super app</h1>
          <h2>Create your new account</h2>
          <RegistrationForm />
          <p className="form-footer-text">
            By clicking on Sign up. you agree to Superapp <a href="#">Terms and Conditions of Use</a>
          </p>
          <p className="form-footer-text" style={{ marginTop: '0.75rem' }}>
            To learn more about how Superapp collects, uses, shares and protects your personal data please head Superapp <a href="#">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
