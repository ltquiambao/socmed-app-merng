const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const path = require('path');
const debug = require('debug')(`${path.basename(__dirname)}:${path.basename(__filename)}`);

const { SECRET_KEY } = require('../config');
let i = 1;

module.exports =(context) => {
  debug(`${i++}: req.headers = ${JSON.stringify(context.req.headers)}`);
  const authHeader = context.req.headers.authorization;
  debug(`${i++}: auth header = ${authHeader}`);
  if(authHeader) {
    debug(`${i++}: auth header split = ${authHeader.split('Bearer ')}`);
    const token = authHeader.split('Bearer ')[1];
    debug(`${i++}: token = ${token}`);
    if(token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        debug(`${i++}: user = ${JSON.stringify(user)}`);
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