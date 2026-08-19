// API Configuration — set VITE_API_URL at build time (Vercel env / .env)
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/register`,

  // Reports endpoints
  REPORT_LOST: `${API_BASE_URL}/reports/lost`,
  REPORT_FOUND: `${API_BASE_URL}/reports/found`,
  GET_MY_REPORTS: `${API_BASE_URL}/reports/me`,
  GET_ALL_REPORTS: `${API_BASE_URL}/reports`,
  GET_REPORT: `${API_BASE_URL}/reports`, // /reports/:id

  // Matching endpoints
  GET_MY_MATCHES: `${API_BASE_URL}/matches/my`,
  GET_FOUND_FOR_ME: `${API_BASE_URL}/matches/found-for-me`,
  GET_QUESTIONS: `${API_BASE_URL}/matches`, // /:id/questions
  SUBMIT_ANSWERS: `${API_BASE_URL}/matches`, // /:id/answers

  // Notifications endpoints
  GET_NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  MARK_NOTIFICATION_READ: `${API_BASE_URL}/notifications`, // /:id/read

  // Health check
  HEALTH: `${API_BASE_URL}/health`,
};

// Fetch utility with error handling
export const fetchAPI = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}`;
    try {
      const error = await response.json();
      errorMsg = error.error || error.message || errorMsg;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(errorMsg);
  }

  return response.json();
};
