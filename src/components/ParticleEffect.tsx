import { useEffect, useState } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
}

interface ParticleEffectProps {
    x: number;
    y: number;
    color: string;
    onComplete: () => void;
}

export default function ParticleEffect({ x, y, color, onComplete }: ParticleEffectProps) {
    const [particles] = useState<Particle[]>(() => {
        const particleCount = 8;
        return Array.from({ length: particleCount }, (_, i) => {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 2 + Math.random() * 2;
            return {
                id: i,
                x: 0,
                y: 0,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                size: 4 + Math.random() * 4,
            };
        });
    });

    useEffect(() => {
        const timer = setTimeout(onComplete, 500);
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
                <div
                    key={particle.id}
                    className={`absolute rounded-full ${particle.color}`}
                    style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animation: 'particleExplosion 0.5s ease-out forwards',
                        '--vx': `${particle.vx * 20}px`,
                        '--vy': `${particle.vy * 20}px`,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
}
