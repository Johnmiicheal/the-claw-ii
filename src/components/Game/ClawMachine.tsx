'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { useHandStore, useGameStore } from '@/store/gameStore';
import { AlienSelector } from './AlienModels';

const BOUNDS = { xMin: -9, xMax: 9, yMin: 2, yMax: 14, zMin: -9, zMax: 15 };
const CHUTE = { x: -7, z: 7, radius: 3.5 };

const VoxelBlock = ({ position, size = [1, 1, 1], color }: { position: [number, number, number], size?: [number, number, number], color: string }) => (
    <Box args={size} position={position} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.3} />
    </Box>
);

const Walls = () => {
    const walls: React.ReactElement[] = [];
    for (let x = -12; x <= 12; x += 2) {
        const isRed = Math.abs(x) % 4 === 0;
        const color = isRed ? "#b91c1c" : "#166534";
        walls.push(<VoxelBlock key={`back-${x}`} size={[2, 2, 2]} position={[x, 1, -12]} color={color} />);
        if (Math.abs(x) < 12) {
            walls.push(<VoxelBlock key={`left-${x}`} size={[2, 2, 2]} position={[-12, 1, x]} color={color} />);
            walls.push(<VoxelBlock key={`right-${x}`} size={[2, 2, 2]} position={[12, 1, x]} color={color} />);
        }
    }
    return <group>{walls}</group>;
};

