import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, HeartCrack, Trophy, Clock, Zap } from "lucide-react"
import LifeStack from "../utils/lifeStack.ts"
import PowerupQueue from "../utils/powerupQueue.ts"
import SaveScoreModal from "../components/SaveScoreModal.tsx"
import UserMenu from "../components/UserMenu.tsx"
import Bubble from "../components/Bubble.tsx"
import ParticleEffect from "../components/ParticleEffect.tsx"

interface Circle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  createdAt: number;
  shrinkStartTime?: number;
  type: 'normal' | 'life' | 'slowtime' | 'doublescore';
  missed?: boolean;
}

interface ActivePowerup {
  type: string;
  endTime: number;
}

interface ParticleEffectData {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function GamePage() {
  const navigate = useNavigate();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [animatingHearts, setAnimatingHearts] = useState<{ id: number, startX: number, startY: number }[]>([]);
  const [activePowerup, setActivePowerup] = useState<ActivePowerup | null>(null);
  const [scoreMultiplier, setScoreMultiplier] = useState(1);
  const [showSaveScore, setShowSaveScore] = useState(false);
  const [particles, setParticles] = useState<ParticleEffectData[]>([]);
  const [queuedPowerups, setQueuedPowerups] = useState<string[]>([]);
  const lifeStackRef = useRef<LifeStack | null>(null);
  const heartsContainerRef = useRef<HTMLDivElement>(null);
  const powerupQueueRef = useRef<PowerupQueue | null>(null);

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomColor = () => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500',
      'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-orange-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getCircleScale = (circle: Circle) => {
    const age = currentTime - circle.createdAt;
    const growthDuration = 600; // 600ms to reach full size
    const shrinkDuration = 300; // 300ms to shrink to nothing

    // If circle is shrinking
    if (circle.shrinkStartTime) {
      const shrinkAge = currentTime - circle.shrinkStartTime;
      const shrinkProgress = Math.min(shrinkAge / shrinkDuration, 1);
      // Shrink from current scale to 0
      return Math.max(0, 1 - shrinkProgress);
    }

    // Normal growth phase
    const progress = Math.min(age / growthDuration, 1);
    // Linear interpolation from 0.15 to 1.0
    const scale = 0.15 + (progress * 0.85);
    return scale;
  };

  const getScoreForCircle = (circle: Circle) => {
    // Much more diverse scoring system
    // Size range: 40-80, Score range: 15-100
    if (circle.size <= 45) return 100; // Tiny circles - huge reward
    if (circle.size <= 50) return 75;  // Very small circles
    if (circle.size <= 55) return 50;  // Small circles
    if (circle.size <= 60) return 35;  // Medium-small circles
    if (circle.size <= 65) return 25;  // Medium circles
    if (circle.size <= 70) return 20;  // Medium-large circles
    if (circle.size <= 75) return 15;  // Large circles
    return 10; // Largest circles - easiest to hit
  };

  const createCircle = useCallback(() => {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    const size = getRandomInt(40, 80);
    const now = Date.now();

    // Determine circle type with probabilities
    const rand = Math.random();
    let circleType: Circle['type'] = 'normal';
    let circleColor = getRandomColor();

    if (rand < 0.05) { // 5% chance for slowtime powerup
      circleType = 'slowtime';
      circleColor = 'bg-blue-400';
    } else if (rand < 0.1) { // 5% chance for doublescore powerup
      circleType = 'doublescore';
      circleColor = 'bg-yellow-400';
    } else if (rand < 0.2) { // 10% chance for life circle
      circleType = 'life';
      circleColor = 'bg-pink-500';
    }

    const newCircle: Circle = {
      id: now + Math.random(),
      x: getRandomInt(size, screenWidth - size - 20),
      y: getRandomInt(size + 100, screenHeight - size - 20),
      size,
      color: circleColor,
      createdAt: now,
      type: circleType
    };

    setCircles(prev => [...prev, newCircle]);

    // Circle lifetime affected by slow time powerup
    const baseLifetime = 1700;
    const circleLifetime = activePowerup?.type === 'slowtime' ? baseLifetime * 2 : baseLifetime;

    // Start shrinking after calculated lifetime, then remove after shrink animation
    setTimeout(() => {
      setCircles(prev => {
        const circle = prev.find(c => c.id === newCircle.id);
        if (circle && circle.type === 'normal' && !circle.missed) {
          // Mark as missed and lose a life
          setLives(prevLives => {
            const newLives = Math.max(0, prevLives - 1);
            if (newLives === 0) {
              setGameOver(true);
              setGameStarted(false);
            }
            return newLives;
          });
        }

        return prev.map(c =>
          c.id === newCircle.id
            ? { ...c, shrinkStartTime: Date.now(), missed: true }
            : c
        );
      });

      // Remove circle after shrink animation completes (300ms)
      setTimeout(() => {
        setCircles(prev => prev.filter(circle => circle.id !== newCircle.id));
      }, 300);
    }, circleLifetime);
  }, [activePowerup]);

