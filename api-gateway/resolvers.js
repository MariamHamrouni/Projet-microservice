const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH_BOOKS = path.join(__dirname, '../book-service/books.proto');
const PROTO_PATH_AUTHORS = path.join(__dirname, '../authors-service/authors.proto');

const booksPackageDef = protoLoader.loadSync(PROTO_PATH_BOOKS);
const authorsPackageDef = protoLoader.loadSync(PROTO_PATH_AUTHORS);

const booksProto = grpc.loadPackageDefinition(booksPackageDef).books;
const authorsProto = grpc.loadPackageDefinition(authorsPackageDef).authors;

const booksClient = new booksProto.BooksService('localhost:50051', grpc.credentials.createInsecure());
const authorsClient = new authorsProto.AuthorsService('localhost:50052', grpc.credentials.createInsecure());

const resolvers = {
  Query: {
    books: () =>
      new Promise((resolve, reject) => {
        booksClient.SearchBooks({}, (err, response) => {
          if (err) return reject(err);
          resolve(response.books);
        });
      }),
    book: (_, { id }) =>
      new Promise((resolve, reject) => {
        booksClient.GetBook({ book_id: id }, (err, response) => {
          if (err) return reject(err);
          resolve(response.book);
        });
      }),
    authors: () =>
      new Promise((resolve, reject) => {
        authorsClient.SearchAuthors({}, (err, response) => {
          if (err) return reject(err);
          resolve(response.authors);
        });
      }),
    author: (_, { id }) =>
      new Promise((resolve, reject) => {
        authorsClient.GetAuthor({ author_id: id }, (err, response) => {
          if (err) return reject(err);
          resolve(response.author);
        });
      }),
  },
  Mutation: {
    addBook: (_, { title, authorId }) =>
      new Promise((resolve, reject) => {
        booksClient.AddBook({ title, authorId }, (err, response) => {
          if (err) return reject(err);
          resolve(response.book);
        });
      }),
    addAuthor: (_, { name, bio }) =>
      new Promise((resolve, reject) => {
        authorsClient.AddAuthor({ name, bio }, (err, response) => {
          if (err) return reject(err);
          resolve(response.author);
        });
      }),
  },
};

module.exports = resolvers;
