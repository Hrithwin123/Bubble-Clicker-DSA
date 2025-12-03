import { useState } from 'react';
import { submitScore } from '../utils/leaderboardApi';
import { getToken, getUser } from '../utils/authApi';
import AuthModal from './AuthModal';

interface SaveScoreModalProps {
    score: number;
    onClose: () => void;
    onSaved: () => void;
}

export default function SaveScoreModal({ score, onClose, onSaved }: SaveScoreModalProps) {
    const [showAuth, setShowAuth] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const user = getUser();
    const token = getToken();

    const handleSaveAsGuest = async () => {
        if (!guestName.trim()) {
            setMessage('Please enter a name');
            return;
        }

        setSaving(true);
        const success = await submitScore(guestName, score);
        setSaving(false);

        if (success) {
            setMessage('Score saved!');
            setTimeout(() => {
                onSaved();
                onClose();
            }, 1500);
        } else {
            setMessage('Failed to save score');
        }
    };

    const handleSaveAuthenticated = async () => {
        if (!token || !user) return;

        setSaving(true);
        const success = await submitScore(user.username, score, token);
        setSaving(false);

        if (success) {
            setMessage('Score saved!');
            setTimeout(() => {
                onSaved();
                onClose();
            }, 1500);
        } else {
            setMessage('Failed to save score');
        }
    };

    const handleAuthSuccess = async (username: string, newToken: string) => {
        setShowAuth(false);
        setSaving(true);
        const success = await submitScore(username, score, newToken);
        setSaving(false);

        if (success) {
            setMessage('Score saved!');
            setTimeout(() => {
                onSaved();
                onClose();
            }, 1500);
        } else {
            setMessage('Failed to save score');
        }
    };

    if (showAuth) {
        return <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />;
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    Great Game!
                </h2>
                <p className="text-4xl font-bold text-green-600 mb-6">
                    Score: {score}
                </p>

                <p className="text-gray-700 mb-6">
                    Want to save your score to the leaderboard?
                </p>

                {user && token ? (
                    // Already logged in
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                            Logged in as: <span className="font-semibold">{user.username}</span>
                        </p>
                        <button
                            onClick={handleSaveAuthenticated}
                            disabled={saving}
                            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
                        >
                            {saving ? 'Saving...' : 'Save Score'}
                        </button>
                    </div>
                ) : (
                    // Not logged in - offer options
                    <div className="space-y-3">
                        <button
                            onClick={() => setShowAuth(true)}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                            Login / Register to Save
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">or</span>
                            </div>
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 mb-2"
                            />
                            <button
                                onClick={handleSaveAsGuest}
                                disabled={saving}
                                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
                            >
                                {saving ? 'Saving...' : 'Save as Guest'}
                            </button>
                        </div>
                    </div>
                )}

                {message && (
                    <div className={`mt-4 text-center font-semibold ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                        {message}
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="mt-4 w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                    Skip
                </button>
            </div>
        </div>
    );
}
