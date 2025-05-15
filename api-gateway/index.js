const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const PORT = 3000;

async function startServer() {
  const app = express();

  app.use(bodyParser.json());

  // REST endpoints pour Authors (exemple)
  const PROTO_PATH_AUTHORS = path.join(__dirname, '../authors-service/authors.proto');
  const authorsPackageDef = protoLoader.loadSync(PROTO_PATH_AUTHORS);
  const authorsProto = grpc.loadPackageDefinition(authorsPackageDef).authors;
  const authorsClient = new authorsProto.AuthorsService('localhost:50052', grpc.credentials.createInsecure());

  app.get('/authors', (req, res) => {
    authorsClient.SearchAuthors({}, (err, response) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(response.authors);
    });
  });

  app.post('/authors', (req, res) => {
    const { name, bio } = req.body;
    authorsClient.AddAuthor({ name, bio }, (err, response) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(response.author);
    });
  });

  // Apollo Server GraphQL
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(PORT, () => {
    console.log(`API Gateway ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
