import { useState, useEffect } from 'react';

interface FireworksTriggerProps {
  onFireworksChange: (active: boolean) => void;
}

const FireworksTrigger = ({ onFireworksChange }: FireworksTriggerProps) => {
  const [isMidnight, setIsMidnight] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // Check if it's within 5 minutes of midnight (23:55 - 00:05)
      const isNearMidnight = (hours === 23 && minutes >= 55) || (hours === 0 && minutes <= 5);
      
      if (isNearMidnight && !isMidnight) {
        setIsMidnight(true);
        onFireworksChange(true);
        setShowNotice(true);
        
        // Stop fireworks after 2 minutes
        setTimeout(() => {
          setIsMidnight(false);
          onFireworksChange(false);
          setShowNotice(false);
        }, 120000);
      }
    };

    // Check every 30 seconds
    checkMidnight();
    const interval = setInterval(checkMidnight, 30000);

    return () => clearInterval(interval);
  }, [isMidnight, onFireworksChange]);

  // For demo/testing: Double-tap anywhere to trigger fireworks
  useEffect(() => {
    let lastTap = 0;
    const handleDoubleTap = (e: TouchEvent | MouseEvent) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        // Double tap detected
        onFireworksChange(true);
        setShowNotice(true);
        setTimeout(() => {
          onFireworksChange(false);
          setShowNotice(false);
        }, 10000);
      }
      lastTap = now;
    };

    window.addEventListener('touchend', handleDoubleTap);
    window.addEventListener('dblclick', handleDoubleTap as EventListener);

    return () => {
      window.removeEventListener('touchend', handleDoubleTap);
      window.removeEventListener('dblclick', handleDoubleTap as EventListener);
    };
  }, [onFireworksChange]);

  if (!showNotice) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40">
      <div className="card-romantic px-6 py-3 text-center animate-pulse-glow">
        <p className="text-primary font-script text-xl">
          ✨ It's Celebration Time! ✨
        </p>
      </div>
    </div>
  );
};

export default FireworksTrigger;
