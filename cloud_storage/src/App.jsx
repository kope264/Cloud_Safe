import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Components/Home';
import LoginPage from './Components/LoginPage';
import SignupPage from './Components/SignUp';
import Dashboard from './Components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
         <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        

// Inside your Routes component
<Route path="/dashboard" element={<Dashboard />} />
        {/* Add more routes as needed */}
        {/*  <Route path="/about" element={<div>About Page</div>} />
        <Route path="/features" element={<div>Features Page</div>} />
        <Route path="/pricing" element={<div>Pricing Page</div>} />
        <Route path="/dashboard" element={<div>Dashboard Page (Protected)</div>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
