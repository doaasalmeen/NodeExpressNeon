import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');

    if (!token) {
      logger.warn('Authentication failed: No token provided');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;

    logger.info(`User authenticated: ${decoded.email}`);
    next();
  } catch (e) {
    logger.error('Authentication error', e);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Authorization failed: No user in request');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(
        `Authorization failed: User ${req.user.email} with role ${req.user.role} attempted to access resource requiring roles: ${allowedRoles.join(', ')}`
      );
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};
