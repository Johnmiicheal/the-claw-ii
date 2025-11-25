'use client';

import React from 'react';
import { Trophy, Frown, Gift, Star, Award } from 'lucide-react';
import ChristmasTree from './ChristmasTree';
import type { LeaderboardEntry } from '@/store/gameStore';

interface GameOverScreenProps {
    playerName: string;
    score: number;
    isWin: boolean;
    leaderboard: LeaderboardEntry[];
    onPlayAgain: () => void;
}

const winMessages = [
    "You've been a great help to Santa!",
    "The elves are singing your praises!",
    "Santa's adding you to the NICE list (in BOLD)!",
    "Mrs. Claus baked you cookies!",
    "You're officially an Honorary Elf!",
    "Christmas is SAVED thanks to you!",
    "Rudolph wants your autograph!",
];

const loseMessages = [
    "Christmas is ruined! 😢",
    "Santa's disappointed... but he still loves you!",
    "The Grinch is laughing somewhere...",
    "Kids are getting socks this year...",
    "Even Rudolph couldn't save this one!",
    "The elves are working overtime now...",
    "Your name's on the Naughty List... temporarily!",
];

const GameOverScreen = ({ playerName, score, isWin, leaderboard, onPlayAgain }: GameOverScreenProps) => {
    const [message] = React.useState(() => {
        const messages = isWin ? winMessages : loseMessages;
        return messages[Math.floor(Math.random() * messages.length)];
    });

    const playerRank = leaderboard.findIndex(entry => 
        entry.name === playerName && entry.score === score
    ) + 1;

    return (
        <div className="absolute inset-0 z-30 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center backdrop-blur-sm overflow-y-auto py-8">
            <div className="absolute top-4 left-4">
                <ChristmasTree size="medium" />
            </div>
            <div className="absolute top-4 right-4">
                <ChristmasTree size="medium" />
            </div>
            
            <div className="text-center px-4 max-w-4xl">
                <div className="mb-6 flex items-center justify-center gap-4">
                    {isWin ? (
                        <>
                            <Trophy className="text-yellow-400 w-16 h-16 animate-bounce" />
                            <Star className="text-yellow-300 w-12 h-12" style={{ animation: 'twinkle 1s infinite' }} />
                        </>
                    ) : (
                        <>
                            <Frown className="text-slate-400 w-16 h-16" />
                            <Gift className="text-red-500 w-12 h-12 opacity-50" />
                        </>
                    )}
                </div>
                
                <h1 className={`snowburst-font text-5xl md:text-7xl mb-4 drop-shadow-lg ${
                    isWin ? 'text-yellow-400' : 'text-slate-400'
                }`}>
                    {isWin ? 'VICTORY!' : 'TIME\'S UP!'}
                </h1>
                
                <div className={`christmas-font text-2xl md:text-3xl mb-6 font-bold ${
                    isWin ? 'text-emerald-400' : 'text-red-400'
                }`}>
                    {message}
                </div>
                
                <div className="bg-slate-900/80 border-4 border-red-600 rounded-lg p-6 mb-6 backdrop-blur-sm">
                    <div className="christmas-font text-white space-y-2">
                        <p className="text-xl">
                            <span className="text-emerald-400">Player:</span> {playerName}
                        </p>
                        <p className="text-3xl md:text-4xl">
                            <span className="text-yellow-400">Score:</span> <span className="text-white font-bold">{score}</span>
                        </p>
                        {playerRank > 0 && playerRank <= 10 && (
                            <p className="text-lg text-yellow-300 flex items-center justify-center gap-2">
                                <Award className="w-5 h-5" />
                                Rank #{playerRank} on Leaderboard!
                            </p>
                        )}
                    </div>
                </div>
                
                {leaderboard.length > 0 && (
                    <div className="bg-slate-900/80 border-4 border-emerald-600 rounded-lg p-6 mb-6 backdrop-blur-sm max-h-64 overflow-y-auto">
                        <h2 className="snowburst-font text-2xl md:text-3xl text-yellow-400 mb-4">
                            LEADERBOARD
                        </h2>
                        <div className="space-y-2">
                            {leaderboard.slice(0, 10).map((entry, index) => {
                                const isCurrentPlayer = entry.name === playerName && entry.score === score;
                                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                                
                                return (
                                    <div
                                        key={`${entry.name}-${entry.score}-${index}`}
                                        className={`flex items-center justify-between py-2 px-4 rounded ${
                                            isCurrentPlayer 
                                                ? 'bg-yellow-900/50 border-2 border-yellow-400' 
                                                : 'bg-slate-800/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="christmas-font text-lg text-slate-400 w-8">
                                                {medal || `#${index + 1}`}
                                            </span>
                                            <span className={`christmas-font text-lg ${
                                                isCurrentPlayer ? 'text-yellow-300 font-bold' : 'text-white'
                                            }`}>
                                                {entry.name}
                                            </span>
                                        </div>
                                        <span className={`christmas-font text-xl font-bold ${
                                            isCurrentPlayer ? 'text-yellow-400' : 'text-emerald-400'
                                        }`}>
                                            {entry.score}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                
                <button
                    onClick={onPlayAgain}
                    className="snowburst-font bg-red-700 hover:bg-red-600 text-white font-bold py-6 px-12 rounded-full text-2xl md:text-3xl active:translate-y-2 transition-all border-4 border-b-9 border-green-500 "
                >
                    PLAY AGAIN!
                </button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <ChristmasTree size="medium" />
                <ChristmasTree size="large" />
                <ChristmasTree size="medium" />
            </div>
        </div>
    );
};

export default GameOverScreen;

