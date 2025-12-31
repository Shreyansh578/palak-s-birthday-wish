import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Scene3D from '@/components/Scene3D';
import IntroOverlay from '@/components/IntroOverlay';
import MessageOverlay from '@/components/MessageOverlay';
import AudioController from '@/components/AudioController';
import FireworksTrigger from '@/components/FireworksTrigger';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleEnter = useCallback(() => {
    setShowIntro(false);
    setHasInteracted(true);
  }, []);

  const handleSelectMessage = useCallback((message: string) => {
    setSelectedMessage(message);
  }, []);

  const handleCloseMessage = useCallback(() => {
    setSelectedMessage(null);
  }, []);

  const handleFireworksChange = useCallback((active: boolean) => {
    setShowFireworks(active);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-night">
      {/* Main 3D Scene */}
      <Scene3D 
        onSelectMessage={handleSelectMessage}
        showFireworks={showFireworks}
      />
      
      {/* UI Overlays */}
      <IntroOverlay show={showIntro} onEnter={handleEnter} />
      <MessageOverlay message={selectedMessage} onClose={handleCloseMessage} />
      <AudioController hasInteracted={hasInteracted} />
      <FireworksTrigger onFireworksChange={handleFireworksChange} />
      
      {/* Floating title (after intro) */}
      {!showIntro && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed top-6 left-6 z-30"
        >
          <h1 className="font-script text-3xl md:text-4xl text-primary glow-text">
            Palak's Day
          </h1>
        </motion.div>
      )}
      
      {/* Instructions hint */}
      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="fixed bottom-6 left-6 z-30 max-w-xs"
        >
          <p className="text-sm text-muted-foreground font-body">
            <span className="text-primary">✨</span> Drag photos to move them
            <br />
            <span className="text-primary">💝</span> Tap photos for messages
            <br />
            <span className="text-primary">🎆</span> Double-tap for fireworks!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
