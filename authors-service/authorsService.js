const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const { connectProducer, sendKafkaMessage } = require('../kafka-producer/producer');

const PROTO_PATH = path.join(__dirname, 'authors.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const authorsProto = grpc.loadPackageDefinition(packageDefinition).authors;

const authors = [];

connectProducer().catch(console.error);

const authorsService = {
  GetAuthor: (call, callback) => {
  const author = authors.find(a => a.id === call.request.author_id);
  if (author) {
    callback(null, { author });
  } else {
    callback(null, { author: null });
  }
},

  SearchAuthors: (_, callback) => {
    callback(null, { authors });
  },

  AddAuthor: async (call, callback) => {
    const newAuthor = { id: uuidv4(), name: call.request.name, bio: call.request.bio };
    authors.push(newAuthor);

    try {
      await sendKafkaMessage('authors-topic', newAuthor);
    } catch (err) {
      console.error('Kafka error:', err);
    }

    callback(null, { author: newAuthor });
  },
};

function main() {
  const server = new grpc.Server();
  server.addService(authorsProto.AuthorsService.service, authorsService);
  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Erreur lors du bind du serveur :', err);
      return;
    }
    server.start();
    console.log(`Authors gRPC server running on port ${port}`);
  });
}

main();
