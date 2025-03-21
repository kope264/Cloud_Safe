import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
      <div className="logo">
  <img src="/vite2.svg" alt="Logo" className="logo-img" />
  BlockSafe
</div>

        <div className="nav-links">
          {/* <Link to="/about" className="nav-link">About</Link> */}
          {/* <Link to="/features" className="nav-link">Features</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link> */}
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </div>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h1>Decentralized Cloud Storage</h1>
          <h2>Secure. Private. Yours.</h2>
          <p>
            Store your files securely on the blockchain. No central authority, 
            no data mining, just pure decentralized storage powered by IPFS 
            and blockchain technology.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="primary-btn">Get Started</Link>
            <Link to="/learn" className="secondary-btn">Learn More</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/security.svg" alt="Decentralized storage illustration" />
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose BlockSafe?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Decentralized</h3>
            <p>Your files are stored across the distributed IPFS network, not on centralized servers.</p>
          </div>
          <div className="feature-card">
            <h3>Secure</h3>
            <p>End-to-end encryption ensures only you can access your files.</p>
          </div>
          <div className="feature-card">
            <h3>Immutable</h3>
            <p>Blockchain technology provides tamper-proof storage and verification.</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">BlockSafe</div>
          <div className="footer-links">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-social">
            {/* Social media icons */}
          </div>
        </div>
        <div className="copyright">© 2025 BlockStore. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default HomePage;