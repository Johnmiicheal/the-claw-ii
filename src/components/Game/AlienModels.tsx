import React from 'react';
import { Box, Sphere, Cylinder } from '@react-three/drei';

const VoxelGroup = ({ children, position }: { children: React.ReactNode, position?: [number, number, number] }) => (
    <group position={position} scale={[0.6, 0.6, 0.6]}>
        {children}
    </group>
);

const GIFT_COLORS = [
    { box: '#7c3aed', ribbon: '#fbbf24' },
    { box: '#0891b2', ribbon: '#f97316' },
    { box: '#be185d', ribbon: '#22d3ee' },
    { box: '#15803d', ribbon: '#fcd34d' },
    { box: '#b91c1c', ribbon: '#4ade80' },
];

export const GiftBox = ({ id = 0 }: { id?: number }) => {
    const colorSet = GIFT_COLORS[id % GIFT_COLORS.length];
    
    return (
        <VoxelGroup>
            <Box args={[2.5, 2.2, 2.5]} position={[0, 1.1, 0]}>
                <meshStandardMaterial color={colorSet.box} roughness={0.4} />
            </Box>
            
            <Box args={[2.6, 0.4, 0.5]} position={[0, 1.1, 0]}>
                <meshStandardMaterial color={colorSet.ribbon} roughness={0.3} />
            </Box>
            <Box args={[0.5, 0.4, 2.6]} position={[0, 1.1, 0]}>
                <meshStandardMaterial color={colorSet.ribbon} roughness={0.3} />
            </Box>
            
            <Box args={[0.5, 2.3, 0.15]} position={[0, 1.1, 1.28]}>
                <meshStandardMaterial color={colorSet.ribbon} roughness={0.3} />
            </Box>
            <Box args={[0.5, 2.3, 0.15]} position={[0, 1.1, -1.28]}>
                <meshStandardMaterial color={colorSet.ribbon} roughness={0.3} />
            </Box>
            <Box args={[0.15, 2.3, 0.5]} position={[1.28, 1.1, 0]}>
                <meshStandardMaterial color={colorSet.ribbon} roughness={0.3} />
            </Box>
            <Box args={[0.15, 2.3, 0.5]} position={[-1.28, 1.1, 0]}>
                <meshStandardMaterial color={colorSet.ribbon} roughness={0.3} />
            </Box>
            
            <Sphere args={[0.4, 16, 16]} position={[0, 2.5, 0]}>
                <meshStandardMaterial color={colorSet.ribbon} roughness={0.3} />
            </Sphere>
            <Box args={[1.2, 0.25, 0.3]} position={[-0.4, 2.4, 0]} rotation={[0, 0, 0.4]}>
                <meshStandardMaterial color={colorSet.ribbon} roughness={0.3} />
            </Box>
            <Box args={[1.2, 0.25, 0.3]} position={[0.4, 2.4, 0]} rotation={[0, 0, -0.4]}>
                <meshStandardMaterial color={colorSet.ribbon} roughness={0.3} />
            </Box>
        </VoxelGroup>
    );
};

