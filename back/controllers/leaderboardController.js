const Leaderboard = require('../models/Leaderboard');

// GET all leaderboard entries sorted by score (descending)
const getLeaderboard = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100; // Default top 100
        const entries = await Leaderboard.find()
            .sort({ score: -1 })
            .limit(limit)
            .select('name score createdAt');
        
        res.json({ success: true, data: entries });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST new leaderboard entry (works with or without auth)
const addLeaderboardEntry = async (req, res) => {
    try {
        let { name, score } = req.body;

        // If user is authenticated, use their username
        if (req.user) {
            name = req.user.username;
        }

        if (!name || score === undefined) {
            return res.status(400).json({ 
                success: false, 
                error: 'Name and score are required' 
            });
        }

        const newEntry = new Leaderboard({ name, score });
        await newEntry.save();

        res.status(201).json({ success: true, data: newEntry });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getLeaderboard,
    addLeaderboardEntry
};
