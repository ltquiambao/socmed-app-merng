const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../config');
const debug = require('./debugger')(__dirname, __filename);

module.exports =(context) => {
  debug('req.headers', context.req.headers);
  const authHeader = context.req.headers.authorization;
  debug('auth header', authHeader);
  if(authHeader) {
    const token = authHeader.split('Bearer ')[1];
    debug('token', token);
    if(token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        debug('user', user);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    } else {
      throw new Error(`Authentication token must be 'Bearer [token]'`);
    }
  } else {
    throw new Error(`Authorization header must be provided`);
  }
}