import { useRef, useState } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

interface PhotoCardProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  imageUrl: string;
  message: string;
  onSelect: (message: string) => void;
  index: number;
}

const PhotoCard = ({ position, rotation = [0, 0, 0], imageUrl, message, onSelect, index }: PhotoCardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: position[0], y: position[1] });
  
  const texture = useTexture(imageUrl);
  
  // Calculate aspect ratio for the card
  const imageElement = texture.image as HTMLImageElement | undefined;
  const aspectRatio = imageElement ? imageElement.width / imageElement.height : 0.78;
  const cardHeight = 3;
  const cardWidth = cardHeight * aspectRatio;

  const [spring, api] = useSpring(() => ({
    position: position,
    rotation: rotation,
    scale: [1, 1, 1] as [number, number, number],
    config: { mass: 1, tension: 180, friction: 20 },
  }));

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Subtle floating animation when not dragging
    if (!dragging) {
      const time = state.clock.getElapsedTime();
      const floatY = Math.sin(time * 0.5 + index * 2) * 0.1;
      const floatRotation = Math.sin(time * 0.3 + index) * 0.02;
      
      // Apply inertia decay
      if (Math.abs(velocity.x) > 0.001 || Math.abs(velocity.y) > 0.001) {
        currentPos.current.x += velocity.x;
        currentPos.current.y += velocity.y;
        setVelocity({ x: velocity.x * 0.95, y: velocity.y * 0.95 });
      }
      
      // Spring back towards original position
      currentPos.current.x += (position[0] - currentPos.current.x) * 0.02;
      currentPos.current.y += (position[1] - currentPos.current.y) * 0.02;
      
      api.start({
        position: [currentPos.current.x, currentPos.current.y + floatY, position[2]],
        rotation: [rotation[0] + floatRotation, rotation[1], rotation[2] + velocity.x * 0.5],
      });
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDragging(true);
    dragStart.current = { x: e.point.x, y: e.point.y };
    api.start({ scale: [1.05, 1.05, 1.05] });
    document.body.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging) return;
    
    const deltaX = e.point.x - dragStart.current.x;
    const deltaY = e.point.y - dragStart.current.y;
    
    currentPos.current.x = position[0] + deltaX * 1.5;
    currentPos.current.y = position[1] + deltaY * 1.5;
    
    setVelocity({ x: deltaX * 0.1, y: deltaY * 0.1 });
    
    // Tilt based on drag velocity
    const tiltX = -deltaY * 0.15;
    const tiltY = deltaX * 0.15;
    
    api.start({
      position: [currentPos.current.x, currentPos.current.y, position[2] + 0.5],
      rotation: [tiltX, tiltY, deltaX * 0.05],
    });
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    setDragging(false);
    document.body.style.cursor = 'default';
    
    // Check if it was a click (minimal movement)
    const moveDistance = Math.abs(e.point.x - dragStart.current.x) + Math.abs(e.point.y - dragStart.current.y);
    if (moveDistance < 0.1) {
      onSelect(message);
    }
    
    api.start({
      scale: [1, 1, 1],
      rotation: rotation,
    });
  };

  return (
    <animated.mesh
      ref={meshRef}
      position={spring.position as unknown as THREE.Vector3}
      rotation={spring.rotation as unknown as THREE.Euler}
      scale={spring.scale as unknown as THREE.Vector3}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        setHovered(false);
        if (!dragging) document.body.style.cursor = 'default';
      }}
    >
      {/* Card frame */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[cardWidth + 0.3, cardHeight + 0.3, 0.08]} />
        <meshStandardMaterial 
          color={hovered ? "#e8c4b0" : "#d4a574"} 
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      
      {/* Photo */}
      <mesh>
        <planeGeometry args={[cardWidth, cardHeight]} />
        <meshStandardMaterial 
          map={texture} 
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      
      {/* Glow effect when hovered */}
      {hovered && (
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[cardWidth + 0.5, cardHeight + 0.5]} />
          <meshBasicMaterial 
            color="#d4a574" 
            transparent 
            opacity={0.2}
          />
        </mesh>
      )}
    </animated.mesh>
  );
};

export default PhotoCard;
