const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const MONGODB = "mongodb://mongo:27017/progress-app";

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
  typeDefs, resolvers
});

mongoose.connect(MONGODB, { useNewUrlParser: true })
  .then(() => console.log("MongoDb connection successful"))
  .then(() => server.listen({ port: 3000 }))
  .then((res) => console.log(`Server running at ${res.url}`));
