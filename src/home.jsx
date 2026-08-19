import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo1.png";

import { 
  Search, 
  Menu, 
  X, 
  Zap, 
  ShieldCheck, 
  LayoutGrid, 
  Smartphone, 
  UserCheck, 
  Filter, 
  ChevronRight
} from 'lucide-react';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [faqQuery, setFaqQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  const brandColors = {
    primary: '#0B1D36',
    secondary: '#1E4A7A',
    accent: '#A8C5E2',
    text: '#ffffff',
    cardBg: 'rgba(255, 255, 255, 0.05)'
  };

  const features = [
    {
      icon: <Zap size={24} />,
      title: "Quick & Easy Reporting",
      desc: "Report lost or found items instantly through our streamlined, user-friendly portal.",
      route: "/reportlost"
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Secure Claim Verification",
      desc: "Robust security measures to ensure items are returned to their rightful owners.",
      route: "/claimmng"
    },
    {
      icon: <LayoutGrid size={24} />,
      title: "Organized Categories",
      desc: "Find items easily with our comprehensive sorting and categorization system.",
      route: "/browseitems"
    },
    {
      icon: <Smartphone size={24} />,
      title: "University-Only Access",
      desc: "Only students & staff with @gim.ac.in IDs can access, creating a safer community.",
      route: "/about"
    },
    {
      icon: <UserCheck size={24} />,
      title: "Admin-Verified Listings",
      desc: "Every item uploaded is checked and verified by admins to maintain quality.",
      route: "/claimmng"
    },
    {
      icon: <Filter size={24} />,
      title: "Smart Search & Filters",
      desc: "Find lost items quickly with advanced search and filtering by date, category, and location.",
      route: "/browseitems"
    }
  ];

  const faqs = [
    { q: "How do I report a lost item?", a: "Go to the 'Report Lost Item' section, log in with your email ID, and fill out the item details." },
    { q: "What categories of items can I report?", a: "Electronics, IDs, accessories, books, clothing, and more." },
    { q: "How do I claim a found item?", a: "Browse the 'Browse Items' section, identify your item, and click 'Claim' to start verification." },
    { q: "Can I edit or delete my lost item report?", a: "Yes, from the Claim Management dashboard anytime before the item is resolved." },
    { q: "Who can use the portal?", a: "Goa Institute of Management students and staff with a valid @gim.ac.in email." },
    { q: "Is my data secure?", a: "Yes, we use industry-standard encryption and secure token authentication." },
    { q: "How long are items kept?", a: "Items are kept for 6 months before archiving or donating." },
    { q: "What should I do if I find an item on campus?", a: "Report it immediately using 'Report Found Item' and hand it to security." },
  ];

  const filteredFaqs = faqs.filter(f => 
    !faqQuery || f.q.toLowerCase().includes(faqQuery.toLowerCase()) || f.a.toLowerCase().includes(faqQuery.toLowerCase())
  );

  return (
    <div 
      className="font-sans min-h-screen flex flex-col"
      style={{ backgroundColor: brandColors.primary, color: brandColors.text }}
    >
      
      {/* --- Navigation --- */}
      <nav className="absolute top-0 left-0 w-full z-20 px-6 py-4 flex justify-between items-center bg-transparent">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
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

      {/* --- Hero Section --- */}
      <header className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/campus.jpg"
            alt="University Campus"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D36]/20 via-transparent to-[#0B1D36]/30 z-10"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mt-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-lg">
            GIM Lost & Found
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Securely report lost and found items on the Goa Institute of Management campus.
            Reconnect with your belongings faster and easier than ever before.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          {isLoggedIn ? (
            <>
              <Link to="/reportlost">
                <button className="bg-white text-[#0B1D36] font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1">
                  Report Lost Item
                </button>
              </Link>
              <Link to="/browseitems">
                <button className="bg-[#1D5FA8] border border-blue-400 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#2B7BC7] transition transform hover:-translate-y-1">
                  Browse Items
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-white text-[#0B1D36] font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-[#1D5FA8] border border-blue-400 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#2B7BC7] transition transform hover:-translate-y-1">
                  Sign Up
                </button>
              </Link>
            </>
          )}
          </div>
        </div>
      </header>

      {/* ----- FEATURES SECTION ----- */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose GIM Lost & Found?</h2>
            <p className="text-gray-400 text-sm uppercase tracking-widest">Making Campus Life Easier and Stress-Free</p>
            <Link to="/ai-matching" className="inline-block mt-6 px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs hover:bg-blue-600/30 transition">🤖 Learn About Our AI Matching Engine →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-900 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {feature.desc}
                </p>
                <button 
                  onClick={() => navigate(feature.route)}
                  className="flex items-center text-xs font-bold uppercase tracking-wider text-blue-300 hover:text-white transition"
                >
                  Learn More 
                  <div className="ml-2 bg-white/20 rounded-full p-1">
                    <ChevronRight size={12}/>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----- FAQ SECTION ----- */}
      <section className="py-20 px-6 bg-[#0F2744]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Have questions? Find answers to common queries below.
            </p>

            <div className="relative max-w-md mx-auto">
              <input 
                type="text"
                value={faqQuery}
                onChange={(e) => setFaqQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full py-3 pl-5 pr-12 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-800 rounded-full text-white hover:bg-blue-700">
                <Search size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="flex items-start justify-between py-4 border-b border-white/10">
                  <div className="pr-4">
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-blue-300 transition">
                      {faq.q}
                    </h4>
                    <p className="text-gray-400 text-sm hidden group-hover:block transition-all duration-500">
                      {faq.a}
                    </p>
                  </div>
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white transition">
                    <div className="w-2 h-2 bg-transparent group-hover:bg-[#0B1D36] rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ----- FOOTER ----- */}
      <footer className="pt-16 pb-8 px-6 bg-[#071422] text-gray-300 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="col-span-2 lg:col-span-1">
            <div className="w-8 h-8 rounded flex items-center justify-center">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Official Lost & Found portal for Goa Institute of Management.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="font-bold text-white mb-2">Home</h4>
            <Link to="/" className="hover:text-blue-400">Overview</Link>
            <Link to="/about" className="hover:text-blue-400">About Portal</Link>
            <Link to="/contact" className="hover:text-blue-400">Contact Us</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="font-bold text-white mb-2">Services</h4>
            <Link to="/reportlost" className="hover:text-blue-400">Report Lost Item</Link>
            <Link to="/reportfound" className="hover:text-blue-400">Report Found Item</Link>
            <Link to="/browseitems" className="hover:text-blue-400">Search Database</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="font-bold text-white mb-2">Claim Mgmt</h4>
            <Link to="/claimmng" className="hover:text-blue-400">Verify Ownership</Link>
            <Link to="/claimmng" className="hover:text-blue-400">Track Matches</Link>
            <Link to="/notifications" className="hover:text-blue-400">Notifications</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="font-bold text-white mb-2">About & AI</h4>
            <Link to="/about" className="hover:text-blue-400">Purpose of Portal</Link>
            <Link to="/ai-matching" className="hover:text-blue-400">AI Matching Engine</Link>
            <Link to="/contact" className="hover:text-blue-400">Support</Link>
          </div>

        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-gray-500">
          <p>© 2026 Goa Institute of Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
