import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || '0aa55aed9d9e5bacade820b9e2870625';

let isInitialized = false;

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
    console.log('Mixpanel Analytics initialized successfully');
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

export const getScoreBucket = (score) => {
  const s = Math.min(100, Math.max(0, Math.round(score || 0)));
  if (s <= 50) return 'Low (0–50)';
  if (s <= 70) return 'Medium (51–70)';
  if (s <= 85) return 'High (71–85)';
  return 'Very High (86–100)';
};

export const trackMatchGenerated = (matchScore, extraProps = {}) => {
  const score = Math.min(100, Math.max(0, Math.round(matchScore || 0)));
  const bucket = getScoreBucket(score);

  trackEvent('Match Generated', {
    match_score: score,
    match_score_bucket: bucket,
    ...extraProps,
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

export const identifyUser = (userId, userProps = {}) => {
  try {
    if (!isInitialized) initMixpanel();
    mixpanel.identify(String(userId));
    if (Object.keys(userProps).length > 0) {
      mixpanel.people.set({
        $name: userProps.name,
        $email: userProps.email,
        ...userProps,
      });
    }
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
