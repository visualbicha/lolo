import { sanitizeInput, sanitizeURL, checkRateLimit } from '../utils/security';

export const securityMiddleware = (req, res, next) => {
  // Headers de seguridad
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Sanitizar inputs
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }

  // Sanitizar URLs
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeURL(req.query[key]);
      }
    });
  }

  // Rate limiting
  try {
    checkRateLimit(req.ip);
  } catch (error) {
    return res.status(429).json({ error: error.message });
  }

  next();
};