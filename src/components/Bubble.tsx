import { Heart, Clock, Zap } from 'lucide-react';

interface BubbleProps {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    scale: number;
    points: number;
    type: 'normal' | 'life' | 'slowtime' | 'doublescore';
    onClick: (id: number) => void;
}

export default function Bubble({ id, x, y, size, color, scale, points, type, onClick }: BubbleProps) {
    const getIcon = () => {
        switch (type) {
            case 'life':
                return <Heart className="w-4 h-4 text-white fill-white" />;
            case 'slowtime':
                return (
                    <div className="flex flex-col items-center gap-0.5">
                        <Clock className="w-3 h-3 text-white" />
                        <span className="text-[8px] font-bold text-white leading-none">SLOW</span>
                    </div>
                );
            case 'doublescore':
                return (
                    <div className="flex flex-col items-center gap-0.5">
                        <Zap className="w-3 h-3 text-white fill-white" />
                        <span className="text-[10px] font-bold text-white leading-none">2X</span>
                    </div>
                );
            default:
                return points;
        }
    };

    const getGlowColor = () => {
        switch (type) {
            case 'life':
                return 'shadow-pink-500/50';
            case 'slowtime':
                return 'shadow-blue-500/50';
            case 'doublescore':
                return 'shadow-yellow-500/50';
            default:
                return 'shadow-white/30';
        }
    };

    return (
        <div
            className={`absolute rounded-full cursor-pointer transition-all duration-100 hover:scale-110 ${color} shadow-2xl ${getGlowColor()} border-2 border-white/40 backdrop-blur-sm ${type !== 'normal' ? 'animate-pulse' : ''}`}
            style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${size}px`,
                height: `${size}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'center',
                boxShadow: `0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px ${type !== 'normal' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                animation: type !== 'normal' ? 'glowPulse 2s ease-in-out infinite' : 'none',
            }}
            onClick={() => onClick(id)}
        >
            {/* Glossy effect overlay */}
            <div 
                className="absolute inset-0 rounded-full"
                style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)',
                }}
            />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold pointer-events-none z-10">
                {getIcon()}
            </div>

            {/* Animated ring for powerups */}
            {type !== 'normal' && (
                <div 
                    className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"
                    style={{
                        animationDuration: '2s',
                    }}
                />
            )}
        </div>
    );
}
