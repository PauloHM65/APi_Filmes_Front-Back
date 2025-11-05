const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// Proxy to search movies from OMDb API
router.get('/movies/search', async (req, res) => {
  const { title } = req.query;
  const apiKey = process.env.OMDB_API_KEY;

  if (!title) {
    return res.status(400).json({ message: 'Movie title is required' });
  }

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${title}`);
    const data = await response.json();

    if (data.Response === "True") {
        const db = readDB();
        const newSearch = {
            term: title,
            date: new Date().toISOString(),
            results: data.Search.length,
            movieYears: data.Search.map(movie => movie.Year).filter(year => year && !isNaN(year))
        };
        db.history.push(newSearch);
        writeDB(db);
        res.json(data.Search);
    } else {
        res.json([]);
    }
  } catch (error) {
    console.error('Error fetching from OMDb:', error);
    res.status(500).json({ message: 'Error fetching data from OMDb API' });
  }
});

// Proxy to get movie details
router.get('/movies/details/:id', async (req, res) => {
    const { id } = req.params;
    const apiKey = process.env.OMDB_API_KEY;

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({ message: 'Error fetching movie details' });
    }
});

module.exports = router;
