import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from './assets/logo1.png';
import { API_ENDPOINTS, fetchAPI } from './config/api';

const Notifications = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(() => !!localStorage.getItem('token'));
  const [error, setError] = useState('');
  const [nowMs] = useState(() => Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAPI(API_ENDPOINTS.GET_NOTIFICATIONS);
        if (!cancelled) {
          setNotifications(data || []);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching notifications:', err);
          setError(err.message || 'Failed to load notifications');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const markAsRead = async (id) => {
    try {
      await fetchAPI(`${API_ENDPOINTS.MARK_NOTIFICATION_READ}/${id}/read`, {
        method: 'POST',
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const formatNotification = (n) => {
    const payload = typeof n.payload === 'string' ? JSON.parse(n.payload) : n.payload || {};
    if (n.type === 'MATCH_FOUND') {
      return `New match found (score: ${Math.round(payload.score || 0)})`;
    }
    return n.type?.replace(/_/g, ' ') || 'Notification';
  };

  const timeAgo = (dateStr) => {
    const diff = nowMs - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
          <h1 className="text-3xl font-bold mb-4">Notifications</h1>
          <p className="text-gray-200 mb-6">Stay updated with your reports and claims.</p>

          {!isLoggedIn ? (
            <p className="text-gray-400">
              Please <Link to="/login" className="text-blue-300 underline">log in</Link> to view notifications.
            </p>
          ) : loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : notifications.length === 0 ? (
            <p className="text-gray-400">No notifications yet.</p>
          ) : (
            <ul className="space-y-3">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex justify-between items-center border rounded-xl px-4 py-3 ${
                    n.isRead
                      ? 'bg-white/5 border-white/10 opacity-70'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}
                >
                  <div>
                    <span className="text-gray-100 block">{formatNotification(n)}</span>
                    <span className="text-gray-500 text-xs">{timeAgo(n.createdAt)}</span>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-xs text-blue-300 hover:text-white"
                    >
                      Mark read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
