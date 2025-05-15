const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const { connectProducer, sendKafkaMessage } = require('../kafka-producer/producer');

const PROTO_PATH = path.join(__dirname, 'books.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const booksProto = grpc.loadPackageDefinition(packageDefinition).books;

const books = [];

connectProducer().catch(console.error);

const booksService = {
  GetBook: (call, callback) => {
    const book = books.find(b => b.id === call.request.book_id);
    callback(null, { book: book || null });
  },

  SearchBooks: (_, callback) => {
    callback(null, { books });
  },

  AddBook: async (call, callback) => {
    const newBook = { id: uuidv4(), title: call.request.title, authorId: call.request.authorId };
    books.push(newBook);

    try {
      await sendKafkaMessage('books-topic', newBook);
    } catch (err) {
      console.error('Kafka error:', err);
    }

    callback(null, { book: newBook });
  },
};

function main() {
  const server = new grpc.Server();
  server.addService(booksProto.BooksService.service, booksService);
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('Books gRPC server running on port 50051');
  });
}

main();
