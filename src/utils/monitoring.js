import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initMonitoring = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      beforeSend(event) {
        // Sanitize sensitive data
        if (event.request && event.request.headers) {
          delete event.request.headers['Authorization'];
        }
        return event;
      }
    });
  }
};

export const trackEvent = (eventName, data = {}) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(eventName, {
      level: 'info',
      extra: data
    });
  }
};

export const trackError = (error, context = {}) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: context
    });
  }
};

export const startTransaction = (name, op) => {
  if (process.env.NODE_ENV === 'production') {
    return Sentry.startTransaction({
      name,
      op
    });
  }
  return null;
};