  const activatePowerup = (powerupType: string) => {
    const now = Date.now();

    if (powerupType === 'slowtime') {
      setActivePowerup({ type: 'slowtime', endTime: now + 20000 }); // 20 seconds
    } else if (powerupType === 'doublescore') {
      setActivePowerup({ type: 'doublescore', endTime: now + 15000 }); // 15 seconds
      setScoreMultiplier(2);
    }
  };

  const handleCircleClick = (circleId: number) => {
    setCircles(prev => {
      const clickedCircle = prev.find(circle => circle.id === circleId);
      if (clickedCircle) {
        // Add particle effect
        const particleX = clickedCircle.x + clickedCircle.size / 2;
        const particleY = clickedCircle.y + clickedCircle.size / 2;
        const particleId = Date.now() + Math.random();
        setParticles(p => [...p, { id: particleId, x: particleX, y: particleY, color: clickedCircle.color }]);

        if (clickedCircle.type === 'life') {
          // Get click position for animation
          const startX = clickedCircle.x + clickedCircle.size / 2;
          const startY = clickedCircle.y + clickedCircle.size / 2;

          // Add a life (max 10 lives) with animation
          setLives(prevLives => {
            const newLives = Math.min(10, prevLives + 1);
            if (newLives > prevLives) {
              // Trigger heart animation from click position to life stack
              const heartId = Date.now();
              setAnimatingHearts(prev => [...prev, { id: heartId, startX, startY }]);

              // Remove animation after it completes
              setTimeout(() => {
                setAnimatingHearts(prev => prev.filter(heart => heart.id !== heartId));
              }, 800);
            }
            return newLives;
          });
        } else if (clickedCircle.type === 'slowtime' || clickedCircle.type === 'doublescore') {
          // Handle powerup
          if (powerupQueueRef.current) {
            if (!activePowerup) {
              // No active powerup, activate immediately
              activatePowerup(clickedCircle.type);
            } else {
              // There's an active powerup, add this one to queue
              const added = powerupQueueRef.current.addPowerup(clickedCircle.type);
              if (added) {
                setQueuedPowerups(powerupQueueRef.current.getQueuedPowerups());
                console.log('Powerup added to queue:', clickedCircle.type, 'Queue size:', powerupQueueRef.current.getCount());
              } else {
                console.log('Queue is full, powerup not added');
              }
            }
          }
        } else {
          // Normal circle - add score with multiplier
          const points = getScoreForCircle(clickedCircle) * scoreMultiplier;
          setScore(prevScore => prevScore + points);
        }
      }
      return prev.filter(circle => circle.id !== circleId);
    });
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCircles([]);
    setLives(3);
    setGameOver(false);
    setActivePowerup(null);
    setScoreMultiplier(1);
    lifeStackRef.current = new LifeStack(10);
    powerupQueueRef.current = new PowerupQueue();
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setCircles([]);
    setCurrentTime(Date.now());
    setLives(3);
    setGameOver(false);
    setAnimatingHearts([]);
    setActivePowerup(null);
    setScoreMultiplier(1);
    setShowSaveScore(false);
  };

  const handleGameEnd = () => {
    if (score > 0) {
      setShowSaveScore(true);
    }
  };

  // Animation loop for circle scaling
  useEffect(() => {
    if (!gameStarted) return;

    const animationFrame = setInterval(() => {
      setCurrentTime(Date.now());
    }, 16); // ~60fps

    return () => clearInterval(animationFrame);
  }, [gameStarted]);



  // Powerup management
  useEffect(() => {
    if (!activePowerup) return;

    const checkPowerup = setInterval(() => {
      const now = Date.now();
      if (now >= activePowerup.endTime) {
        // Powerup expired
        if (activePowerup.type === 'doublescore') {
          setScoreMultiplier(1);
        }

        // Check if there's a next powerup in queue
        if (powerupQueueRef.current && !powerupQueueRef.current.isEmpty()) {
          const nextPowerup = powerupQueueRef.current.removePowerup();
          if (nextPowerup) {
            setQueuedPowerups(powerupQueueRef.current.getQueuedPowerups());
            console.log('Activating next powerup from queue:', nextPowerup, 'Remaining queue:', powerupQueueRef.current.getQueuedPowerups());
            activatePowerup(nextPowerup);
          } else {
            setActivePowerup(null);
          }
        } else {
          setActivePowerup(null);
        }
      }
    }, 100);

    return () => clearInterval(checkPowerup);
  }, [activePowerup]);

  // Circle spawning (affected by slow time)
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const baseInterval = 800;
    const spawnInterval = activePowerup?.type === 'slowtime' ? baseInterval * 1.5 : baseInterval;

