import logger from '#config/logger.js';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

const JWT_SECCRET =
  process.env.JWT_SECCRET || 'YOUR SECRET KEY PLEASE CHANGE IN PRODUCTION';
const JWT_EXPIRES_IN = '1d';
export const jwttoken = {
  sign: payload => {
    try {
      return sign(payload, JWT_SECCRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (e) {
      logger.error('Failed to authenticate token', e);
      throw new Error('Failed to authenticate token');
    }
  },
  verify: token => {
    try {
      return verify(token, JWT_SECCRET);
    } catch (e) {
      logger.error('Failed to authenticate token', e);
      throw new Error('Failed to authenticate token');
    }
  },
};
