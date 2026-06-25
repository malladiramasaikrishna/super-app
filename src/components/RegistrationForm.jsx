import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
    agree: false,
  });

  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
    agree: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error on change
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', username: '', email: '', mobile: '', agree: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Field is required';
      isValid = false;
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Field is required';
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Field is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Field is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number (must be 10 digits)';
      isValid = false;
    }
    if (!formData.agree) {
      newErrors.agree = 'Check this box if you want to proceed';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setUser({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
      });
      navigate('/categories');
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className={`form-input ${errors.name ? 'error' : ''}`}
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="username"
          placeholder="UserName"
          className={`form-input ${errors.username ? 'error' : ''}`}
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className="error-text">{errors.username}</p>}
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={`form-input ${errors.email ? 'error' : ''}`}
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="form-group">
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile"
          className={`form-input ${errors.mobile ? 'error' : ''}`}
          value={formData.mobile}
          onChange={handleChange}
        />
        {errors.mobile && <p className="error-text">{errors.mobile}</p>}
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
          />
          Share my registration data with Superapp
        </label>
        {errors.agree && <p className="error-text">{errors.agree}</p>}
      </div>

      <button type="submit" className="signup-button">
        SIGN UP
      </button>
    </form>
  );
};

export default RegistrationForm;
