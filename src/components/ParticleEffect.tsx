import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    delay: number;
}

interface ParticleEffectProps {
    x: number;
    y: number;
    color: string;
    onComplete: () => void;
}

export default function ParticleEffect({ x, y, color, onComplete }: ParticleEffectProps) {
    const [particles] = useState<Particle[]>(() => {
        const particleCount = 12; // Increased for more dramatic effect
        return Array.from({ length: particleCount }, (_, i) => {
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
            const speed = 3 + Math.random() * 4;
            return {
                id: i,
                x: 0,
                y: 0,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                size: 3 + Math.random() * 6,
                delay: Math.random() * 0.1,
            };
        });
    });

    useEffect(() => {
        const timer = setTimeout(onComplete, 800);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div
            className="absolute pointer-events-none"
            style={{
                left: `${x}px`,
                top: `${y}px`,
            }}
        >
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className={`absolute rounded-full ${particle.color} will-change-transform`}
                    style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        boxShadow: `0 0 ${particle.size * 2}px currentColor`,
                    }}
                    initial={{
                        x: 0,
                        y: 0,
                        scale: 1,
                        opacity: 1,
                        rotate: 0,
                    }}
                    animate={{
                        x: particle.vx * 30,
                        y: particle.vy * 30,
                        scale: [1, 1.2, 0],
                        opacity: [1, 0.8, 0],
                        rotate: 360,
                    }}
                    transition={{
                        duration: 0.8,
                        delay: particle.delay,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                />
            ))}
        </div>
    );
}
