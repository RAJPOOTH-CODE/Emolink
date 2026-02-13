import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RefreshCcw, Heart } from 'lucide-react';
import { TEMPLATES } from '../constants';
import { playTone, playBackgroundMusic } from '../utils/audio';

const ReceiverView = ({ data, onReplay }) => {
    const [count, setCount] = useState(10);
    const [phase, setPhase] = useState('countdown');
    const template = TEMPLATES[data.template] || TEMPLATES.birthday;

    useEffect(() => {
        if (phase === 'countdown') {
            if (count > 0) {
                const timer = setTimeout(() => {
                    playTone(800, 0.1, 'square');
                    setCount(count - 1);
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                setPhase('reveal');
                playBackgroundMusic(template.music);
                triggerEffects();
            }
        }
    }, [count, phase, template.music]);

    const triggerEffects = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        if (data.template === 'birthday' || data.template === 'proposal') {
            const heartInterval = setInterval(() => {
                if (Date.now() > animationEnd) return clearInterval(heartInterval);
                createHeart();
            }, 300);
        }
    };

    const createHeart = () => {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'fixed text-4xl pointer-events-none animate-float-up z-50';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.bottom = '-20px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
            {/* Background Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: '110vh', x: `${Math.random() * 100}vw`, opacity: 0.1 }}
                        animate={{ y: '-10vh', opacity: [0.1, 0.3, 0] }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {phase === 'countdown' ? (
                    <motion.div
                        key="countdown"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="text-center z-10"
                    >
                        <p className="text-2xl md:text-3xl mb-8 text-blue-200 animate-pulse font-light tracking-widest uppercase">
                            Get ready for something special...
                        </p>
                        <motion.div
                            key={count}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-[12rem] md:text-[16rem] font-bold text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.3)] leading-none"
                        >
                            {count}
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="reveal"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="w-full max-w-2xl z-10"
                    >
                        <div className={`rounded-[2.5rem] overflow-hidden shadow-2xl bg-gradient-to-br ${template.bg} p-1.5`}>
                            <div className="bg-white rounded-[2.3rem] p-10 md:p-16 text-center">
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="text-9xl mb-8"
                                >
                                    {template.emoji}
                                </motion.div>

                                <h1 className={`font-dancing text-6xl md:text-7xl ${template.color} mb-8`}>
                                    {template.title}
                                </h1>

                                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-auto mb-10" />

                                <div className="space-y-6 text-gray-700">
                                    <p className="text-3xl font-light">Dear <span className="font-semibold">{data.receiver}</span>,</p>
                                    <p className="text-2xl md:text-3xl leading-relaxed font-dancing italic text-gray-600">
                                        "{data.message}"
                                    </p>
                                </div>

                                <div className="mt-12 pt-10 border-t border-gray-100">
                                    <p className="text-gray-400 text-sm uppercase tracking-[0.3em] font-medium mb-3">With love,</p>
                                    <p className={`text-4xl font-bold ${template.color} tracking-tight`}>{data.sender}</p>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            onClick={onReplay}
                            className="mt-12 mx-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 px-8 py-3 rounded-full backdrop-blur transition-all text-white/80"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Watch Experience Again
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReceiverView;
