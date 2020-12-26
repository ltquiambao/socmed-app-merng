// dependency imports
const { ApolloServer } = require('apollo-server'); // server
const mongoose = require('mongoose'); // mongoDB
const debug = require('debug')('index'); // debugging / instead of console logging

// relative imports
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers'); // will default at 'index.js'
const { MONGODB } = require('./config.js');

// ApolloServer is just using express server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }) // make request heards, body, etc. accessible
});

const connectionString = MONGODB;
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    debug('MongoDB Connected')
    return server.listen({ port: 5000 })
  })
  .then(res => {
    console.log(`Server running at ${res.url}`);
  });