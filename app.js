// app.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

// In-memory "database"
let cards = [
  { id: 1, suit: 'Hearts',   value: 'Ace' },
  { id: 2, suit: 'Spades',   value: 'King' },
  { id: 3, suit: 'Diamonds', value: 'Queen' }
];
let nextId = 4;

// GET /cards  -> list all cards
app.get('/cards', (req, res) => {
  res.json(cards);
});

// GET /cards/:id -> get one card by id
app.get('/cards/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const card = cards.find(c => c.id === id);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  res.json(card);
});

// POST /cards -> create a new card
// Expected JSON body: { "suit": "Clubs", "value": "Jack" }
app.post('/cards', (req, res) => {
  const { suit, value } = req.body;

  // basic validation
  if (!suit || !value || typeof suit !== 'string' || typeof value !== 'string') {
    return res.status(400).json({ error: 'Request body must include string fields "suit" and "value".' });
  }

  const newCard = { id: nextId++, suit: suit.trim(), value: value.trim() };
  cards.push(newCard);
  res.status(201).json(newCard);
});

// DELETE /cards/:id -> delete a card by id
app.delete('/cards/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const idx = cards.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Card not found' });

  const removed = cards.splice(idx, 1)[0];
  res.json({ message: `Card with ID ${id} removed.`, card: removed });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Playing cards API listening on http://localhost:${PORT}`);
});
