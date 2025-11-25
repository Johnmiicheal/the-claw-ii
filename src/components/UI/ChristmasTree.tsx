'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface ChristmasTreeProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const ChristmasTree = ({ size = 'medium', className = '' }: ChristmasTreeProps) => {
    const sizes = {
        small: 'w-12 h-16',
        medium: 'w-16 h-20',
        large: 'w-20 h-24'
    };

    return (
        <div className={`relative ${sizes[size]} ${className}`}>
            <Star 
                className="absolute top-0 left-1/2 -translate-x-1/2 text-yellow-300 fill-yellow-300 z-10" 
                size={size === 'small' ? 12 : size === 'medium' ? 16 : 20}
                style={{ animation: 'twinkle 2s infinite' }}
            />
            
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                    borderLeft: size === 'small' ? '12px solid transparent' : size === 'medium' ? '16px solid transparent' : '20px solid transparent',
                    borderRight: size === 'small' ? '12px solid transparent' : size === 'medium' ? '16px solid transparent' : '20px solid transparent',
                    borderBottom: size === 'small' ? '16px solid #16a34a' : size === 'medium' ? '20px solid #16a34a' : '24px solid #16a34a',
                }}
            />
            
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                    borderLeft: size === 'small' ? '14px solid transparent' : size === 'medium' ? '18px solid transparent' : '22px solid transparent',
                    borderRight: size === 'small' ? '14px solid transparent' : size === 'medium' ? '18px solid transparent' : '22px solid transparent',
                    borderBottom: size === 'small' ? '18px solid #16a34a' : size === 'medium' ? '22px solid #16a34a' : '26px solid #16a34a',
                }}
            />
            
            <div className="absolute top-9 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                    borderLeft: size === 'small' ? '16px solid transparent' : size === 'medium' ? '20px solid transparent' : '24px solid transparent',
                    borderRight: size === 'small' ? '16px solid transparent' : size === 'medium' ? '20px solid transparent' : '24px solid transparent',
                    borderBottom: size === 'small' ? '20px solid #16a34a' : size === 'medium' ? '24px solid #16a34a' : '28px solid #16a34a',
                }}
            />
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-amber-800"
                style={{
                    width: size === 'small' ? '8px' : size === 'medium' ? '10px' : '12px',
                    height: size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px',
                }}
            />
            
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                        backgroundColor: ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff'][i],
                        left: `${20 + i * 15}%`,
                        top: `${40 + i * 10}%`,
                        animation: `twinkle ${1.5 + i * 0.3}s infinite`,
                        animationDelay: `${i * 0.2}s`,
                        boxShadow: `0 0 6px ${['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff'][i]}`,
                    }}
                />
            ))}
        </div>
    );
};

export default ChristmasTree;

