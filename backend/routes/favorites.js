const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// GET all favorites
router.get('/favorites', (req, res) => {
  const db = readDB();
  res.json(db.favorites);
});

// POST a new favorite
router.post('/favorites', (req, res) => {
  const db = readDB();
  const newFavorite = req.body; // Expects a movie object

  // Avoid duplicates
  if (db.favorites.some(fav => fav.imdbID === newFavorite.imdbID)) {
    return res.status(409).json({ message: 'Movie is already in favorites' });
  }

  db.favorites.push(newFavorite);
  writeDB(db);
  res.status(201).json(newFavorite);
});

// DELETE a favorite
router.delete('/favorites/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const initialLength = db.favorites.length;
  db.favorites = db.favorites.filter(fav => fav.imdbID !== id);

  if (db.favorites.length < initialLength) {
    writeDB(db);
    res.status(200).json({ message: 'Favorite removed successfully' });
  } else {
    res.status(404).json({ message: 'Favorite not found' });
  }
});

module.exports = router;
