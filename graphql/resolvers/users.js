const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config')
const User = require('../../models/User');
const { UserInputError } = require('apollo-server');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    }, 
    SECRET_KEY, 
    { expiresIn: '1h'}
  );
}

module.exports = {
  Mutation: {
    async register(
      _, 
      { 
        registerInput : { username, email, password, confirmPassword }
      }, 
      context, 
      info
    ){
      // TODO: Validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if(!valid) {
        throw new UserInputError('Errors', { errors })
      }
      // TODO: Makes sure user doesn't already exist
      const user = await User.findOne({ username });
      if(user) {
        throw new UserInputError('Username is taken', {
          errors: { 
            username: 'This username is taken'
          }
        });
      }
      // TODO: hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = generateToken(res);
      
      return {
        id: res._id,
        email: res.email,
        username: res.username,
        createdAt: res.createdAt,
        token
      }
    },
    async login(_, { loginInput: { username, password }}) {
      // TODO: Validate login data
      const { errors, valid } = validateLoginInput(username, password);
      if(!valid) {
        throw new UserInputError('Errors', { errors })
      }
      // TODO: Validate if user exists
      const user = await User.findOne({ username });
      if(!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }
      // TODO: Validate if login password == registered user password
      const match = await bcrypt.compare(password, user.password);
      if(!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = generateToken(user);

      return {
        id: user._id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        token
      }
    }
  }
}