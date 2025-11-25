'use client';

import React from 'react';

const ChristmasLights = () => {
    const colors = ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff', '#00ffff'];
    const lights = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
        delay: (i * 0.15) % 2
    }));

    return (
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-around px-2 py-1">
            {lights.map((light) => (
                <div
                    key={light.id}
                    className="relative w-3 h-3 rounded-full"
                    style={{
                        backgroundColor: light.color,
                        animation: `blink 2s infinite`,
                        animationDelay: `${light.delay}s`,
                        boxShadow: `0 0 10px ${light.color}`,
                    }}
                >
                    <div
                        className="absolute -top-2 left-1/2 w-0.5 h-2 bg-slate-700"
                        style={{ transform: 'translateX(-50%)' }}
                    />
                </div>
            ))}
        </div>
    );
};

export default ChristmasLights;

