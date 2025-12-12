import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { register, login, saveToken, saveUser } from '../utils/authApi';

interface AuthModalProps {
    onClose: () => void;
    onSuccess: (username: string, token: string) => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const authFunc = isLogin ? login : register;
        const result = await authFunc(username, password);

        setLoading(false);

        if (result.success && result.token && result.user) {
            saveToken(result.token);
            saveUser(result.user);
            onSuccess(result.user.username, result.token);
        } else {
            setError(result.error || 'Authentication failed');
        }
    };

    return (
        <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div 
                className="glass-strong rounded-3xl p-8 max-w-md w-full mx-4 text-white glow-purple"
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                <motion.h2 
                    className="text-3xl font-black mb-8 gradient-text text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {isLogin ? 'Welcome Back' : 'Join Bubble.io'}
                </motion.h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="block text-sm font-bold text-white/80 mb-2">
                            Username
                        </label>
                        <motion.input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-white/50 bg-white/5"
                            placeholder="Enter your username"
                            required
                            minLength={3}
                            whileFocus={{ scale: 1.02 }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label className="block text-sm font-bold text-white/80 mb-2">
                            Password
                        </label>
                        <motion.input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-white/50 bg-white/5"
                            placeholder="Enter your password"
                            required
                            minLength={6}
                            whileFocus={{ scale: 1.02 }}
                        />
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                className="glass px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/30"
                                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <p className="text-red-300 text-sm font-medium">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 glass rounded-xl font-bold text-white glow-green disabled:opacity-50 will-change-transform"
                        whileHover={!loading ? { 
                            scale: 1.02,
                            boxShadow: "0 0 30px rgba(34, 197, 94, 0.6)"
                        } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.div
                            animate={loading ? { opacity: [1, 0.5, 1] } : {}}
                            transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                        </motion.div>
                    </motion.button>
                </form>

                <motion.div 
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <motion.button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                    </motion.button>
                </motion.div>

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
                    transition={{ delay: 0.7 }}
                >
                    Skip for now
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
