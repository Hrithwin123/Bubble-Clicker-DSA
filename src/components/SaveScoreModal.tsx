import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    return (
        <AnimatePresence>
            {showAuth ? (
                <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />
            ) : (
                <motion.div 
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backdropFilter: 'blur(20px)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div 
                        className="glass-strong rounded-3xl p-8 max-w-lg w-full mx-4 text-white glow-green"
                        initial={{ scale: 0.8, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.8, y: 50, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-black mb-4 gradient-text text-center">
                                Fantastic Game!
                            </h2>
                            <motion.div 
                                className="text-center mb-8"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            >
                                <p className="text-white/80 mb-2">Final Score</p>
                                <motion.p 
                                    className="text-6xl font-black gradient-score"
                                    animate={{ 
                                        textShadow: [
                                            "0 0 20px rgba(34, 197, 94, 0.5)",
                                            "0 0 30px rgba(34, 197, 94, 0.8)",
                                            "0 0 20px rgba(34, 197, 94, 0.5)"
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {score.toLocaleString()}
                                </motion.p>
                            </motion.div>
                        </motion.div>

                        <motion.p 
                            className="text-white/80 mb-8 text-center text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Want to save your score to the leaderboard?
                        </motion.p>

                        {user && token ? (
                            // Already logged in
                            <motion.div 
                                className="space-y-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="glass rounded-xl p-4 text-center">
                                    <p className="text-white/70 text-sm mb-1">Logged in as</p>
                                    <p className="font-bold text-cyan-400 text-lg">{user.username}</p>
                                </div>
                                <motion.button
                                    onClick={handleSaveAuthenticated}
                                    disabled={saving}
                                    className="w-full py-4 glass rounded-xl font-bold text-white glow-green disabled:opacity-50 will-change-transform"
                                    whileHover={!saving ? { 
                                        scale: 1.02,
                                        boxShadow: "0 0 30px rgba(34, 197, 94, 0.6)"
                                    } : {}}
                                    whileTap={!saving ? { scale: 0.98 } : {}}
                                >
                                    <motion.div
                                        animate={saving ? { opacity: [1, 0.5, 1] } : {}}
                                        transition={{ duration: 1, repeat: saving ? Infinity : 0 }}
                                    >
                                        {saving ? 'Saving...' : 'Save Score'}
                                    </motion.div>
                                </motion.button>
                            </motion.div>
                        ) : (
                            // Not logged in - offer options
                            <motion.div 
                                className="space-y-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <motion.button
                                    onClick={() => setShowAuth(true)}
                                    className="w-full py-4 glass rounded-xl font-bold text-white glow-cyan will-change-transform"
                                    whileHover={{ 
                                        scale: 1.02,
                                        boxShadow: "0 0 30px rgba(34, 211, 238, 0.6)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Login / Register to Save
                                </motion.button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/20"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-3 glass rounded-full text-white/60">or</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <motion.input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-white/50 bg-white/5"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.button
                                        onClick={handleSaveAsGuest}
                                        disabled={saving}
                                        className="w-full py-4 glass rounded-xl font-bold text-white glow-green disabled:opacity-50 will-change-transform"
                                        whileHover={!saving ? { 
                                            scale: 1.02,
                                            boxShadow: "0 0 30px rgba(34, 197, 94, 0.6)"
                                        } : {}}
                                        whileTap={!saving ? { scale: 0.98 } : {}}
                                    >
                                        <motion.div
                                            animate={saving ? { opacity: [1, 0.5, 1] } : {}}
                                            transition={{ duration: 1, repeat: saving ? Infinity : 0 }}
                                        >
                                            {saving ? 'Saving...' : 'Save as Guest'}
                                        </motion.div>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {message && (
                                <motion.div 
                                    className={`mt-6 text-center font-bold text-lg ${message.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            onClick={onClose}
                            className="mt-6 w-full py-3 glass rounded-xl text-white/70 hover:text-white font-medium"
                            whileHover={{ 
                                scale: 1.02,
                                backgroundColor: "rgba(255, 255, 255, 0.1)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            Skip
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}