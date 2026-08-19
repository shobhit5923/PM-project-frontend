import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from './assets/logo1.png';

const About = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="font-sans min-h-screen flex flex-col" style={{ backgroundColor: '#0B1D36', color: '#ffffff' }}>
      <nav className="absolute top-0 left-0 w-full z-20 px-6 py-4 flex justify-between items-center bg-transparent">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-lg hidden md:block">GIM Lost & Found</span>
        </div>

        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-200">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/services" className="hover:text-white transition">Services</Link>
          <Link to="/browseitems" className="hover:text-white transition">Browse Items</Link>
          <Link to="/claimmng" className="hover:text-white transition">Claim Management</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
          <Link to="/notifications" className="hover:text-white transition">Notifications</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="hover:text-white transition">Logout</button>
          ) : (
            <Link to="/login" className="hover:text-white transition">Login</Link>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-[#0F2744] shadow-lg flex flex-col items-center py-4 space-y-4 md:hidden border-t border-blue-900">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/services" className="hover:text-gray-300">Services</Link>
            <Link to="/browseitems" className="hover:text-gray-300">Browse Items</Link>
            <Link to="/claimmng" className="hover:text-gray-300">Claim Management</Link>
            <Link to="/contact" className="hover:text-gray-300">Contact</Link>
            <Link to="/notifications" className="hover:text-gray-300">Notifications</Link>
            <Link to="/about" className="hover:text-gray-300">About</Link>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
            ) : (
              <Link to="/login" className="hover:text-gray-300">Login</Link>
            )}
          </div>
        )}
      </nav>

      <main className="mt-24 px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-4">About This Portal</h1>
          <p className="text-gray-200 mb-4">
            GIM Lost & Found is a community-driven portal to help students and staff quickly report, find, and claim items on campus.
          </p>
          <p className="text-gray-300">
            Built with a focus on security and reliability, it ensures verified listings, safe claim management, and faster reunions with belongings.
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;
