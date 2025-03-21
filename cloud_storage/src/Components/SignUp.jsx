import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

const SignupPage = () => {
  // Separate useState for each form field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for handling errors, loading, and success
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const Signupdata = async () => {
    try {
      console.warn(name, email, password);
      let result = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      result = await result.json();
      console.warn(result);
      if (result) {
        // Store user data and ID in localStorage
        localStorage.setItem('user', JSON.stringify(result));
        Navigate('/login');
      }
    } catch (e) {
      alert("Something went wrong", e);
      console.warn(e);
    }
};
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);

      try {
        console.log('Registering with:', { name, email, password });

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setSuccess(true);

        // Redirect to login after short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } catch (err) {
        setErrors({ form: 'Registration failed. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create an Account</h1>
          <p>Join our decentralized storage network</p>
        </div>

        {success ? (
          <div className="success-message">
            <h3>Registration Successful!</h3>
            <p>Redirecting to login...</p>
          </div>
        ) : (
          <>
            {errors.form && <div className="error-message">{errors.form}</div>}

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
              </div>

              <div className="terms">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                </label>
              </div>

              <button type="submit" className="signup-button" disabled={loading} onClick={Signupdata}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="login-prompt">
              <p>Already have an account? <Link to="/login">Log in</Link></p>
            </div>

            <div className="wallet-signup">
              <p>Or sign up with your wallet</p>
              <button className="wallet-button">Connect Wallet</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
