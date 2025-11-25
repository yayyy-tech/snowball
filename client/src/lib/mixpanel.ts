import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

let isInitialized = false;

export const initMixpanel = () => {
  if (isInitialized || !MIXPANEL_TOKEN) {
    if (!MIXPANEL_TOKEN) {
      console.warn('Mixpanel token not configured. Analytics disabled.');
    }
    return;
  }

  mixpanel.init(MIXPANEL_TOKEN, {
    debug: import.meta.env.DEV,
    track_pageview: true,
    persistence: 'localStorage',
    ignore_dnt: false,
  });

  isInitialized = true;
};

export const analytics = {
  identify: (userId: string, traits?: Record<string, any>) => {
    if (!isInitialized) return;
    mixpanel.identify(userId);
    if (traits) {
      mixpanel.people.set(traits);
    }
  },

  track: (event: string, properties?: Record<string, any>) => {
    if (!isInitialized) return;
    mixpanel.track(event, properties);
  },

  page: (name: string, properties?: Record<string, any>) => {
    if (!isInitialized) return;
    mixpanel.track('Page Viewed', { page: name, ...properties });
  },

  setUserProperties: (properties: Record<string, any>) => {
    if (!isInitialized) return;
    mixpanel.people.set(properties);
  },

  reset: () => {
    if (!isInitialized) return;
    mixpanel.reset();
  },
};

export const EVENTS = {
  USER_LOGGED_IN: 'User Logged In',
  USER_LOGGED_OUT: 'User Logged Out',
  ONBOARDING_STARTED: 'Onboarding Started',
  ONBOARDING_STEP_COMPLETED: 'Onboarding Step Completed',
  PLAN_CREATED: 'Retirement Plan Created',
  PLAN_VIEWED: 'Retirement Plan Viewed',
  PREVIOUS_PLANS_VIEWED: 'Previous Plans Viewed',
  WHAT_IF_SIMULATOR_USED: 'What If Simulator Used',
  CHATBOT_MESSAGE_SENT: 'Chatbot Message Sent',
  PDF_DOWNLOADED: 'PDF Downloaded',
  CTA_CLICKED: 'CTA Clicked',
} as const;
