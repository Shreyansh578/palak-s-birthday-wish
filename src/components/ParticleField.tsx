import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
}

const ParticleField = ({ count = 200 }: ParticleFieldProps) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spread particles in a dome shape around the scene
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.6;
      const radius = 8 + Math.random() * 12;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) - 2;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 5;
      
      sizes[i] = Math.random() * 0.08 + 0.02;
      
      // Rose gold to champagne color range
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // Rose gold
        colors[i * 3] = 0.83 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.65 + Math.random() * 0.1;
        colors[i * 3 + 2] = 0.55 + Math.random() * 0.1;
      } else if (colorChoice < 0.7) {
        // Champagne
        colors[i * 3] = 0.95 + Math.random() * 0.05;
        colors[i * 3 + 1] = 0.85 + Math.random() * 0.1;
        colors[i * 3 + 2] = 0.65 + Math.random() * 0.1;
      } else {
        // Soft white sparkle
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.98;
        colors[i * 3 + 2] = 0.95;
      }
    }
    
    return { positions, sizes, colors };
  }, [count]);
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Gentle floating motion
      positions[i3 + 1] += Math.sin(time * 0.5 + i * 0.1) * 0.002;
      positions[i3] += Math.cos(time * 0.3 + i * 0.05) * 0.001;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.rotation.y = time * 0.02;
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleField;
