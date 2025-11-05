const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Import route modules
const moviesRoutes = require('./routes/movies');
const favoritesRoutes = require('./routes/favorites');
const reviewsRoutes = require('./routes/reviews');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Mount API routes
app.use('/api', moviesRoutes);
app.use('/api', favoritesRoutes);
app.use('/api', reviewsRoutes);
app.use('/api', statsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});