const express = require('express');
const { getLeaderboard, addLeaderboardEntry } = require('../controllers/leaderboardController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', getLeaderboard);

// Optional auth - if token provided, uses authenticated username
router.post('/', (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        return authMiddleware(req, res, next);
    }
    next();
}, addLeaderboardEntry);

module.exports = router;
