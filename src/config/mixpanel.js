import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || '0aa55aed9d9e5bacade820b9e2870625';

let isInitialized = false;
const trackedMatchIds = new Set();

export const initMixpanel = () => {
  if (isInitialized) return;

  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: false,
      track_pageview: true,
      persistence: 'localStorage',
      ignore_dnt: true,
    });
    isInitialized = true;
  } catch (err) {
    console.error('Failed to initialize Mixpanel:', err);
  }
};

export const trackEvent = (eventName, properties = {}) => {
  try {
    if (!isInitialized) initMixpanel();
    mixpanel.track(eventName, {
      timestamp: new Date().toISOString(),
      ...properties,
    });
  } catch (err) {
    console.error(`Mixpanel track error [${eventName}]:`, err);
  }
};

/**
 * Reusable score bucket helper to categorize match scores (0-100).
 * Handles missing/invalid scores safely.
 */
export const getScoreBucket = (score) => {
  if (score === null || score === undefined || isNaN(score)) {
    return 'Low (0–50)';
  }
  const s = Math.min(100, Math.max(0, Math.round(Number(score))));
  if (s <= 50) return 'Low (0–50)';
  if (s <= 70) return 'Medium (51–70)';
  if (s <= 85) return 'High (71–85)';
  return 'Very High (86–100)';
};

/**
 * Emits 'Match Generated' once per match with safe non-PII properties.
 */
export const trackMatchGenerated = ({
  match_score,
  report_type = 'lost',
  category = 'Uncategorized',
  has_exact_identifier_match = false,
  match_source = 'automatic',
  match_id,
} = {}) => {
  if (match_id && trackedMatchIds.has(match_id)) {
    return; // Prevent duplicate event tracking
  }
  if (match_id) {
    trackedMatchIds.add(match_id);
  }

  const score = Math.min(100, Math.max(0, Math.round(Number(match_score) || 0)));
  const bucket = getScoreBucket(score);

  trackEvent('Match Generated', {
    match_score: score,
    match_score_bucket: bucket,
    report_type: report_type ? String(report_type).toLowerCase() : 'lost',
    category: category || 'Uncategorized',
    has_exact_identifier_match: Boolean(has_exact_identifier_match),
    match_source: match_source || 'automatic',
  });
};

export const trackPageView = (pageName) => {
  try {
    if (!isInitialized) initMixpanel();
    mixpanel.track('Page View', {
      page_name: pageName,
      path: window.location.pathname,
    });
  } catch (err) {
    console.error(`Mixpanel pageview error [${pageName}]:`, err);
  }
};

/**
 * Uses a stable internal user ID for Mixpanel distinct ID.
 * Does NOT attach PII (name/email) to distinct identity.
 */
export const identifyUser = (userId) => {
  try {
    if (!userId) return;
    if (!isInitialized) initMixpanel();
    mixpanel.identify(String(userId));
  } catch (err) {
    console.error('Mixpanel identify error:', err);
  }
};

export const resetUser = () => {
  try {
    if (!isInitialized) initMixpanel();
    mixpanel.reset();
  } catch (err) {
    console.error('Mixpanel reset error:', err);
  }
};
