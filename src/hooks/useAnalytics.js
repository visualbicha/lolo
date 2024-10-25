import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const logPageView = async () => {
      await analyticsService.logPageView(location.pathname);
    };
    logPageView();
  }, [location]);

  return analyticsService;
};

export default useAnalytics;