import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser
} from '@clerk/clerk-react';
import './HomePage.css';

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser(); // added isLoaded
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, isLoaded, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  if (!isLoaded) {
  return (
    <div className="loading-screen">
      <div className="loader"></div>
      <p>Loading...</p>
    </div>
  );
}


  return (
    <div className="homepage">
      {/* Navigation */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-wrapper">
            <div className="logo">
              <img src="/vite2.svg" alt="BlockSafe Logo" />
              <span>BlockSafe</span>
            </div>

            <button
              className={`nav-toggle ${isNavOpen ? 'active' : ''}`}
              onClick={toggleNav}
              aria-label="Toggle navigation"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <nav className={`nav ${isNavOpen ? 'active' : ''}`}>
              <ul className="nav-list">
                <li><Link to="/" className="nav-link">Home</Link></li>
                <li><Link to="/docs" className="nav-link">Documentation</Link></li>
                <li><Link to="/about" className="nav-link">About</Link></li>
                <li><Link to="/contact" className="nav-link">Contact</Link></li>
              </ul>

              <div className="auth-buttons">
                {isSignedIn ? (
                  <div className="d-flex align-items-center gap-3 text-white">
                    <span>{user.firstName}</span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '14px' }}>
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="btn btn-light border" style={{ padding: '4px 12px', fontSize: '14px' }}>
                        Sign Up
                      </button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-wrapper">
            <div className="hero-content">
              <h1>Decentralized Cloud Storage</h1>
              <h2>Secure. Private. Immutable.</h2>
              <p>
                BlockSafe is a revolutionary decentralized storage platform powered by IPFS.
                Store your files securely with end-to-end encryption, without relying on centralized servers.
                Take back control of your data and enjoy unparalleled privacy and security.
              </p>
              <div className="hero-buttons">
                <SignUpButton mode="modal">
                  <button className="btn btn-outline btn-lg">
                    Get Started
                  </button>
                </SignUpButton>
                <Link to="/learn" className="btn btn-outline btn-lg">Learn More</Link>
              </div>
            </div>
            <div className="hero-image">
              <img src="/security.svg" alt="Decentralized storage illustration" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-wrapper">
            <div className="stat-item"><div className="stat-number">10,000+</div><div className="stat-label">Users</div></div>
            <div className="stat-item"><div className="stat-number">1.5M+</div><div className="stat-label">Files Stored</div></div>
            <div className="stat-item"><div className="stat-number">99.9%</div><div className="stat-label">Uptime</div></div>
            <div className="stat-item"><div className="stat-number">50TB+</div><div className="stat-label">Total Storage</div></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-wrapper">
            <h2>Ready to take control of your data?</h2>
            <p>Join thousands of users who have already made the switch to truly secure, private storage.</p>
            <Link to="/signup" className="btn btn-primary btn-lg">Create Your Free Account</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            {/* Footer columns... same as before */}
            {/* Trimmed for brevity — keep your existing code for these */}
          </div>

          <div className="footer-bottom">
            <div className="copyright">© 2025 BlockSafe. All rights reserved.</div>
            <div className="footer-utilities">
              <select className="language-selector" aria-label="Select language">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
              <a href="#" className="footer-link">Status</a>
              <a href="#" className="footer-link">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
