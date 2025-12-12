import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Award, ArrowLeft, RefreshCw } from 'lucide-react';
import LeaderBoard from '../utils/leaderboardbst';
import { fetchLeaderboard } from '../utils/leaderboardApi';
import UserMenu from '../components/UserMenu';

export default function LeaderboardPage() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<Array<{ name: string; score: number }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        setLoading(true);
        const data = await fetchLeaderboard(50);

        // Clear existing tree and rebuild from backend data
        const newLeaderboard = new LeaderBoard();
        data.forEach(entry => {
            newLeaderboard.addPerson(entry.name, entry.score);
        });

        setEntries(newLeaderboard.getLeaderBoard());
        setLoading(false);
    };

    const getMedalIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-white drop-shadow-lg" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-white drop-shadow-lg" />;
        if (rank === 3) return <Award className="w-6 h-6 text-white drop-shadow-lg" />;
        return null;
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border-yellow-400/30 shadow-lg shadow-yellow-400/10';
        if (rank === 2) return 'bg-gradient-to-r from-gray-500/20 to-gray-400/20 border-gray-400/30 shadow-lg shadow-gray-400/10';
        if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-amber-500/20 border-amber-400/30 shadow-lg shadow-amber-400/10';
        return 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-700/40';
    };

    return (
        <div className="leaderboard-page min-h-screen bg-gray-900">
            <div className="max-w-4xl mx-auto w-full py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Game
                        </button>
                        <UserMenu />
                    </div>

                    <div className="text-center">
                        <h1 className="text-6xl font-black text-white mb-4 flex items-center justify-center gap-4">
                            <Trophy className="w-14 h-14 text-yellow-400" />
                            Leaderboard
                        </h1>
                        <p className="text-gray-400 text-lg font-medium">
                            Top 50 Players
                        </p>
                    </div>
                </div>

                {/* Leaderboard Entries */}
                {loading ? (
                    <div className="text-center text-white py-12">
                        <div className="bg-gray-800 rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mx-auto mb-6 animate-spin" />
                        <p className="text-lg font-medium text-gray-300">Loading leaderboard...</p>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-center text-white py-12">
                        <Trophy className="w-16 h-16 text-yellow-400/50 mx-auto mb-4" />
                        <p className="text-2xl mb-4 font-bold">No scores yet!</p>
                        <p className="text-gray-400">Be the first to set a record</p>
                    </div>
                ) : (
                    <div className="space-y-3 mb-8">
                        {entries.map((entry, index) => {
                            const rank = index + 1;
                            const isTopThree = rank <= 3;

                            return (
                                <div
                                    key={index}
                                    className={`backdrop-blur-sm border flex items-center justify-between p-6 rounded-2xl transition-all hover:scale-105 ${getRankColor(rank)}`}
                                >
                                    <div className="flex items-center gap-6 flex-1">
                                        {/* Rank */}
                                        <div className="flex items-center justify-center w-16">
                                            {getMedalIcon(rank) || (
                                                <span className={`text-3xl font-black ${isTopThree ? 'text-yellow-400' : 'text-gray-400'}`}>
                                                    #{rank}
                                                </span>
                                            )}
                                        </div>

                                        {/* Name */}
                                        <div className="flex-1">
                                            <p className="text-2xl font-bold text-white">
                                                {entry.name}
                                            </p>
                                        </div>

                                        {/* Score */}
                                        <div className="text-right bg-gray-800/50 backdrop-blur-sm border border-gray-700 px-6 py-3 rounded-xl">
                                            <p className={`text-3xl font-black ${isTopThree ? 'text-yellow-400' : 'text-white'}`}>
                                                {entry.score.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-400 font-medium">
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
                <div className="mt-12 text-center">
                    <button
                        onClick={loadLeaderboard}
                        disabled={loading}
                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 px-8 py-4 text-white rounded-xl font-bold transition-all disabled:opacity-50 hover:scale-105 hover:bg-gray-700/50"
                    >
                        <div className="flex items-center gap-3">
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Refreshing...' : 'Refresh Leaderboard'}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
