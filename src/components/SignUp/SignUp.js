import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../../services/customerService'; 
import { validateFullName, validateUserName, validatePassword } from '../../utils/validation'; 
import './SignUp.scss'; 

const SignUp = () => {
  
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate(); 

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fullName || !userName || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (!validateFullName(fullName)) {
      setErrorMessage('Full name should contain at least first and last name');
      return;
    }

    if (!validateUserName(userName)) {
      setErrorMessage('Username should be alphanumeric and between 3-20 characters');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number');
      return;
    }

    // clear errors
    setErrorMessage('');
    setIsSubmitting(true);

    try {
            
      await customerService.signUp({        
        "fullName": fullName,
        "userName": userName,
        "password": password,        
      });

      setFullName("");
      setUserName("");
      setPassword("");
      setSuccessMessage('You have successfully signed up!');
      setIsSubmitting(false);
    } catch (error) {
      
        setErrorMessage(error);     
        setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
     <div className="sign-up-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="sign-up-form">
        <div className="form-group">
          <label htmlFor="fullName"></label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="userName"></label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password"></label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
          <button onClick={() => navigate('/login')}>Go to Login</button> {/* Use navigate instead of history.push */}
        </div>
      )}
    </div>
   </div>
  );
};

export default SignUp;