export const Snowman = () => {
    return (
        <VoxelGroup>
            <Sphere args={[1.6, 24, 24]} position={[0, 1.2, 0]}>
                <meshStandardMaterial color="#f8fafc" roughness={0.8} />
            </Sphere>
            
            <Sphere args={[1.2, 24, 24]} position={[0, 3.2, 0]}>
                <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
            </Sphere>
            
            <Sphere args={[0.15, 12, 12]} position={[0, 3.0, 1.15]}>
                <meshStandardMaterial color="#1e293b" />
            </Sphere>
            <Sphere args={[0.15, 12, 12]} position={[0, 2.5, 1.5]}>
                <meshStandardMaterial color="#1e293b" />
            </Sphere>
            
            <Sphere args={[0.9, 24, 24]} position={[0, 4.8, 0]}>
                <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
            </Sphere>
            
            <Sphere args={[0.12, 12, 12]} position={[-0.3, 5.0, 0.8]}>
                <meshStandardMaterial color="#1e293b" />
            </Sphere>
            <Sphere args={[0.12, 12, 12]} position={[0.3, 5.0, 0.8]}>
                <meshStandardMaterial color="#1e293b" />
            </Sphere>
            
            <Cylinder args={[0.08, 0.15, 0.6, 8]} position={[0, 4.7, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#ea580c" />
            </Cylinder>
            
            <Cylinder args={[1.1, 1.1, 0.15, 24]} position={[0, 5.5, 0]}>
                <meshStandardMaterial color="#1e293b" />
            </Cylinder>
            <Cylinder args={[0.7, 0.7, 0.8, 24]} position={[0, 6.0, 0]}>
                <meshStandardMaterial color="#1e293b" />
            </Cylinder>
            <Box args={[0.8, 0.15, 0.15]} position={[0, 5.7, 0.75]}>
                <meshStandardMaterial color="#dc2626" />
            </Box>
            
            <Cylinder args={[1.3, 1.3, 0.3, 24]} position={[0, 4.1, 0]}>
                <meshStandardMaterial color="#dc2626" />
            </Cylinder>
            <Box args={[0.3, 1.0, 0.25]} position={[0.8, 3.6, 0.4]} rotation={[0.2, 0, 0.3]}>
                <meshStandardMaterial color="#dc2626" />
            </Box>
        </VoxelGroup>
    );
};

export const GingerbreadMan = () => {
    return (
        <VoxelGroup>
            <Cylinder args={[0.4, 0.35, 1.2, 12]} position={[-0.6, 0.6, 0]}>
                <meshStandardMaterial color="#a16207" />
            </Cylinder>
            <Cylinder args={[0.4, 0.35, 1.2, 12]} position={[0.6, 0.6, 0]}>
                <meshStandardMaterial color="#a16207" />
            </Cylinder>
            
            <Sphere args={[0.25, 12, 12]} position={[-0.6, 0, 0]}>
                <meshStandardMaterial color="#fef3c7" />
            </Sphere>
            <Sphere args={[0.25, 12, 12]} position={[0.6, 0, 0]}>
                <meshStandardMaterial color="#fef3c7" />
            </Sphere>
            
            <Cylinder args={[0.9, 0.8, 1.8, 16]} position={[0, 2.1, 0]}>
                <meshStandardMaterial color="#ca8a04" />
            </Cylinder>
            
            <Sphere args={[0.18, 12, 12]} position={[0, 2.6, 0.75]}>
                <meshStandardMaterial color="#fef3c7" />
            </Sphere>
            <Sphere args={[0.18, 12, 12]} position={[0, 2.0, 0.8]}>
                <meshStandardMaterial color="#fef3c7" />
            </Sphere>
            
            <Cylinder args={[0.3, 0.25, 1.4, 12]} position={[-1.3, 2.2, 0]} rotation={[0, 0, Math.PI / 2.5]}>
                <meshStandardMaterial color="#a16207" />
            </Cylinder>
            <Cylinder args={[0.3, 0.25, 1.4, 12]} position={[1.3, 2.2, 0]} rotation={[0, 0, -Math.PI / 2.5]}>
                <meshStandardMaterial color="#a16207" />
            </Cylinder>
            
            <Sphere args={[0.2, 12, 12]} position={[-1.8, 1.8, 0]}>
                <meshStandardMaterial color="#fef3c7" />
            </Sphere>
            <Sphere args={[0.2, 12, 12]} position={[1.8, 1.8, 0]}>
                <meshStandardMaterial color="#fef3c7" />
            </Sphere>
            
            <Sphere args={[0.85, 24, 24]} position={[0, 3.8, 0]}>
                <meshStandardMaterial color="#ca8a04" />
            </Sphere>
            
            <Sphere args={[0.12, 12, 12]} position={[-0.3, 4.0, 0.75]}>
                <meshStandardMaterial color="#1e293b" />
            </Sphere>
            <Sphere args={[0.12, 12, 12]} position={[0.3, 4.0, 0.75]}>
                <meshStandardMaterial color="#1e293b" />
            </Sphere>
            
            <Box args={[0.5, 0.1, 0.1]} position={[0, 3.6, 0.8]}>
                <meshStandardMaterial color="#fef3c7" />
            </Box>
        </VoxelGroup>
    );
};

const ORNAMENT_COLORS = ['#dc2626', '#16a34a', '#2563eb', '#9333ea', '#0891b2'];

export const Ornament = ({ id = 0 }: { id?: number }) => {
    const color = ORNAMENT_COLORS[id % ORNAMENT_COLORS.length];
    
    return (
        <VoxelGroup>
            <Sphere args={[1.4, 24, 24]} position={[0, 1.4, 0]}>
                <meshStandardMaterial color={color} roughness={0.15} metalness={0.7} />
            </Sphere>
            
            <Cylinder args={[1.45, 1.45, 0.12, 24]} position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.8} />
            </Cylinder>
            
            <Cylinder args={[0.35, 0.35, 0.4, 16]} position={[0, 2.9, 0]}>
                <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.8} />
            </Cylinder>
            
            <Cylinder args={[0.08, 0.08, 0.5, 8]} position={[0, 3.3, 0]}>
                <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.8} />
            </Cylinder>
        </VoxelGroup>
    );
};

export const AlienSelector = ({ type, id = 0 }: { type: number, id?: number }) => {
    switch(type % 4) {
        case 0: return <GiftBox id={id} />;
        case 1: return <Snowman />;
        case 2: return <GingerbreadMan />;
        case 3: return <Ornament id={id} />;
        default: return <GiftBox id={id} />;
    }
};
