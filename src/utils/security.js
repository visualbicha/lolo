// Security utility functions
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[&<>"']/g, (match) => {
      const escape = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return escape[match];
    })
    .trim();
};

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Prevenir XSS en URLs
export const sanitizeURL = (url) => {
  try {
    const parsed = new URL(url);
    // Solo permitir protocolos seguros
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Protocolo no permitido');
    }
    return parsed.toString();
  } catch (error) {
    console.error('URL inválida:', error);
    return '';
  }
};

// Rate limiting para prevenir brute force
const rateLimits = new Map();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutos

export const checkRateLimit = (ip) => {
  const now = Date.now();
  const userAttempts = rateLimits.get(ip) || { count: 0, timestamp: now };

  // Resetear contador si ha pasado el tiempo de bloqueo
  if (now - userAttempts.timestamp > BLOCK_DURATION) {
    userAttempts.count = 0;
    userAttempts.timestamp = now;
  }

  // Verificar si está bloqueado
  if (userAttempts.count >= MAX_ATTEMPTS) {
    const timeLeft = Math.ceil((BLOCK_DURATION - (now - userAttempts.timestamp)) / 1000);
    throw new Error(`Demasiados intentos. Intente de nuevo en ${timeLeft} segundos`);
  }

  // Incrementar contador
  userAttempts.count++;
  rateLimits.set(ip, userAttempts);
};

// CSP Headers (implementar en el servidor)
export const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'media-src': ["'self'", 'https:'],
  'connect-src': ["'self'", 'https://api.stripe.com'],
  'frame-src': ["'self'", 'https://js.stripe.com'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};