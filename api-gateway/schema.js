const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    id: String!
    title: String!
    authorId: String!
  }

  type Author {
    id: String!
    name: String!
    bio: String!
  }

  type Query {
    books: [Book]
    book(id: String!): Book

    authors: [Author]
    author(id: String!): Author
  }

  type Mutation {
    addBook(title: String!, authorId: String!): Book
    addAuthor(name: String!, bio: String!): Author
  }
`;

module.exports = typeDefs;
