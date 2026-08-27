import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo1.png";
import {
  Menu,
  X,
  Search,
  Filter,
  ChevronDown,
  Clock,
  MapPin,
  Tag,
  User,
} from 'lucide-react';
import { API_ENDPOINTS, fetchAPI } from './config/api';
import { trackEvent } from './config/mixpanel';

const BrowseItemsPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('NEWEST');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  // Brand Palette
  const colors = {
    bg: '#0B1D36',
    cardBg: '#0F2744',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    text: '#ffffff',
    muted: '#9ca3af',
    accent: '#3B82F6'
  };

  const categories = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Books', value: 'books' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'ID / Cards', value: 'id' },
    { label: 'Keys', value: 'keys' },
  ];

  const dateOptions = [
    { label: 'Newest First', value: 'NEWEST' },
    { label: 'Oldest First', value: 'OLDEST' },
    { label: 'Past 7 Days', value: 'PAST_7_DAYS' },
    { label: 'Past 30 Days', value: 'PAST_30_DAYS' },
  ];

  const statusOptions = [
    { label: 'All Reports', value: 'ALL' },
    { label: 'Lost Items', value: 'LOST' },
    { label: 'Found Items', value: 'FOUND' },
    { label: 'My Reported Lost', value: 'MY_LOST' },
    { label: 'My Reported Found', value: 'MY_FOUND' },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchAPI(API_ENDPOINTS.GET_ALL_REPORTS);

        try {
          const matchesData = await fetchAPI(API_ENDPOINTS.GET_MY_MATCHES);
          const itemsWithMatches = (data || []).map(item => {
            const match = matchesData?.find(
              m => m.lostReportId === item.id || m.foundReportId === item.id
            );
            return {
              ...item,
              matchScore: match?.finalScore ?? null,
              hasMatch: !!match
            };
          });
          if (!cancelled) setItems(itemsWithMatches);
        } catch {
          if (!cancelled) setItems(data || []);
        }

        if (!cancelled) setError('');
      } catch (err) {
        console.error('Error fetching items:', err);
        if (!cancelled) {
          setError('Failed to load items');
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleStatusFilterChange = (filterVal) => {
    setStatusFilter(filterVal);
    trackEvent('Browse Filter Changed', { filterVal });
  };

  const filteredItems = items
    .filter((item) => {
      // Search Query filter
      const matchesSearch =
        !searchQuery ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === 'ALL' ||
        item.category?.toLowerCase().includes(selectedCategory.toLowerCase());

      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'ALL') {
        matchesStatus = true;
      } else if (statusFilter === 'LOST') {
        matchesStatus = item.type === 'LOST';
      } else if (statusFilter === 'FOUND') {
        matchesStatus = item.type === 'FOUND';
      } else if (statusFilter === 'MY_LOST') {
        matchesStatus = item.type === 'LOST' && Number(item.userId) === Number(currentUser?.id);
      } else if (statusFilter === 'MY_FOUND') {
        matchesStatus = item.type === 'FOUND' && Number(item.userId) === Number(currentUser?.id);
      }

      // Date range filter
      let matchesDate = true;
      const itemTime = new Date(item.dateLostFound || item.createdAt).getTime();
      if (dateFilter === 'PAST_7_DAYS') {
        matchesDate = Date.now() - itemTime <= 7 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === 'PAST_30_DAYS') {
        matchesDate = Date.now() - itemTime <= 30 * 24 * 60 * 60 * 1000;
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dateLostFound || a.createdAt).getTime();
      const dateB = new Date(b.dateLostFound || b.createdAt).getTime();
      return dateFilter === 'OLDEST' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: colors.bg, color: colors.text }}>
      
      {/* --- Navbar --- */}
      <nav className="flex justify-between items-center px-8 py-5 w-full border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 flex items-center justify-center">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/services" className="hover:text-white transition">Services</Link>
          <Link to="/browseitems" className="hover:text-white transition">Browse Items</Link>
          <Link to="/claimmng" className="hover:text-white transition">Claim Management</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
          <Link to="/notifications" className="hover:text-white transition">Notifications</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
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
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
        
        {/* Title & Description */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Browse Items</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Explore all reported lost and found items. Filter by community reports or your own submitted items.
          </p>
        </div>

        {/* User Quick Filter Pills */}
        {currentUser && (
          <div className="flex justify-center mb-8">
            <div className="flex bg-[#0F2744] p-1.5 rounded-xl border border-white/10 text-xs font-medium shadow-inner">
              <button
                onClick={() => handleStatusFilterChange('ALL')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-blue-600 text-white shadow-md font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🌐 All Community Reports
              </button>
              <button
                onClick={() => handleStatusFilterChange('MY_LOST')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'MY_LOST'
                    ? 'bg-blue-600 text-white shadow-md font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📌 My Reported Lost
              </button>
              <button
                onClick={() => handleStatusFilterChange('MY_FOUND')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'MY_FOUND'
                    ? 'bg-blue-600 text-white shadow-md font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📦 My Reported Found
              </button>
            </div>
          </div>
        )}

        {/* Search & Filters Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between p-4 bg-[#0F2744]/50 rounded-2xl border border-white/10 backdrop-blur-sm">
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl leading-5 bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Search by item name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Working Dropdown Filters */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
            
            {/* Category Filter */}
            <div className="relative flex items-center bg-white/5 border border-white/20 rounded-xl px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 transition">
              <Filter size={16} className="mr-2 text-blue-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer pr-4 appearance-none"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[#0B1D36] text-white">
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none text-gray-400" />
            </div>

            {/* Date Filter */}
            <div className="relative flex items-center bg-white/5 border border-white/20 rounded-xl px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 transition">
              <Clock size={16} className="mr-2 text-blue-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer pr-4 appearance-none"
              >
                {dateOptions.map((d) => (
                  <option key={d.value} value={d.value} className="bg-[#0B1D36] text-white">
                    {d.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none text-gray-400" />
            </div>

            {/* Status Filter */}
            <div className="relative flex items-center bg-white/5 border border-white/20 rounded-xl px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 transition">
              <Tag size={16} className="mr-2 text-blue-400" />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer pr-4 appearance-none"
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value} className="bg-[#0B1D36] text-white">
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none text-gray-400" />
            </div>

          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading items...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {statusFilter === 'MY_LOST'
                ? 'You have not reported any lost items yet.'
                : statusFilter === 'MY_FOUND'
                ? 'You have not reported any found items yet.'
                : 'No items match your selected filters. Try clearing filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                style={{ borderColor: colors.cardBorder }} 
                className={`rounded-2xl border bg-[#0F2744]/50 p-6 backdrop-blur-sm hover:bg-[#0F2744]/70 transition-all duration-200 cursor-pointer ${item.hasMatch ? 'ring-2 ring-green-500/30' : ''}`}
                onClick={() => navigate('/claimmng')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.type === 'LOST' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {item.type || 'Item'}
                    </span>
                    {currentUser && Number(item.userId) === Number(currentUser.id) && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                        Yours
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-500">{new Date(item.dateLostFound || item.createdAt).toLocaleDateString()}</span>
                    {item.hasMatch && item.matchScore && (
                      <div className="flex flex-col items-end">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-300">
                          🤖 {Math.min(100, Math.round(item.matchScore))}% AI Match
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{item.category || 'Unknown Item'}</h3>
                {item.brand && <p className="text-sm text-gray-400 mb-1">Brand: {item.brand}</p>}
                {item.color && <p className="text-sm text-gray-400 mb-2">Color: {item.color}</p>}
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin size={16} className="text-blue-400" />
                    <span>{item.locationText || 'Campus'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock size={16} className="text-blue-400" />
                    <span>{new Date(item.dateLostFound || item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/claimmng');
                  }}
                  className={`w-full py-2.5 rounded-xl border ${item.hasMatch ? 'border-green-500 bg-green-500/10 text-green-300' : 'border-white/20'} hover:bg-white hover:text-[#0B1D36] text-white text-sm font-medium transition-all duration-200`}
                >
                  {item.hasMatch ? 'View Match Details' : 'View Claim Details'}
                </button>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* --- Footer --- */}
      <footer className="bg-[#071422] pt-16 pb-8 px-6 text-sm border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12 text-gray-400">
          <div className="col-span-2 md:col-span-1">
             <h4 className="font-bold text-white mb-4">Navigation</h4>
             <ul className="space-y-2">
               <li><Link to="/" className="hover:text-blue-400">Home Overview</Link></li>
               <li><Link to="/about" className="hover:text-blue-400">About Portal</Link></li>
               <li><Link to="/contact" className="hover:text-blue-400">Contact Us</Link></li>
             </ul>
          </div>
          <div>
             <h4 className="font-bold text-white mb-4">Services</h4>
             <ul className="space-y-2">
               <li><Link to="/reportlost" className="hover:text-blue-400">Report Lost Item</Link></li>
               <li><Link to="/reportfound" className="hover:text-blue-400">Report Found Item</Link></li>
               <li><Link to="/browseitems" className="hover:text-blue-400">Browse Items</Link></li>
             </ul>
          </div>
          <div>
             <h4 className="font-bold text-white mb-4">Claim Management</h4>
             <ul className="space-y-2">
               <li><Link to="/claimmng" className="hover:text-blue-400">Verify Ownership</Link></li>
               <li><Link to="/claimmng" className="hover:text-blue-400">Track Claim Status</Link></li>
               <li><Link to="/notifications" className="hover:text-blue-400">Notification Alerts</Link></li>
             </ul>
          </div>
          <div>
             <h4 className="font-bold text-white mb-4">About Us</h4>
             <ul className="space-y-2">
               <li><Link to="/about" className="hover:text-blue-400">Purpose of Portal</Link></li>
               <li><Link to="/contact" className="hover:text-blue-400">Support</Link></li>
             </ul>
          </div>
          <div>
             <h4 className="font-bold text-white mb-4">Resources</h4>
             <ul className="space-y-2">
               <li><Link to="/services" className="hover:text-blue-400">Student Guidelines</Link></li>
               <li><Link to="/ai-matching" className="hover:text-blue-400">AI Matching Engine</Link></li>
             </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-gray-500">
          <p>© 2026 Goa Institute of Management - Lost & Found. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <span>Version 1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BrowseItemsPage;