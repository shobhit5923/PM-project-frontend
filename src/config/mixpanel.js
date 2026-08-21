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
