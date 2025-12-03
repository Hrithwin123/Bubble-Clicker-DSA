import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Award, ArrowLeft } from 'lucide-react';
import LeaderBoard from '../utils/leaderboardll';
import { fetchLeaderboard } from '../utils/leaderboardApi';
import UserMenu from '../components/UserMenu';

export default function LeaderboardPage() {
    const navigate = useNavigate();
    const [leaderboard] = useState(() => new LeaderBoard());
    const [entries, setEntries] = useState<Array<{ name: string; score: number }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        setLoading(true);
        const data = await fetchLeaderboard(50);
        leaderboard.loadFromArray(data);
        setEntries(leaderboard.getLeaderBoard());
        setLoading(false);
    };

    const getMedalIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-white drop-shadow-lg" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-white drop-shadow-lg" />;
        if (rank === 3) return <Award className="w-6 h-6 text-white drop-shadow-lg" />;
        return null;
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
        if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
        if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
        return 'bg-white hover:bg-gray-50';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Game
                        </button>
                        <UserMenu />
                    </div>
                    
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                            <Trophy className="w-12 h-12 text-yellow-400" />
                            Leaderboard
                            <Trophy className="w-12 h-12 text-yellow-400" />
                        </h1>
                        <p className="text-gray-400">Top 50 Players</p>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center text-white py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p>Loading leaderboard...</p>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-center text-white py-12">
                        <p className="text-xl mb-4">No scores yet!</p>
                        <p className="text-gray-400">Be the first to set a record</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {entries.map((entry, index) => {
                            const rank = index + 1;
                            const isTopThree = rank <= 3;
                            
                            return (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between p-4 rounded-lg shadow-lg transition-all ${getRankColor(rank)} ${isTopThree ? 'transform scale-105 shadow-2xl' : ''}`}
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Rank */}
                                        <div className="flex items-center justify-center w-12">
                                            {getMedalIcon(rank) || (
                                                <span className={`text-2xl font-bold ${isTopThree ? 'text-white' : 'text-gray-600'}`}>
                                                    #{rank}
                                                </span>
                                            )}
                                        </div>

                                        {/* Name */}
                                        <div className="flex-1">
                                            <p className={`text-xl font-semibold ${isTopThree ? 'text-white' : 'text-gray-800'}`}>
                                                {entry.name}
                                            </p>
                                        </div>

                                        {/* Score */}
                                        <div className={`text-right ${isTopThree ? 'bg-white/20' : 'bg-green-100'} px-4 py-2 rounded-lg`}>
                                            <p className={`text-2xl font-bold ${isTopThree ? 'text-white' : 'text-green-700'}`}>
                                                {entry.score.toLocaleString()}
                                            </p>
                                            <p className={`text-xs ${isTopThree ? 'text-white/70' : 'text-gray-500'}`}>
                                                points
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Refresh Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={loadLeaderboard}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-500"
                    >
                        {loading ? 'Refreshing...' : 'Refresh Leaderboard'}
                    </button>
                </div>
            </div>
        </div>
    );
}
