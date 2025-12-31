import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Rocket {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  exploded: boolean;
  particles: Particle[];
  trailParticles: THREE.Vector3[];
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

interface FireworksProps {
  active: boolean;
}

const Fireworks = ({ active }: FireworksProps) => {
  const rocketRef = useRef<THREE.Points>(null);
  const particleRef = useRef<THREE.Points>(null);
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const rocketIdRef = useRef(0);
  
  const colors = useMemo(() => [
    new THREE.Color('#d4a574'), // Rose gold
    new THREE.Color('#f5c6d0'), // Blush
    new THREE.Color('#ffd700'), // Gold
    new THREE.Color('#ff6b9d'), // Pink
    new THREE.Color('#c9a0dc'), // Lavender
  ], []);
  
  // Launch rockets periodically when active
  useEffect(() => {
    if (!active) {
      setRockets([]);
      return;
    }
    
    const launchRocket = () => {
      const newRocket: Rocket = {
        id: rocketIdRef.current++,
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          -5,
          -8 + Math.random() * 4
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          0.3 + Math.random() * 0.2,
          0
        ),
        color: colors[Math.floor(Math.random() * colors.length)],
        exploded: false,
        particles: [],
        trailParticles: [],
      };
      
      setRockets(prev => [...prev.slice(-10), newRocket]);
    };
    
    launchRocket();
    const interval = setInterval(launchRocket, 800 + Math.random() * 500);
    
    return () => clearInterval(interval);
  }, [active, colors]);
  
  useFrame((_, delta) => {
    setRockets(prevRockets => {
      return prevRockets.map(rocket => {
        if (!rocket.exploded) {
          // Update rocket position
          rocket.position.add(rocket.velocity.clone().multiplyScalar(delta * 60));
          rocket.velocity.y -= 0.003; // Gravity
          
          // Add trail
          rocket.trailParticles.push(rocket.position.clone());
          if (rocket.trailParticles.length > 10) {
            rocket.trailParticles.shift();
          }
          
          // Explode at peak
          if (rocket.velocity.y < 0 || rocket.position.y > 5) {
            rocket.exploded = true;
            // Create explosion particles
            const particleCount = 80 + Math.floor(Math.random() * 40);
            for (let i = 0; i < particleCount; i++) {
              const theta = Math.random() * Math.PI * 2;
              const phi = Math.random() * Math.PI;
              const speed = 0.1 + Math.random() * 0.15;
              
              rocket.particles.push({
                position: rocket.position.clone(),
                velocity: new THREE.Vector3(
                  Math.sin(phi) * Math.cos(theta) * speed,
                  Math.sin(phi) * Math.sin(theta) * speed,
                  Math.cos(phi) * speed * 0.5
                ),
                life: 1,
                maxLife: 1.5 + Math.random() * 0.5,
              });
            }
          }
        } else {
          // Update explosion particles
          rocket.particles = rocket.particles.filter(particle => {
            particle.position.add(particle.velocity.clone().multiplyScalar(delta * 60));
            particle.velocity.y -= 0.002; // Gravity
            particle.velocity.multiplyScalar(0.98); // Drag
            particle.life -= delta * 0.8;
            return particle.life > 0;
          });
        }
        
        return rocket;
      }).filter(rocket => !rocket.exploded || rocket.particles.length > 0);
    });
  });
  
  // Collect all particles for rendering
  const allParticles = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    
    rockets.forEach(rocket => {
      if (!rocket.exploded) {
        // Rocket trail
        rocket.trailParticles.forEach((pos, i) => {
          positions.push(pos.x, pos.y, pos.z);
          const intensity = i / rocket.trailParticles.length;
          colors.push(
            rocket.color.r * intensity,
            rocket.color.g * intensity,
            rocket.color.b * intensity
          );
          sizes.push(0.1 * intensity);
        });
      } else {
        // Explosion particles
        rocket.particles.forEach(particle => {
          positions.push(particle.position.x, particle.position.y, particle.position.z);
          const lifeRatio = particle.life / particle.maxLife;
          colors.push(
            rocket.color.r * lifeRatio,
            rocket.color.g * lifeRatio,
            rocket.color.b * lifeRatio
          );
          sizes.push(0.15 * lifeRatio);
        });
      }
    });
    
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes),
      count: positions.length / 3,
    };
  }, [rockets]);
  
  if (!active || allParticles.count === 0) return null;
  
  return (
    <points ref={particleRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={allParticles.count}
          array={allParticles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={allParticles.count}
          array={allParticles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default Fireworks;
