'use client';

import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, AlertTriangle } from 'lucide-react';
import ChristmasTree from './ChristmasTree';

const MobileWarning = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
            const isSmallScreen = window.innerWidth < 1024;
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            
            setIsMobile((isMobileDevice || isSmallScreen) && isTouchDevice);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!isMobile) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <ChristmasTree size="medium" />
            </div>
            <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <ChristmasTree size="medium" />
            </div>
            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                <ChristmasTree size="large" />
            </div>
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                <ChristmasTree size="large" />
            </div>

            <div className="max-w-2xl text-center space-y-6 px-6">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <AlertTriangle className="text-red-500 w-20 h-20 animate-pulse" />
                </div>

                <h1 className="snowburst-font text-5xl md:text-7xl text-red-500 mb-6">
                    DESKTOP ONLY!
                </h1>

                <div className="bg-slate-900/90 border-4 border-red-600 rounded-lg p-8 backdrop-blur-sm space-y-6">
                    <Monitor className="w-20 h-20 text-emerald-400 mx-auto" />
                    
                    <p className="christmas-font text-3xl text-white leading-relaxed font-bold">
                        This game requires a <span className="text-emerald-400">Desktop or Laptop</span>
                    </p>

                    <div className="font-mono text-md text-slate-300 space-y-3">
                        <p className="text-red-400 font-bold">Required:</p>
                        <ul className="text-left max-w-md mx-auto space-y-2">
                            <li>✓ Desktop or Laptop computer</li>
                            <li>✓ Working webcam</li>
                            <li>✓ Good lighting for hand tracking</li>
                            <li>✓ Both hands free to play</li>
                        </ul>
                    </div>

                    <div className="pt-4 border-t-2 border-red-500/50">
                        <p className="arcade-font text-yellow-400 text-md font-bold">
                            Mobile and tablet devices are not supported!
                        </p>
                        <p className="arcade-font text-slate-400 text-xs mt-2">
                            Please visit this page on a desktop computer to play.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileWarning;

