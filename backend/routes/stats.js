const express = require('express');
const router = express.Router();
const { readDB } = require('../db');

router.get('/stats', (req, res) => {
    const db = readDB();
    const { history, reviews, favorites } = db;

    // 1. Total de filmes buscados (unique)
    const uniqueSearchTerms = [...new Set(history.map(h => h.term.toLowerCase()))];
    const totalSearches = uniqueSearchTerms.length;

    // 2. Gênero mais pesquisado
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
  
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length) : 0;
  
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

module.exports = router;
