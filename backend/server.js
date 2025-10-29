
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper function to read the database
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    // If the file doesn't exist or is corrupted, return a default structure
    return { favorites: [], reviews: [], history: [] };
  }
};

// Helper function to write to the database
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Error writing to database:", error);
  }
};

// --- API Endpoints ---

// Simple test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});


// --- OMDb API Proxy ---
// Endpoint to search movies from OMDb API
// This will protect the API key
app.get('/api/movies/search', async (req, res) => {
  const { title } = req.query;
  // IMPORTANT: Replace with your actual OMDb API key
  const apiKey = process.env.OMDB_API_KEY || '3988792b';

  if (!title) {
    return res.status(400).json({ message: 'Movie title is required' });
  }

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${title}`);
    const data = await response.json();

    if (data.Response === "True") {
        // Save search to history
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

// Endpoint to get movie details
app.get('/api/movies/details/:id', async (req, res) => {
    const { id } = req.params;
    const apiKey = process.env.OMDB_API_KEY || '3988792b';

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


// --- Favorites Endpoints ---

// GET all favorites
app.get('/api/favorites', (req, res) => {
  const db = readDB();
  res.json(db.favorites);
});

// POST a new favorite
app.post('/api/favorites', (req, res) => {
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
app.delete('/api/favorites/:id', (req, res) => {
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


// --- Reviews Endpoints ---

// GET all reviews
app.get('/api/reviews', (req, res) => {
    const db = readDB();
    res.json(db.reviews);
});

// GET reviews for a specific movie
app.get('/api/reviews/:movieId', (req, res) => {
    const { movieId } = req.params;
    const db = readDB();
    const movieReviews = db.reviews.filter(r => r.imdbID === movieId);
    res.json(movieReviews);
});


// POST a new review
app.post('/api/reviews', (req, res) => {
    const db = readDB();
    const { imdbID, rating, comment } = req.body;

    if (!imdbID || rating === undefined || !comment) {
        return res.status(400).json({ message: 'Missing required fields: imdbID, rating, comment' });
    }

    // Remove existing review for the same movie if it exists, to be replaced by the new one.
    // Or decide to update it. For simplicity, we'll allow multiple reviews, but a better approach might be to update.
    // Let's instead enforce one review per movie by checking and updating.
    const existingReviewIndex = db.reviews.findIndex(r => r.imdbID === imdbID);

    if (existingReviewIndex !== -1) {
        // Update existing review
        db.reviews[existingReviewIndex] = { ...db.reviews[existingReviewIndex], rating, comment, date: new Date().toISOString() };
        writeDB(db);
        res.status(200).json(db.reviews[existingReviewIndex]);
    } else {
        // Add new review
        const newReview = {
            id: Date.now().toString(), // simple unique id
            imdbID,
            rating,
            comment,
            date: new Date().toISOString()
        };
        db.reviews.push(newReview);
        writeDB(db);
        res.status(201).json(newReview);
    }
});

// PUT (update) a review
app.put('/api/reviews/:id', (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const db = readDB();
    const reviewIndex = db.reviews.findIndex(r => r.id === id);

    if (reviewIndex !== -1) {
        db.reviews[reviewIndex] = { ...db.reviews[reviewIndex], rating, comment, date: new Date().toISOString() };
        writeDB(db);
        res.json(db.reviews[reviewIndex]);
    } else {
        res.status(404).json({ message: 'Review not found' });
    }
});

// DELETE a review
app.delete('/api/reviews/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const initialLength = db.reviews.length;
    db.reviews = db.reviews.filter(r => r.id !== id);

    if (db.reviews.length < initialLength) {
        writeDB(db);
        res.status(200).json({ message: 'Review removed successfully' });
    } else {
        res.status(404).json({ message: 'Review not found' });
    }
});


// --- Stats Endpoint ---
app.get('/api/stats', (req, res) => {
    const db = readDB();
    const { history, reviews, favorites } = db;

    // 1. Total de filmes buscados (unique)
    const uniqueSearchTerms = [...new Set(history.map(h => h.term.toLowerCase()))];
    const totalSearches = uniqueSearchTerms.length;

    // 2. Gênero mais pesquisado
    // This requires fetching details for each searched movie, which is expensive.
    // A better approach is to analyze the genres of favorited movies.
    const genreCounts = favorites.reduce((acc, movie) => {
        if (movie.Genre) {
            const genres = movie.Genre.split(', ');
            genres.forEach(genre => {
                acc[genre] = (acc[genre] || 0) + 1;
            });
        }
        return acc;
    }, {});
    const topGenre = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b, '');


    // 3. Década preferida (based on favorited movies)
    const decadeCounts = favorites.reduce((acc, movie) => {
        if (movie.Year && !isNaN(movie.Year)) {
            const decade = Math.floor(parseInt(movie.Year) / 10) * 10;
            const decadeKey = `${decade}s`;
            acc[decadeKey] = (acc[decadeKey] || 0) + 1;
        }
        return acc;
    }, {});
    const favoriteDecade = Object.keys(decadeCounts).reduce((a, b) => decadeCounts[a] > decadeCounts[b] ? a : b, '');


    // 4. Nota média das avaliações
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length) : 0; // Removed .toFixed(1)
  
    // 5. Gráfico simples dos anos dos filmes (buscados)
    const yearCounts = history.reduce((acc, searchEntry) => {
        if (searchEntry.movieYears) {
            searchEntry.movieYears.forEach(year => {
                acc[year] = (acc[year] || 0) + 1;
            });
        }
        return acc;
    }, {});


    res.json({
        totalSearches,
        genreCounts,
        topGenre,
        decadeCounts,
        favoriteDecade,
        averageRating: parseFloat(averageRating),
        yearCounts
    });
});


// Start server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