    const interval = setInterval(() => {
      createCircle();
    }, spawnInterval);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver, createCircle, activePowerup]);

  return (
    <div className="game-page h-screen w-screen bg-linear-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Header UI */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center">
        <div className="text-white">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold">Bubble.io</h1>
            <button
              onClick={() => navigate('/leaderboard')}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-semibold transition-colors"
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div ref={heartsContainerRef} className="flex items-center gap-1 relative">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="relative">
                  {i < lives ? (
                    <Heart className={`w-6 h-6 text-red-500 fill-red-500 transition-all duration-200 ${i === lives - 1 && animatingHearts.length > 0 ? 'animate-pulse scale-110' : ''
                      }`} />
                  ) : (
                    <HeartCrack className="w-6 h-6 text-gray-600" />
                  )}
                </div>
              ))}

              {/* Animated hearts flying from click position */}
              {animatingHearts.map((heart) => {
                // Calculate target position based on actual heart container position
                let targetX = heart.startX;
                let targetY = heart.startY;

                if (heartsContainerRef.current) {
                  const containerRect = heartsContainerRef.current.getBoundingClientRect();
                  // Target the position where the new heart will appear (lives - 1 because we already incremented)
                  targetX = containerRect.left + (lives - 1) * 28 + 12; // 28px gap + 12px to center
                  targetY = containerRect.top + 12; // Center vertically
                }

                return (
                  <Heart
                    key={heart.id}
                    className="fixed w-6 h-6 text-red-500 fill-red-500 pointer-events-none z-50"
                    style={{
                      left: `${heart.startX}px`,
                      top: `${heart.startY}px`,
                      animation: `heartFly 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                      '--target-x': `${targetX - heart.startX}px`,
                      '--target-y': `${targetY - heart.startY}px`,
                    } as React.CSSProperties}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Powerup Status Bar */}
          {(activePowerup || queuedPowerups.length > 0) && (
            <div className="flex flex-col gap-1">
              {/* Powerup Icons Row */}
              <div className="flex items-center gap-1">
                {/* Active Powerup */}
                {activePowerup && (
                  <div className="relative">
                    {activePowerup.type === 'slowtime' ? (
                      <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <Zap className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Queued Powerups */}
                {queuedPowerups.slice(0, 4).map((powerup, index) => (
                  <div key={index} className="relative">
                    {powerup === 'slowtime' ? (
                      <div className="w-7 h-7 bg-blue-500/40 rounded-full flex items-center justify-center border-2 border-white/40">
                        <Clock className="w-4 h-4 text-white/70" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 bg-yellow-500/40 rounded-full flex items-center justify-center border-2 border-white/40">
                        <Zap className="w-4 h-4 text-white/70 fill-white/70" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Progress Bar */}
              {activePowerup && (
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${activePowerup.type === 'slowtime' ? 'bg-blue-400' : 'bg-yellow-400'} transition-all duration-100`}
                    style={{
                      width: `${Math.max(0, ((activePowerup.endTime - Date.now()) / (activePowerup.type === 'slowtime' ? 20000 : 15000)) * 100)}%`
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <UserMenu />
          <div className="text-right text-white">
            <div className="text-4xl font-bold text-green-400 mb-2">
              {score}
            </div>
            <div className="text-sm text-gray-300">Score {scoreMultiplier > 1 && `(${scoreMultiplier}x)`}</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="h-full w-full relative pt-24">
        {/* Bubbles */}
        {circles.map((circle) => {
          const scale = getCircleScale(circle);
          const points = getScoreForCircle(circle);
          return (
            <Bubble
              key={circle.id}
              id={circle.id}
              x={circle.x}
              y={circle.y}
              size={circle.size}
              color={circle.color}
              scale={scale}
              points={points}
              type={circle.type}
              onClick={handleCircleClick}
            />
          );
        })}

        {/* Particle Effects */}
        {particles.map((particle) => (
          <ParticleEffect
            key={particle.id}
            x={particle.x}
            y={particle.y}
            color={particle.color}
            onComplete={() => setParticles(p => p.filter(pa => pa.id !== particle.id))}
          />
        ))}

        {/* Game Controls */}
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              {gameOver ? (
                <div>
                  <h2 className="text-4xl font-bold mb-4">
                    Game Over!
                  </h2>
                  <p className="text-xl mb-6">Final Score: {score}</p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleGameEnd}
                      className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg text-xl font-semibold transition-colors"
                    >
                      Save Score
                    </button>
                    <button
                      onClick={resetGame}
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-semibold transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-4xl font-bold mb-4">Ready to Pop?</h2>
                  <p className="text-lg mb-6 text-gray-300">Click bubbles to score • Collect powerups • Survive as long as you can!</p>
                  <button
                    onClick={startGame}
                    className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg text-xl font-semibold transition-colors"
                  >
                    Start Game
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-white/70 text-sm">
        <p>💗 Pink = +1 life • 🕐 Blue = Slow time • ⚡ Yellow = 2x score</p>
      </div>

      {/* Save Score Modal */}
      {showSaveScore && (
        <SaveScoreModal
          score={score}
          onClose={() => setShowSaveScore(false)}
          onSaved={() => {
            // Could refresh leaderboard here if displayed
          }}
        />
      )}
    </div>
  );
}