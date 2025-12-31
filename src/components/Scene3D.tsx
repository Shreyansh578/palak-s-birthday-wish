import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, OrbitControls, PerspectiveCamera, useProgress, Html } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import PhotoCard from './PhotoCard';
import ParticleField from './ParticleField';
import Fireworks from './Fireworks';

interface Scene3DProps {
  onSelectMessage: (message: string) => void;
  showFireworks: boolean;
}

const photos = [
  {
    url: 'public/photos/her1.jpeg',
    position: [-3.5, 0.5, 0] as [number, number, number],
    rotation: [0, 0.15, 0.05] as [number, number, number],
    message: "Happy Birthday, Palak! 🎂 You're not just a year older—you're a year more incredible, more radiant, and more loved than ever. Here's to celebrating the amazing person you are! 🌟"
  },
  {
    url: 'public/photos/her2.jpeg',
    position: [0, 0.2, 1] as [number, number, number],
    rotation: [0, 0, -0.03] as [number, number, number],
    message: "To the one who makes every moment magical ✨ Your laughter is music, your kindness is a gift, and your friendship is priceless. Wishing you a birthday as beautiful as your heart! 💖"
  },
  {
    url: 'public/photos/her3.jpeg',
    position: [3.5, 0.4, 0] as [number, number, number],
    rotation: [0, -0.12, 0.02] as [number, number, number],
    message: "Palak, you light up every room you walk into! 🌸 May this new year of your life be filled with dreams coming true, adventures waiting to happen, and love surrounding you always. Happy Birthday, superstar! 🎉"
  },
];

function GyroscopeCamera() {
  const { camera } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        // Convert device orientation to subtle camera movement
        targetRotation.current = {
          x: (event.beta - 45) * 0.002,
          y: event.gamma * 0.002,
        };
      }
    };
    
    // Request permission on iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);
  
  useFrame(() => {
    // Smooth interpolation to target rotation
    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.05;
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.05;
  });
  
  return null;
}

function LoadingScreen() {
  const { progress } = useProgress();
  
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-primary text-sm font-body">Loading magic...</p>
      </div>
    </Html>
  );
}

function SceneContent({ onSelectMessage, showFireworks }: Scene3DProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <GyroscopeCamera />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        color="#ffeedd"
        castShadow
      />
      <pointLight position={[-5, 3, 2]} intensity={0.5} color="#d4a574" />
      <pointLight position={[5, -2, 3]} intensity={0.3} color="#f5c6d0" />
      
      {/* Environment for reflections */}
      <Environment preset="night" />
      
      {/* Photo cards */}
      {photos.map((photo, index) => (
        <PhotoCard
          key={index}
          position={photo.position}
          rotation={photo.rotation}
          imageUrl={photo.url}
          message={photo.message}
          onSelect={onSelectMessage}
          index={index}
        />
      ))}
      
      {/* Particles */}
      <ParticleField count={150} />
      
      {/* Fireworks */}
      <Fireworks active={showFireworks} />
      
      {/* Post-processing effects */}
      <EffectComposer>
        <DepthOfField 
          focusDistance={0.01}
          focalLength={0.05}
          bokehScale={4}
        />
        <Bloom 
          luminanceThreshold={0.7}
          luminanceSmoothing={0.9}
          intensity={0.5}
        />
        <Vignette darkness={0.5} offset={0.3} />
      </EffectComposer>
      
      {/* Subtle orbit controls for desktop */}
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2 + 0.3}
        minPolarAngle={Math.PI / 2 - 0.3}
        maxAzimuthAngle={0.5}
        minAzimuthAngle={-0.5}
        rotateSpeed={0.3}
      />
    </>
  );
}

const Scene3D = ({ onSelectMessage, showFireworks }: Scene3DProps) => {
  return (
    <div className="canvas-container">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={['#0f0a08']} />
        <fog attach="fog" args={['#0f0a08', 5, 25]} />
        
        <Suspense fallback={<LoadingScreen />}>
          <SceneContent 
            onSelectMessage={onSelectMessage} 
            showFireworks={showFireworks}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
