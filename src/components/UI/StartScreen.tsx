'use client';

import React, { useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import ChristmasTree from './ChristmasTree';

interface StartScreenProps {
    onStart: (playerName: string) => void;
}

const funnyStartMessages = [
    "Santa's elves are on strike! Can you save Christmas?",
    "The North Pole needs your grabbing skills!",
    "Mrs. Claus says you're the chosen one!",
    "Rudolph bet you can't grab 5 gifts...",
    "The Naughty List has been hacked! Prove you're nice!",
    "Santa's GPS broke. He needs these gifts ASAP!",
    "Elves Union demands: No presents left behind!",
];

const StartScreen = ({ onStart }: StartScreenProps) => {
    const [playerName, setPlayerName] = useState('');
    const [message] = useState(() => 
        funnyStartMessages[Math.floor(Math.random() * funnyStartMessages.length)]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (playerName.trim()) {
            onStart(playerName.trim());
        }
    };

    return (
        <div className="absolute inset-0 z-30 bg-gradient-to-b from-slate-950 via-red-950/50 to-slate-950 flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="absolute top-4 left-4">
                <ChristmasTree size="medium" />
            </div>
            <div className="absolute top-4 right-4">
                <ChristmasTree size="medium" />
            </div>
            
            <div className="text-center px-4 max-w-2xl">
                <div className="mb-4 flex items-center justify-center gap-2">
                    <Gift className="text-red-500 w-12 h-12 animate-bounce" />
                    <Sparkles className="text-yellow-300 w-8 h-8" style={{ animation: 'twinkle 1.5s infinite' }} />
                </div>
                
                <h1 className="snowburst-font text-6xl md:text-8xl text-white mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    style={{ textShadow: '3px 3px 0 #dc2626, -1px -1px 0 #16a34a' }}>
                    THE CLAW
                </h1>
                
                <div className="christmas-font text-3xl md:text-4xl text-emerald-400 mb-8 font-bold">
                    Christmas Edition
                </div>
                
                <div className="bg-slate-900/80 border-4 border-red-600 rounded-lg p-6 mb-8 backdrop-blur-sm">
                    <p className="christmas-font text-xl md:text-2xl text-white mb-4 leading-relaxed">
                        {message}
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Enter your name..."
                            maxLength={20}
                            className="w-full max-w-md px-6 py-4 text-2xl text-center bg-slate-900 border-4 border-emerald-500 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/50 transition-all christmas-font"
                            autoFocus
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={!playerName.trim()}
                        className="snowburst-font bg-red-700 hover:bg-red-600 text-emerald-300 font-bold py-6 px-12 rounded-full text-2xl md:text-3xl active:translate-y-2 transition-all border-4 border-b-9 border-emerald-500 "
                        >
                        START GRABBING!
                    </button>
                </form>
                
                <div className="mt-8 font-mono text-slate-400 text-md">
                    <p>Goal: Grab 500 points worth of gifts before time runs out!</p>
                    <p className="mt-1">Each gift = 100 points</p>
                </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <ChristmasTree size="large" />
                <div className="flex gap-4">
                    <ChristmasTree size="small" />
                    <ChristmasTree size="medium" />
                </div>
            </div>
        </div>
    );
};

export default StartScreen;

