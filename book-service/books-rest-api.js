const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const { connectProducer, sendKafkaMessage } = require('../kafka-producer/producer');

const app = express();
const port = 4000; // Port changé ici

app.use(bodyParser.json());

const books = [];

connectProducer().catch(console.error);

// Routes REST
app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

app.post('/books', async (req, res) => {
  const { title, authorId } = req.body;
  if (!title || !authorId) {
    return res.status(400).json({ message: 'title and authorId required' });
  }

  const newBook = { id: uuidv4(), title, authorId };
  books.push(newBook);

  try {
    await sendKafkaMessage('books-topic', newBook);
  } catch (err) {
    console.error('Kafka error:', err);
  }

  res.status(201).json({ book: newBook });
});

app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const { title, authorId } = req.body;
  if (title) book.title = title;
  if (authorId) book.authorId = authorId;

  res.json({ message: 'Book updated' });
});

app.delete('/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(index, 1);
  res.json({ message: 'Book deleted' });
});

app.listen(port, () => {
  console.log(`Books REST API en écoute sur http://localhost:${port}`);
});
