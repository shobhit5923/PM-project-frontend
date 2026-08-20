import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './assets/logo1.png';
import { ArrowRight, Loader, CheckCircle2, AlertCircle, Menu, X } from 'lucide-react';
import { API_ENDPOINTS, fetchAPI } from './config/api';

const ReportLostPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Form State
  const [category, setCategory] = useState('');
  const [itemName, setItemName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  const colors = {
    bg: '#0B1D36',
    cardBg: '#0F2744',
    text: '#ffffff',
    accent: '#3B82F6',
  };

  const handleReportLost = async () => {
    if (!category || !description) {
      setError('Please fill in required fields (Category and Description)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullDescription = [
        itemName ? `Name: ${itemName}` : '',
        description,
      ].filter(Boolean).join('\n');

      const data = await fetchAPI(API_ENDPOINTS.REPORT_LOST, {
        method: 'POST',
        body: JSON.stringify({
          type: 'LOST',
          category,
          brand: brand || null,
          model: model || null,
          color: color || null,
          uniqueIdentifier: uniqueIdentifier || null,
          description: fullDescription,
          locationText: 'Campus',
          dateTime: new Date().toISOString(),
          dateLostFound: new Date().toISOString(),
        }),
      });

      if (data.matches && data.matches.length > 0) {
        setMatches(data.matches);
      }
      setStep(3);
    } catch (err) {
      console.error('Error creating report:', err);
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col items-center justify-start pt-28 pb-16 px-4 overflow-y-auto font-sans" 
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/campus.jpg" alt="Campus" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-[#0B1D36]/80 mix-blend-multiply"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 w-full z-30 flex justify-between items-center px-8 py-4 bg-[#0B1D36]/80 backdrop-blur-md border-b border-white/10">
        <Link to="/" className="w-10 h-10 flex items-center justify-center cursor-pointer">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </Link>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-200">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/services" className="hover:text-white transition">Services</Link>
          <Link to="/browseitems" className="hover:text-white transition">Browse Items</Link>
          <Link to="/claimmng" className="hover:text-white transition">Claim Management</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
          <Link to="/notifications" className="hover:text-white transition">Notifications</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

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

      {/* Glass Card Container */}
      <div className="relative z-10 w-full max-w-2xl p-8 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-md bg-white/10 my-auto">

        {/* Step 1: Form */}
        {step === 1 && (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-3xl font-bold text-white">Report Lost Item</h2>
              <p className="text-blue-200/80 text-sm mt-1">Help us find your lost item using AI matching</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Category */}
              <div className="relative group">
                <label className="block text-sm font-medium text-white mb-2">Item Category *</label>
                <input 
                  type="text" 
                  placeholder="e.g., Electronics, Books, Accessories"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white/20 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Item Name */}
              <div className="relative group">
                <label className="block text-sm font-medium text-white mb-2">Item Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., iPhone 13 Pro"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white/20 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Brand */}
              <div className="relative group">
                <label className="block text-sm font-medium text-white mb-2">Brand</label>
                <input 
                  type="text" 
                  placeholder="e.g., Apple, Samsung"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white/20 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Model */}
              <div className="relative group">
                <label className="block text-sm font-medium text-white mb-2">Model</label>
                <input 
                  type="text" 
                  placeholder="e.g., iPhone 13 Pro, Galaxy S23"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white/20 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Color */}
              <div className="relative group">
                <label className="block text-sm font-medium text-white mb-2">Color</label>
                <input 
                  type="text" 
                  placeholder="e.g., Black, Silver"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white/20 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="relative group">
                <label className="block text-sm font-medium text-white mb-2">Description *</label>
                <textarea 
                  placeholder="Describe your lost item in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-white/20 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Unique Identifier */}
              <div className="relative group">
                <label className="block text-sm font-medium text-white mb-2">Serial Number / IMEI (if applicable)</label>
                <input 
                  type="text" 
                  placeholder="e.g., IMEI or serial number"
                  value={uniqueIdentifier}
                  onChange={(e) => setUniqueIdentifier(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white/20 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <AlertCircle size={18} className="text-red-400" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <button 
                onClick={handleReportLost}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                {loading ? 'Searching for matches...' : 'Report & Find Matches'}
              </button>
            </form>
          </>
        )}

        {/* Step 2: Matching */}
        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size={48} className="text-white animate-spin mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Analyzing...</h3>
            <p className="text-gray-300">Using AI to find matches with found items...</p>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <>
            <div className="flex flex-col items-center mb-8">
              <CheckCircle2 size={48} className="text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-white">Report Submitted!</h2>
              <p className="text-gray-300 text-sm mt-2">AI Analysis Complete</p>
            </div>

            {matches.length > 0 ? (
              <div className="space-y-4 mb-6">
                <h3 className="text-white font-semibold">Potential Matches Found:</h3>
                {matches.map((match, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-white/10 border border-white/20">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">Match {idx + 1}</h4>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300">
                        {Math.round(match.score || 0)} Match Score
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {match.category ? `${match.category}${match.brand ? ` · ${match.brand}` : ''} — ` : ''}
                      {match.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-6">
                <p className="text-blue-200">No matches found yet. We'll notify you if matches appear later.</p>
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setStep(1);
                  setItemName('');
                  setDescription('');
                  setCategory('');
                  setBrand('');
                  setModel('');
                  setColor('');
                  setUniqueIdentifier('');
                  setMatches([]);
                  setError('');
                }}
                className="flex-1 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition cursor-pointer"
              >
                Report Another Item
              </button>
              <button 
                onClick={() => navigate('/claimmng')}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition cursor-pointer"
              >
                View Matches & Claims
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportLostPage;