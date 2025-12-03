import { useState, useEffect } from 'react';
import LeaderBoard from '../utils/leaderboardll';
import { fetchLeaderboard, submitScore } from '../utils/leaderboardApi';

export default function LeaderboardExample() {
    const [leaderboard] = useState(() => new LeaderBoard());
    const [entries, setEntries] = useState<Array<{ name: string; score: number }>>([]);
    const [playerName, setPlayerName] = useState('');
    const [playerScore, setPlayerScore] = useState(0);

    // Fetch leaderboard on mount
    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        const data = await fetchLeaderboard(50); // Top 50
        leaderboard.loadFromArray(data);
        setEntries(leaderboard.getLeaderBoard());
    };

    const handleSubmit = async () => {
        if (!playerName || playerScore <= 0) return;

        // Submit to backend
        const success = await submitScore(playerName, playerScore);
        
        if (success) {
            // Insert into local linked list for immediate UI update
            leaderboard.insertSorted(playerName, playerScore);
            setEntries(leaderboard.getLeaderBoard());
            
            // Clear form
            setPlayerName('');
            setPlayerScore(0);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
            
            {/* Submit Score Form */}
            <div className="mb-6 p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">Submit Your Score</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="px-3 py-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Score"
                        value={playerScore || ''}
                        onChange={(e) => setPlayerScore(Number(e.target.value))}
                        className="px-3 py-2 border rounded"
                    />
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </div>
            </div>

            {/* Leaderboard Display */}
            <div className="space-y-2">
                {entries.map((entry, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-white rounded shadow"
                    >
                        <span className="font-semibold">#{index + 1}</span>
                        <span className="flex-1 ml-4">{entry.name}</span>
                        <span className="font-bold text-green-600">{entry.score}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
