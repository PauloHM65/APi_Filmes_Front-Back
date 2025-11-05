const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// GET all reviews
router.get('/reviews', (req, res) => {
    const db = readDB();
    res.json(db.reviews);
});

// GET reviews for a specific movie
router.get('/reviews/:movieId', (req, res) => {
    const { movieId } = req.params;
    const db = readDB();
    const movieReviews = db.reviews.filter(r => r.imdbID === movieId);
    res.json(movieReviews);
});


// POST a new review
router.post('/reviews', (req, res) => {
    const db = readDB();
    const { imdbID, rating, comment } = req.body;

    if (!imdbID || rating === undefined || !comment) {
        return res.status(400).json({ message: 'Missing required fields: imdbID, rating, comment' });
    }

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
router.put('/reviews/:id', (req, res) => {
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
router.delete('/reviews/:id', (req, res) => {
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

module.exports = router;