const Claw = () => {
    const groupRef = useRef<THREE.Group>(null);
    const { aliens, setGrabbedAlien, grabbedAlienId, updateAlienPosition, removeAlien, incrementScore, gameStatus, invertControls } = useGameStore();
    
    const fingerRefs = [useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
    const heldAlien = aliens.find(a => a.id === grabbedAlienId);
    const [clawPos] = useState(new THREE.Vector3(0, 8, 0));

    useFrame(() => {
        if (!groupRef.current || gameStatus !== 'playing') return;
        const handState = useHandStore.getState();

        const rawX = 1 - handState.x; 
        let targetX = (rawX - 0.5) * 34;
        if (invertControls) targetX = -targetX;
        
        const rawY = 1 - handState.y;
        const targetY = (rawY * 22) - 3;

        const handSize = handState.z;
        const depthZ = (0.1 - handSize) * 300;
        const targetZ = THREE.MathUtils.clamp(depthZ, BOUNDS.zMin, BOUNDS.zMax);

        clawPos.set(
            THREE.MathUtils.clamp(targetX, BOUNDS.xMin, BOUNDS.xMax),
            THREE.MathUtils.clamp(targetY, BOUNDS.yMin, BOUNDS.yMax),
            targetZ
        );

        groupRef.current.position.lerp(clawPos, 0.2);

        const fingerRadius = handState.isPinching ? 0.6 : 1.2;
        fingerRefs.forEach((ref, i) => {
            if (ref.current) {
                const angle = (i / 3) * Math.PI * 2;
                ref.current.position.set(Math.sin(angle) * fingerRadius, 0, Math.cos(angle) * fingerRadius);
            }
        });

        const currentClawPos = groupRef.current.position;
        
        if (handState.isPinching && !grabbedAlienId) {
            let closest = null;
            let minDist = 999;
            for (const alien of aliens) {
                const flatDist = Math.sqrt(
                    Math.pow(alien.position[0] - currentClawPos.x, 2) +
                    Math.pow(alien.position[2] - currentClawPos.z, 2)
                );
                const heightDiff = Math.abs(alien.position[1] - (currentClawPos.y - 2.5));
                
                if (flatDist < 2.5 && heightDiff < 3.5) {
                    const dist = Math.sqrt(flatDist * flatDist + heightDiff * heightDiff);
                    if (dist < minDist) {
                        minDist = dist;
                        closest = alien;
                    }
                }
            }
            if (closest) {
                setGrabbedAlien(closest.id);
            }
        } else if (!handState.isPinching && grabbedAlienId) {
            const dropPos: [number, number, number] = [currentClawPos.x, 0.75, currentClawPos.z];
            updateAlienPosition(grabbedAlienId, dropPos);
            
            const distToChute = Math.sqrt(
                Math.pow(dropPos[0] - CHUTE.x, 2) + 
                Math.pow(dropPos[2] - CHUTE.z, 2)
            );

            if (distToChute < CHUTE.radius) {
                incrementScore(100);
                removeAlien(grabbedAlienId);
            }
            setGrabbedAlien(null);
        }
    });

    return (
        <group ref={groupRef} position={[0, 8, 0]}>
            <VoxelBlock size={[0.5, 20, 0.5]} position={[0, 10, 0]} color="#888888" />
            <VoxelBlock size={[2, 1, 2]} position={[0, 0, 0]} color="#555555" />


            {[0, 1, 2].map((i) => (
                <group key={i} ref={fingerRefs[i]} rotation={[0, (i / 3) * Math.PI * 2, 0]}>
                    <group rotation={[-0.3, 0, 0]} position={[0, -0.8, 0.6]}>
                         <VoxelBlock size={[0.5, 1.5, 0.5]} position={[0, 0, 0]} color="#AAAAAA" />
                    </group>
                    <group rotation={[0.5, 0, 0]} position={[0, -2, 0.2]}>
                        <VoxelBlock size={[0.4, 1.2, 0.4]} position={[0, 0, 0]} color="#DDDDDD" />
                    </group>
                </group>
            ))}

            {heldAlien && (
                <group position={[0, -2.5, 0]}>
                    <AlienSelector type={heldAlien.type} id={heldAlien.id} />
                </group>
            )}
        </group>
    );
};

const Reticle = () => {
    const ref = useRef<THREE.Mesh>(null);
    const { gameStatus } = useGameStore();
    
    useFrame(() => {
        if (!ref.current || gameStatus !== 'playing') return;
        const handState = useHandStore.getState();
        
        const rawX = 1 - handState.x;
        let targetX = (rawX - 0.5) * 34;
        const handSize = handState.z;
        const depthZ = (0.1 - handSize) * 300;
        const targetZ = THREE.MathUtils.clamp(depthZ, BOUNDS.zMin, BOUNDS.zMax);
        
        ref.current.position.x = THREE.MathUtils.clamp(targetX, BOUNDS.xMin, BOUNDS.xMax);
        ref.current.position.z = targetZ;
    });

    return (
        <Ring ref={ref} args={[0.5, 0.7, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <meshBasicMaterial color="red" transparent opacity={0.8} side={THREE.DoubleSide} />
        </Ring>
    );
};

const Scene = () => {
    const { aliens, grabbedAlienId } = useGameStore();
    const floorAliens = aliens.filter(a => a.id !== grabbedAlienId);

    return (
        <>
            <color attach="background" args={['#0c1929']} />
            <fog attach="fog" args={['#0c1929', 25, 65]} />

            <hemisphereLight args={['#a8d4ff', '#ffffff', 2.5]} />
            <spotLight position={[5, 25, 5]} angle={Math.PI / 4} intensity={600} castShadow />
            <pointLight position={[10, 5, -10]} intensity={150} distance={25} color="#ff6b6b" />
            <pointLight position={[-10, 5, -10]} intensity={150} distance={25} color="#4ade80" />

            <Walls />
            
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[24, 24]} />
                <meshStandardMaterial roughness={0.6}>
                    <canvasTexture attach="map" image={(() => {
                        const canvas = document.createElement('canvas');
                        canvas.width = 512; canvas.height = 512;
                        const ctx = canvas.getContext('2d')!;
                        ctx.fillStyle = '#e8f4fc';
                        ctx.fillRect(0, 0, 512, 512);
                        ctx.fillStyle = '#c7e6f5';
                        const gridSize = 64;
                        for (let y = 0; y < 512; y += gridSize) {
                            for (let x = 0; x < 512; x += gridSize) {
                                if ((x / gridSize + y / gridSize) % 2 === 0) {
                                    ctx.fillRect(x, y, gridSize, gridSize);
                                }
                            }
                        }
                        return canvas;
                    })()} />
                </meshStandardMaterial>
            </mesh>

            {floorAliens.map(alien => (
                <group key={alien.id} position={alien.position} scale={[1.5, 1.5, 1.5]}>
                     <AlienSelector type={alien.type} id={alien.id} />
                </group>
            ))}

            <Claw />
            <Reticle />
            
            <group position={[CHUTE.x, 0, CHUTE.z]}>
                <Cylinder args={[3, 3, 2, 32]} position={[0, 1, 0]} castShadow receiveShadow>
                    <meshStandardMaterial color="#16a34a" roughness={0.2} />
                </Cylinder>
                <Cylinder args={[3.4, 3.4, 0.8, 32]} position={[0, 2.4, 0]} castShadow receiveShadow>
                    <meshStandardMaterial color="#16a34a" roughness={0.2} />
                </Cylinder>
                <Cylinder args={[2.8, 2.8, 0.1, 32]} position={[0, 2.81, 0]}>
                    <meshBasicMaterial color="black" />
                </Cylinder>
            </group>
        </>
    );
};

export default Scene;
