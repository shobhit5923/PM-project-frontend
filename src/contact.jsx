import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from './assets/logo1.png';

const Contact = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="font-sans min-h-screen flex flex-col" style={{ backgroundColor: '#0B1D36', color: '#ffffff' }}>
      <nav className="flex justify-between items-center px-8 py-5 w-full border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-lg hidden md:block">GIM Lost & Found</span>
        </Link>

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
          <div className="absolute top-16 left-0 w-full bg-[#0F2744] shadow-lg flex flex-col items-center py-4 space-y-4 md:hidden border-t border-blue-900 z-50">
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

      <main className="mt-12 px-6 py-12 flex-grow">
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-200 mb-6">
            Reach out for support, feedback, or questions about the Lost & Found portal.
          </p>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white w-24">Email:</span>
              <a href="mailto:technology@gim.ac.in" className="text-blue-300 hover:underline">technology@gim.ac.in</a>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white w-24">Office:</span>
              <span>Old Academic Block, GIM</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white w-24">Hours:</span>
              <span>Mon–Fri, 9:00 AM – 5:00 PM</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 px-6 border-t border-white/5 bg-[#071422] text-xs text-gray-500 text-center">
        <p>© 2026 Goa Institute of Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;
