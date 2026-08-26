import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo1.png";
import { 
  Menu, 
  X, 
  Wifi, 
  FileText, 
  Zap, 
  Grid, 
  ChevronRight, 
  Home, 
  Info, 
  PlusCircle, 
  FileCheck, 
  BookOpen, 
  LogOut,
  Share2,
  User,
} from 'lucide-react';

const ServicesGuidelines = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [currentUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const colors = {
    bg: '#0B1D36',       
    card: '#0A1A2F',     
    cardHover: '#0F2744',
    accent: '#3B82F6',   
    text: '#ffffff',
    textMuted: '#d1d5db'
  };

  const services = [
    {
      title: "Report Lost",
      desc: "Report a lost item immediately. Provide details and allow our AI to help match your report with found items.",
      btnText: "Report",
      route: "/reportlost",
      icon: <Wifi className="w-8 h-8 text-white" /> 
    },
    {
      title: "Report Found",
      desc: "If you've found something, help return it to its owner. Log it here so we can notify potential matches.",
      btnText: "Report",
      route: "/reportfound",
      icon: <FileText className="w-8 h-8 text-white" />
    },
    {
      title: "Browse Items",
      desc: "Looking for something? Browse through all reported lost and found items currently in our database.",
      btnText: "Browse Items",
      route: "/browseitems",
      icon: <Grid className="w-8 h-8 text-white" />
    },
    {
      title: "Claim Management",
      desc: "Already submitted a report? Track and manage the status of your claims here.",
      btnText: "Track",
      route: "/claimmng",
      icon: <Zap className="w-8 h-8 text-white" />
    }
  ];

  const sidebarItems = [
    { icon: <Home size={18} />, label: "Home", route: "/" },
    { icon: <Info size={18} />, label: "About", route: "/about" },
    { icon: <PlusCircle size={18} />, label: "Report Lost/Found", route: "/reportlost" },
    { icon: <FileCheck size={18} />, label: "My Reports", route: "/claimmng" },
    { icon: <BookOpen size={18} />, label: "Guidelines", active: true },
    { icon: <LogOut size={18} />, label: "Log Out", action: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }},
  ];

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: colors.bg, color: colors.text }}>
      
      {/* --- Navbar --- */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link to="/" className="hover:text-blue-300 transition">Home</Link>
          <Link to="/services" className="hover:text-blue-300 transition">Services</Link>
          <Link to="/browseitems" className="hover:text-blue-300 transition">Browse Items</Link>
          <Link to="/claimmng" className="hover:text-blue-300 transition">Claim Management</Link>
          <Link to="/contact" className="hover:text-blue-300 transition">Contact</Link>
          <Link to="/notifications" className="hover:text-blue-300 transition">Notifications</Link>
          <Link to="/about" className="hover:text-blue-300 transition">About</Link>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold shadow-sm">
              <User size={14} className="text-blue-400" />
              <span>{currentUser.name || currentUser.email}</span>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition">
              <User size={14} />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-[#0F2744] shadow-lg flex flex-col items-center py-4 space-y-4 md:hidden border-t border-blue-900 z-50">
            <Link to="/" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/services" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link to="/browseitems" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Browse Items</Link>
            <Link to="/claimmng" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Claim Management</Link>
            <Link to="/contact" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <Link to="/notifications" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Notifications</Link>
            <Link to="/about" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>About</Link>
          </div>
        )}
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-grow px-6 py-12 max-w-7xl mx-auto w-full">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide">Services</h1>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="relative p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-[#0A1A2F] to-[#050E1A] hover:border-blue-500/30 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 mb-6 rounded-full border border-white/10 flex items-center justify-center bg-white/5 relative">
                  <div className="absolute inset-0 rounded-full border border-white/5 scale-125"></div>
                  <div className="absolute inset-0 rounded-full border border-white/5 scale-150"></div>
                  {service.icon}
                </div>

                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-md">
                  {service.desc}
                </p>

                <Link to={service.route}>
                  <button className="flex items-center px-6 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition group-hover:scale-105">
                    <span className="text-sm font-semibold uppercase tracking-wider mr-2">
                      {service.btnText}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:bg-black group-hover:text-white">
                      <ChevronRight size={14} />
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Guidelines Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">Guidelines <span className="text-gray-400">&</span> Best Practices</h2>
          <p className="text-gray-400 text-sm">Help us maintain a safe and fair platform by keeping these practices in mind.</p>
        </div>

        {/* Guidelines Layout (Sidebar + Content) */}
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-4">
            {sidebarItems.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  if (item.action) item.action();
                  else if (item.route) navigate(item.route);
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  item.active 
                    ? 'bg-[#163A66] border-blue-500/50 text-white shadow-lg' 
                    : 'bg-transparent border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-grow">
            
            {/* Guidelines List */}
            <div className="mb-10">
              <h3 className="text-xl font-bold mb-6 border-l-4 border-blue-500 pl-4">Guidelines</h3>
              <ul className="space-y-3 text-gray-300 text-sm leading-relaxed list-disc pl-5 marker:text-blue-500">
                <li>Register lost items immediately to increase the chances of retrieval.</li>
                <li>Always provide accurate details (item description, location, time) to help verification.</li>
                <li>Be patient. The verification process may take up to 24 hours.</li>
                <li>Admin decisions on verification and claim approval are final.</li>
                <li>Items not claimed within 180 days will be handled by the administration.</li>
              </ul>
            </div>

            {/* Best Practices Box */}
            <div className="rounded-2xl border border-white/10 bg-[#0F2744] p-8">
              <h3 className="text-xl font-bold mb-6">Best Practices</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Do's */}
                <div>
                  <h4 className="font-bold text-green-400 mb-4 text-sm uppercase tracking-wide">Do's</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-green-400 rounded-full"></span>
                      Provide clear and detailed descriptions when reporting an item.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-green-400 rounded-full"></span>
                      Check the portal regularly for updates on lost/found items.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-green-400 rounded-full"></span>
                      Use your official university email for claims and reports.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-green-400 rounded-full"></span>
                      Answer verification questions honestly when claiming an item.
                    </li>
                  </ul>
                </div>

                {/* Don'ts */}
                <div>
                  <h4 className="font-bold text-red-400 mb-4 text-sm uppercase tracking-wide">Don'ts</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-red-400 rounded-full"></span>
                      Don't post false claims or take items not belonging to you.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-red-400 rounded-full"></span>
                      Don't use vague descriptions like "black pen" — be specific.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-red-400 rounded-full"></span>
                      Don't spam multiple reports for the same item.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-red-400 rounded-full"></span>
                      Don't try to bypass the admin verification process.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="mt-auto py-8 px-6 border-t border-white/5 bg-[#071422] text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded flex items-center justify-center">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <p>© 2026 Goa Institute of Management. All rights reserved.</p>
          </div>

          <div className="flex gap-6">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
            <Link to="/ai-matching" className="hover:text-white">AI Engine</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServicesGuidelines;