'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import HandTracker from '@/components/Vision/HandTracker';
import Scene from '@/components/Game/ClawMachine';
import { useGameStore } from '@/store/gameStore';
import { Html } from '@react-three/drei';
import ChristmasLights from '@/components/UI/ChristmasLights';
import ChristmasTree from '@/components/UI/ChristmasTree';
import StartScreen from '@/components/UI/StartScreen';
import GameOverScreen from '@/components/UI/GameOverScreen';
import MobileWarning from '@/components/UI/MobileWarning';

const LoadingFallback = () => (
    <Html center>
        <div className="flex flex-col items-center justify-center text-yellow-400 whitespace-nowrap">
            <p className="arcade-font text-xs animate-pulse bg-black/50 p-2 rounded">LOADING...</p>
        </div>
    </Html>
);

export default function Home() {
  const { 
    score, 
    timeLeft, 
    gameStatus, 
    playerName,
    leaderboard,
    startGame, 
    decrementTime, 
    endGame, 
    invertControls, 
    toggleInvertControls,
    loadLeaderboard,
    resetGame
  } = useGameStore();

  React.useEffect(() => {
      loadLeaderboard();
  }, [loadLeaderboard]);

  React.useEffect(() => {
      let interval: NodeJS.Timeout;
      if (gameStatus === 'playing' && timeLeft > 0) {
          interval = setInterval(() => {
              decrementTime();
          }, 1000);
      } else if (timeLeft === 0 && gameStatus === 'playing') {
          endGame();
      }
      return () => clearInterval(interval);
  }, [gameStatus, timeLeft, decrementTime, endGame]);

  return (
    <>
    <MobileWarning />
    <main className="flex min-h-screen flex-col md:flex-row bg-black text-white overflow-hidden">
      
      {/* Left Panel: Computer Vision / Webcam */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen p-4 flex flex-col relative z-30 bg-black">
        <ChristmasLights />
        
        {/* Camcorder Frame */}
        <div className="flex-1 relative mt-8 bg-black border-8 border-slate-800 rounded shadow-2xl" style={{
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)'
        }}>
            {/* VHS Scan Lines Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-30" style={{
                background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
            }} />
            
            {/* Corner Frame Indicators */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-red-500 z-20" />
            <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-red-500 z-20" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-red-500 z-20" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-red-500 z-20" />
            
            {/* Top HUD */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent px-5 py-4 z-20 space-y-1">
                <div className="flex items-center justify-between">
                    {/* REC Indicator */}
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                        <span className="font-mono text-red-500 font-bold text-sm tracking-wider">REC</span>
                    </div>
                    
                    {/* Battery */}
                    <div className="flex items-center gap-1">
                        <div className="border-2 border-white/70 pr-2 pl-0.5 py-0.5">
                            <div className="w-8 h-2 bg-green-400" />
                        </div>
                        <div className="w-1 h-2 bg-white/70" />
                    </div>
                </div>
                
                {/* Timestamp */}
                <div className="font-mono text-white/90 text-xs tracking-wider">
                    {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })} {new Date().toLocaleTimeString('en-US', { hour12: false })}
                </div>
            </div>
            
            {/* Bottom HUD */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4 z-20">
                <div className="font-mono text-white/90 text-xs tracking-wider flex justify-between items-center">
                    <span>SANTA CAM-2025</span>
                    <span className="text-green-400">TRACKING</span>
                </div>
            </div>
            
            {/* Video Feed */}
            <div className="w-full h-full relative">
                <HandTracker />
            </div>
        </div>
        
        {/* Camcorder Control Panel */}
        <div className="mt-4 p-4 bg-slate-900 rounded border-4 border-slate-700 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-50" />
            <div className="absolute top-1 right-1">
                <ChristmasTree size="small" className="opacity-20" />
            </div>
            <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <h3 className="font-mono text-green-400 text-xs font-bold tracking-wider">OPERATION MANUAL</h3>
                </div>
                <ul className="font-mono text-xs space-y-1.5 text-slate-300">
                    <li className="flex items-start gap-2">
                        <span className="text-red-400">▸</span>
                        <span>Allow Camera Access</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-400">▸</span>
                        <span>Select camera device below</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-yellow-400">▸</span>
                        <span>Show hand. LEFT/RIGHT moves Claw</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-400">▸</span>
                        <span>PINCH fingers to GRAB Gifts</span>
                    </li>
                </ul>
            </div>
        </div>
                <p className="font-mono text-xs text-slate-400">Original concept and implementation by <a href="https://x.com/measure_plan/status/1993050841155309644" target="_blank" className="text-yellow-400">[@measure_plan](https://x.com/measure_plan/status/1993050841155309644)</a></p>
      </div>

      {/* Right Panel: Arcade Cabinet */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative bg-slate-950 z-0 flex items-center justify-center p-8">
        
        {/* Arcade Cabinet Frame */}
        <div className="relative w-full h-full flex flex-col" style={{
            backgroundImage: `repeating-conic-gradient(#dc2626 0% 25%, #16a34a 0% 50%)`,
            backgroundPosition: '0 0, 20px 20px',
            backgroundSize: '40px 40px',
            padding: '20px'
        }}>
            
            {/* Header Bar */}
            <div className="bg-red-800 py-4 px-6 flex items-center justify-center relative border-b-4 border-emerald-600">
                <ChristmasLights />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <ChristmasTree size="small" />
                </div>
                <h1 className="snowburst-font text-3xl md:text-4xl text-white tracking-tight z-10">
                    SANTA'S WORKSHOP
                </h1>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <ChristmasTree size="small" />
                </div>
            </div>

            {/* Game View Container */}
            <div className="flex-1 relative bg-sky-900 overflow-hidden">
                
                {/* Score Displays */}
                {gameStatus === 'playing' && (
                    <div className="absolute top-4 left-4 right-4 z-20 flex justify-between pointer-events-none">
                        <div className="bg-slate-900 border-4 border-emerald-500 px-4 py-2 rounded-lg shadow-lg">
                            <div className="text-emerald-400 arcade-font text-lg md:text-xl">
                                TIME: {timeLeft}
                            </div>
                        </div>
                        
                        <div className="bg-slate-900 border-4 border-red-500 px-4 py-2 rounded-lg shadow-lg">
                             <div className="text-red-400 arcade-font text-lg md:text-xl">
                                GIFTS: {Math.floor(score / 100)}
                            </div>
                        </div>
                    </div>
                )}

                {/* Player Name Display */}
                {gameStatus === 'playing' && playerName && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                        <div className="bg-slate-900/90 border-2 border-yellow-400 px-4 py-1 rounded-full">
                            <span className="arcade-font text-yellow-300 text-lg">{playerName}</span>
                        </div>
                    </div>
                )}

                {/* Invert Control */}
                {gameStatus === 'playing' && (
                    <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
                         <label className="flex items-center gap-2 cursor-pointer bg-slate-900/80 p-2 rounded border border-emerald-700/50 hover:bg-slate-900 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={invertControls} 
                                onChange={toggleInvertControls}
                                className="w-4 h-4 accent-emerald-400"
                            />
                            <span className="text-xs christmas-font text-white">INVERT X</span>
                         </label>
                    </div>
                )}

                {/* Start Screen */}
                {gameStatus === 'start' && (
                    <StartScreen onStart={(name) => startGame(name)} />
                )}

                {/* Game Over Screen */}
                {(gameStatus === 'won' || gameStatus === 'lost') && (
                    <GameOverScreen 
                        playerName={playerName}
                        score={score}
                        isWin={gameStatus === 'won'}
                        leaderboard={leaderboard}
                        onPlayAgain={resetGame}
                    />
                )}

                {/* 3D Scene */}
                <div className="w-full h-full absolute inset-0">
                    <Canvas 
                        shadows 
                        dpr={[1, 1.5]} 
                        gl={{ powerPreference: "high-performance", antialias: true }}
                        camera={{ position: [0, 14, 26], fov: 50 }}
                        onCreated={({ camera }) => {
                            camera.lookAt(0, 2, 0);
                        }}
                        className="w-full h-full"
                    >
                        <Suspense fallback={<LoadingFallback />}>
                            <Scene />
                        </Suspense>
                    </Canvas>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-emerald-800 py-4 px-6 flex items-center justify-between border-t-4 border-red-600 relative">
                <ChristmasLights />
                <ChristmasTree size="small" />
                <p className="christmas-font text-white font-bold text-xl md:text-2xl">
                    HAPPY HOLIDAYS!
                </p>
                <ChristmasTree size="small" />
            </div>

        </div>
      </div>

    </main>
    </>
  );
}
