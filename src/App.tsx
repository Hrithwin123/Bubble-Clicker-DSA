import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';

function AnimatedRoutes() {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    in: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      scale: 1.05,
      y: -20,
    }
  };

  const pageTransition = {
    type: "tween" as const,
    ease: "anticipate" as const,
    duration: 0.6
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <GamePage />
            </motion.div>
          } 
        />
        <Route 
          path="/leaderboard" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <LeaderboardPage />
            </motion.div>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
