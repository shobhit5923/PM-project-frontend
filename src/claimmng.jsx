import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Loader,
  User,
} from "lucide-react";
import logo from "./assets/logo1.png";
import { API_ENDPOINTS, fetchAPI } from './config/api';
import { trackEvent } from './config/mixpanel';

const ClaimDetails = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedMatch, setExpandedMatch] = useState(null);
  const [verifyingMatchId, setVerifyingMatchId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verifiedMatch, setVerifiedMatch] = useState(null);
  const [filterType, setFilterType] = useState('LOST'); // 'LOST' | 'FOUND' | 'ALL'

  const [currentUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const fetchMatches = async ({ showLoading = true, type = filterType } = {}) => {
    try {
      if (showLoading) setLoading(true);
      const url = `${API_ENDPOINTS.GET_FOUND_FOR_ME}?type=${type}`;
      const data = await fetchAPI(url);
      setMatches(data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const url = `${API_ENDPOINTS.GET_FOUND_FOR_ME}?type=${filterType}`;
        const data = await fetchAPI(url);
        if (!cancelled) {
          setMatches(data || []);
          setError('');
        }
      } catch (err) {
        console.error('Error fetching matches:', err);
        if (!cancelled) setError('Failed to load matches');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filterType]);

  const handleFilterChange = (type) => {
    setFilterType(type);
    trackEvent('Claim Filter Changed', { type });
  };

  const getMatchScore = (match) => {
    return Math.min(100, Math.round((match.finalScore || 0) * 10) / 10);
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const isVerified = (match) => {
    return match.status === 'VERIFIED' || match.finalScore >= 85;
  };

  const startVerification = async (matchId) => {
    setVerificationLoading(true);
    setVerificationMessage('');
    setVerifyingMatchId(matchId);
    setAnswers({});

    try {
      const existing = matches.find((m) => m.id === matchId)?.questions || [];
      if (existing.length > 0) {
        setQuestions(existing);
      } else {
        const qs = await fetchAPI(`${API_ENDPOINTS.GET_QUESTIONS}/${matchId}/questions`, {
          method: 'POST',
        });
        setQuestions(qs || []);
      }
      trackEvent('Verification Started', { matchId });
    } catch (err) {
      setVerificationMessage(err.message || 'Failed to start verification');
      setVerifyingMatchId(null);
    } finally {
      setVerificationLoading(false);
    }
  };

  const submitAnswers = async (matchId) => {
    const payload = questions.map((q) => ({
      questionId: q.id,
      answer: answers[q.id] || '',
    }));

    if (payload.every((a) => !a.answer.trim())) {
      setVerificationMessage('Please answer at least one question');
      return;
    }

    setVerificationLoading(true);
    setVerificationMessage('');

    try {
      const result = await fetchAPI(`${API_ENDPOINTS.SUBMIT_ANSWERS}/${matchId}/answers`, {
        method: 'POST',
        body: JSON.stringify({ answers: payload }),
      });

      const updatedScore = Math.round(result.finalScore || 0);
      const isClaimVerified = result.status === 'VERIFIED' || updatedScore >= 85;

      setVerificationMessage(
        isClaimVerified
          ? 'Ownership verified! You can collect your device from the IT Office.'
          : `Answers submitted. Updated score: ${updatedScore}`
      );

      trackEvent('Verification Answers Submitted', {
        matchId,
        status: result.status,
        finalScore: result.finalScore,
      });

      if (isClaimVerified) {
        setVerifiedMatch(result);
        setShowSuccessModal(true);
      }

      setVerifyingMatchId(null);
      setQuestions([]);
      await fetchMatches({ showLoading: false });
    } catch (err) {
      setVerificationMessage(err.message || 'Failed to submit answers');
    } finally {
      setVerificationLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-[#0B1D36] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 w-full border-b border-white/5">
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

      {/* Verification Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0D223F] border border-green-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg border border-green-500/30">
              🎉
            </div>
            <h2 className="text-2xl font-bold text-white">Claim Verified!</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your ownership has been successfully verified by our matching engine!
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-left space-y-2 text-xs">
              <p className="text-green-300 font-semibold text-sm">📍 Next Steps / Pickup Location:</p>
              <p className="text-gray-200 leading-relaxed">
                You can collect your device from the <span className="font-bold text-white">IT Office (CR12 / Campus Admin Office)</span> during working hours (9:00 AM - 5:00 PM).
              </p>
              <p className="text-gray-400 italic mt-1">Please present your Student/Staff ID card upon pickup.</p>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition cursor-pointer shadow-md"
            >
              Got it, Thank you!
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow px-6 py-8 max-w-5xl mx-auto w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Claim Management</h1>
            <p className="text-gray-400">Manage matches and verify ownership of your items</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-[#0A1A2F] p-1.5 rounded-xl border border-white/10 text-xs font-medium self-start md:self-auto shadow-inner">
            <button
              onClick={() => handleFilterChange('LOST')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                filterType === 'LOST'
                  ? 'bg-blue-600 text-white shadow-md font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📌 My Lost Items
            </button>
            <button
              onClick={() => handleFilterChange('FOUND')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                filterType === 'FOUND'
                  ? 'bg-blue-600 text-white shadow-md font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📦 My Found Items
            </button>
            <button
              onClick={() => handleFilterChange('ALL')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-blue-600 text-white shadow-md font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🗂️ All Matches
            </button>
          </div>
        </div>

        {verificationMessage && (
          <div className="mb-6 p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-100 text-sm">
            {verificationMessage}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading matches...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-white/10 bg-white/5 p-8">
            <p className="text-gray-400">
              {filterType === 'LOST'
                ? 'No matches found for your reported lost items yet.'
                : filterType === 'FOUND'
                ? 'No matches found for items you reported found yet.'
                : 'No matches found yet. Report an item to get started!'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((match) => (
              <div key={match.id} className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0A1A2F] to-[#050E1A] overflow-hidden backdrop-blur-xl">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-1">Match Found</h2>
                      <p className="text-gray-400 text-sm mb-3">{match.foundReport.category} - {match.foundReport.color}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-300">
                          {isVerified(match)
                            ? `${match.foundReport.description.substring(0, 50)}...`
                            : '[Protected for anti-fraud security]'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(getMatchScore(match))}`}>
                        {getMatchScore(match)}
                      </div>
                      <p className="text-xs text-gray-400">Match Score</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${isVerified(match) ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-300'}`}>
                        {isVerified(match) ? '✓ Claim Verified' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Claim Verified Pickup Banner */}
                {isVerified(match) && (
                  <div className="bg-green-500/10 border-b border-green-500/20 px-6 py-3 flex items-center justify-between text-xs text-green-300">
                    <span className="font-semibold flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-400" /> Ownership Verified! You can collect your device from the IT Office.
                    </span>
                    <button
                      onClick={() => setShowSuccessModal(true)}
                      className="underline font-bold hover:text-green-200 cursor-pointer"
                    >
                      View Pickup Info
                    </button>
                  </div>
                )}

                {/* Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                      <AlertCircle size={14} /> Lost Report Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">Category:</span> <span className="text-white font-medium">{match.lostReport.category}</span></p>
                      <p><span className="text-gray-400">Brand:</span> <span className="text-white font-medium">{match.lostReport.brand || 'N/A'}</span></p>
                      <p><span className="text-gray-400">Color:</span> <span className="text-white font-medium">{match.lostReport.color || 'N/A'}</span></p>
                      <p><span className="text-gray-400">Unique ID:</span> <span className="text-white font-medium">{match.lostReport.uniqueIdentifier || 'N/A'}</span></p>
                      <p><span className="text-gray-400">Date Lost:</span> <span className="text-white font-medium">{new Date(match.lostReport.dateLostFound).toLocaleDateString()}</span></p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={14} /> Found Item Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">Category:</span> <span className="text-white font-medium">{match.foundReport.category}</span></p>
                      <p><span className="text-gray-400">Brand:</span> <span className="text-white font-medium">{match.foundReport.brand || 'N/A'}</span></p>
                      <p><span className="text-gray-400">Color:</span> <span className="text-white font-medium">{match.foundReport.color || 'N/A'}</span></p>
                      <p><span className="text-gray-400">Unique ID:</span> <span className="text-white font-medium">{isVerified(match) ? (match.foundReport.uniqueIdentifier || 'N/A') : '••••••••'}</span></p>
                      <p><span className="text-gray-400">Date Found:</span> <span className="text-white font-medium">{new Date(match.foundReport.dateLostFound).toLocaleDateString()}</span></p>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="px-6 py-4 border-t border-white/10 bg-white/5">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Match Algorithm Breakdown</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category Match:</span>
                      <span className="text-white">{match.lostReport.category === match.foundReport.category ? '✓ Yes (+15)' : '✗ No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Brand Match:</span>
                      <span className="text-white">{match.lostReport.brand && match.foundReport.brand && match.lostReport.brand.toLowerCase() === match.foundReport.brand.toLowerCase() ? '✓ Yes (+10)' : '✗ No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Model Match:</span>
                      <span className="text-white">{match.lostReport.model && match.foundReport.model && match.lostReport.model.toLowerCase() === match.foundReport.model.toLowerCase() ? '✓ Yes (+10)' : '✗ No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Color Match:</span>
                      <span className="text-white">{match.lostReport.color && match.foundReport.color && match.lostReport.color.toLowerCase() === match.foundReport.color.toLowerCase() ? '✓ Yes (+5)' : '✗ No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Serial/IMEI Match:</span>
                      <span className="text-white">{match.lostReport.uniqueIdentifier && match.foundReport.uniqueIdentifier && match.lostReport.uniqueIdentifier === match.foundReport.uniqueIdentifier ? '✓ Match (+40)' : '✗ No ID'}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-semibold">
                      <span className="text-gray-300">Base Score:</span>
                      <span className="text-green-400">{match.baseScore || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Semantic / Similarity Boost:</span>
                      <span className="text-blue-400">{Math.round((match.finalScore - (match.baseScore || 0) - (match.qaBonusScore || 0)) * 10) / 10}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Verification Bonus:</span>
                      <span className="text-yellow-400">{match.qaBonusScore || 0}</span>
                    </div>
                    <div className="flex justify-between font-bold bg-white/10 p-2 rounded mt-2">
                      <span>Final Score:</span>
                      <span className={getScoreColor(getMatchScore(match))}>{getMatchScore(match)}/100</span>
                    </div>
                  </div>
                </div>

                {/* Verification form */}
                {verifyingMatchId === match.id && (
                  <div className="px-6 py-4 border-t border-white/10 bg-white/5 space-y-4">
                    <h4 className="text-sm font-semibold text-white">Answer verification questions</h4>
                    {verificationLoading && questions.length === 0 ? (
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Loader size={16} className="animate-spin" /> Loading questions...
                      </div>
                    ) : (
                      questions
                        /*
                         * To re-enable rendering of personal contents / identifying details question,
                         * remove the filter below.
                         */
                        .filter((q) => {
                          const text = (q.questionText || q.question || '').toLowerCase();
                          const isPersonalContentsQ = text.includes('personal content') || text.includes('identifying detail');
                          return !isPersonalContentsQ;
                        })
                        .map((q) => (
                          <div key={q.id}>
                            <label className="block text-sm text-gray-300 mb-1">
                              {q.questionText || q.question}
                              <span className="ml-2 text-xs text-gray-500">({q.sensitivity})</span>
                            </label>
                            <input
                              type="text"
                              value={answers[q.id] || ''}
                              onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white text-sm"
                              placeholder="Your answer"
                            />
                          </div>
                        ))
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setVerifyingMatchId(null);
                          setQuestions([]);
                        }}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => submitAnswers(match.id)}
                        disabled={verificationLoading || questions.length === 0}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium transition"
                      >
                        {verificationLoading ? 'Submitting...' : 'Submit Answers'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="p-6 flex gap-3 border-t border-white/10">
                  <button 
                    onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition"
                  >
                    {expandedMatch === match.id ? 'Hide Details' : 'View Details'}
                  </button>
                  {!isVerified(match) && verifyingMatchId !== match.id && (
                    Number(match.lostReport?.userId) === Number(currentUser?.id) ? (
                      <button
                        onClick={() => startVerification(match.id)}
                        disabled={verificationLoading}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium transition cursor-pointer"
                      >
                        Start Verification
                      </button>
                    ) : (
                      <div className="flex-1 py-2.5 px-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center justify-center text-center font-medium">
                        📦 You reported this item as found. Waiting for lost owner to verify ownership.
                      </div>
                    )
                  )}
                </div>

                {/* Expanded Details */}
                {expandedMatch === match.id && (
                  <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                    <p className="text-sm text-gray-300 mb-3"><span className="font-semibold">Lost Description:</span> {match.lostReport.description}</p>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">Found Item Description:</span>{' '}
                      {isVerified(match)
                        ? match.foundReport.description
                        : '[Protected for anti-fraud security. Complete verification questions to unlock full details.]'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/10 py-8 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-sm text-gray-500">
          <p>&copy; 2026 GIM Lost & Found. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-white transition">About</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClaimDetails;
