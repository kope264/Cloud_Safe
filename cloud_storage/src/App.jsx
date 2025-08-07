// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Components/Home';
import Dashboard from './Components/Dashboard';
import { UserProfile } from "@clerk/clerk-react";




function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Optional Future Routes
      <Route path="/about" element={<div>About Page</div>} />
      <Route path="/features" element={<div>Features Page</div>} />
      <Route path="/pricing" element={<div>Pricing Page</div>} />
      */}
    </Routes>
  );
}

export default App;
