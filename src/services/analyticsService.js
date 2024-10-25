import { analytics } from '../config/firebase';
import { logEvent } from 'firebase/analytics';

export const analyticsService = {
  logPageView: async (pageName) => {
    try {
      const analyticsInstance = await analytics();
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'page_view', {
          page_name: pageName
        });
      }
    } catch (error) {
      console.warn('Analytics not available:', error);
    }
  },

  logVideoView: async (videoId, videoTitle) => {
    try {
      const analyticsInstance = await analytics();
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'video_view', {
          video_id: videoId,
          video_title: videoTitle
        });
      }
    } catch (error) {
      console.warn('Analytics not available:', error);
    }
  },

  logSearch: async (searchTerm) => {
    try {
      const analyticsInstance = await analytics();
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'search', {
          search_term: searchTerm
        });
      }
    } catch (error) {
      console.warn('Analytics not available:', error);
    }
  },

  logSubscription: async (planType) => {
    try {
      const analyticsInstance = await analytics();
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'subscription_started', {
          plan_type: planType
        });
      }
    } catch (error) {
      console.warn('Analytics not available:', error);
    }
  },

  logDownload: async (videoId, videoTitle) => {
    try {
      const analyticsInstance = await analytics();
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'video_download', {
          video_id: videoId,
          video_title: videoTitle
        });
      }
    } catch (error) {
      console.warn('Analytics not available:', error);
    }
  },

  logUserAction: async (actionName, actionDetails) => {
    try {
      const analyticsInstance = await analytics();
      if (analyticsInstance) {
        logEvent(analyticsInstance, actionName, actionDetails);
      }
    } catch (error) {
      console.warn('Analytics not available:', error);
    }
  }
};

export default analyticsService;