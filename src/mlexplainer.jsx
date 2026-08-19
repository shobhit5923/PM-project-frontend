import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Brain, Zap, CheckCircle, TrendingUp } from 'lucide-react';
import logo from './assets/logo1.png';

const MLExplainer = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scoringFactors = [
    { name: 'Category Match', points: 10, desc: 'Phone vs Phone = Match ✓' },
    { name: 'Brand Similarity', points: 10, desc: 'Apple vs Apple = Match ✓' },
    { name: 'Model Alignment', points: 10, desc: 'iPhone 13 vs iPhone 13 = Match ✓' },
    { name: 'Color Verification', points: 5, desc: 'White vs White = Match ✓' },
    { name: 'Serial/IMEI ID', points: 40, desc: 'Exact match (highest confidence)' },
    { name: 'Location Proximity', points: 10, desc: 'Campus Library = Same Campus ✓' },
    { name: 'Time Window', points: 5, desc: 'Lost & Found within 24 hours' },
  ];

  const aiFeatures = [
    {
      icon: <Brain size={24} />,
      title: 'Semantic Understanding',
      desc: 'AI reads item descriptions naturally, understanding "iphone" = "apple phone" = "ios device"',
    },
    {
      icon: <Zap size={24} />,
      title: 'Base Score Calculation',
      desc: 'Computes match points (0-95) based on category, brand, model, color, serial, location & time',
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Gemini 2.5 Flash Model',
      desc: 'Google\'s latest AI analyzes both descriptions and returns 0-1 probability of match',
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'Verification Questions',
      desc: 'AI generates questions to verify ownership (e.g., "What color is the charging port?")',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1D36] text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
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

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">🤖 AI-Powered Matching Engine</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Our machine learning model intelligently matches lost and found items using semantic understanding, rule-based scoring, and advanced AI analysis.
          </p>
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {aiFeatures.map((feature, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Scoring System */}
        <div className="bg-gradient-to-br from-[#0A1A2F] to-[#050E1A] border border-white/10 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8">📊 Base Score Calculation (0-95 points)</h2>
          
          <div className="space-y-3">
            {scoringFactors.map((factor, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex-1">
                  <h4 className="font-semibold">{factor.name}</h4>
                  <p className="text-sm text-gray-400">{factor.desc}</p>
                </div>
                <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg font-bold">
                  +{factor.points}
                </div>
              </div>
            ))}
            
            <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl border border-green-500/30 mt-6">
              <h4 className="font-semibold text-lg">Maximum Base Score</h4>
              <div className="text-2xl font-bold text-green-400">95 points</div>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 border border-blue-500/30 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">🧠 Semantic AI Analysis</h2>
          <p className="text-gray-300 mb-6">
            After base score calculation, Google's Gemini 2.5 Flash AI analyzes the full descriptions:
          </p>
          
          <div className="space-y-4">
            <div className="bg-black/20 p-4 rounded-lg border border-blue-500/20">
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Input:</span> "White Apple iPhone 13 with small scratch on back. Lost near library."
              </p>
            </div>
            
            <div className="text-center text-gray-400">↓ AI Processing ↓</div>
            
            <div className="bg-black/20 p-4 rounded-lg border border-blue-500/20">
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Output Probability:</span> 0.87 (87% match confidence)
              </p>
            </div>
          </div>
          
          <p className="text-gray-300 mt-6">
            This semantic score (0-100) combines with the base score to produce the <span className="font-bold text-yellow-400">Final Match Score</span>.
          </p>
        </div>

        {/* Final Score */}
        <div className="bg-gradient-to-br from-yellow-900/20 to-blue-900/20 border border-blue-500/30 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">✨ Final Score Formula</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="bg-white/5 p-6 rounded-xl flex-1 border border-white/10">
                <p className="text-gray-400 text-sm mb-2">Base Score</p>
                <p className="text-3xl font-bold text-green-400">0 - 95</p>
              </div>
              
              <div className="text-3xl font-bold text-gray-400">+</div>
              
              <div className="bg-white/5 p-6 rounded-xl flex-1 border border-white/10">
                <p className="text-gray-400 text-sm mb-2">Semantic AI Score</p>
                <p className="text-3xl font-bold text-blue-400">0 - 5</p>
              </div>
              
              <div className="text-3xl font-bold text-gray-400">=</div>
              
              <div className="bg-gradient-to-br from-yellow-500/20 to-red-500/20 p-6 rounded-xl flex-1 border border-yellow-500/30">
                <p className="text-gray-400 text-sm mb-2">Final Score</p>
                <p className="text-3xl font-bold text-yellow-400">0 - 100</p>
              </div>
            </div>

            <div className="bg-black/20 p-6 rounded-xl border border-white/10">
              <h3 className="font-semibold mb-3">Score Interpretation:</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><span className="text-red-400">0-50:</span> Low confidence - Manual review needed</li>
                <li><span className="text-yellow-400">50-70:</span> Medium confidence - Verification questions required</li>
                <li><span className="text-green-400">70-85:</span> High confidence - Likely match, verify ownership</li>
                <li><span className="text-green-300 font-bold">85-100:</span> Very high confidence - Strong match detected</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Verification Phase */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">🔐 Ownership Verification Phase</h2>
          
          <p className="text-gray-300 mb-6">
            For high-scoring matches, AI generates questions based on item-specific details:
          </p>

          <div className="space-y-3">
            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
              <p className="text-sm text-gray-300">❓ "What is the serial number on the back?"</p>
            </div>
            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
              <p className="text-sm text-gray-300">❓ "Describe any damage or unique markings"</p>
            </div>
            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
              <p className="text-sm text-gray-300">❓ "What accessories came with this item?"</p>
            </div>
          </div>

          <p className="text-gray-300 mt-6">
            Correct answers earn verification bonus points. If final score reaches <span className="font-bold text-green-400">85+</span>, the match is marked <span className="font-bold">VERIFIED</span> ✓
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 py-8 px-6 bg-[#071422]">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-400">
          <p>This AI-powered matching system ensures accurate item reunification while maintaining user privacy.</p>
          <p className="mt-2">© 2026 GIM Lost & Found. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MLExplainer;
