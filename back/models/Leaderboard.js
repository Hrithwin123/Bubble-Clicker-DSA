const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries sorted by score
leaderboardSchema.index({ score: -1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
