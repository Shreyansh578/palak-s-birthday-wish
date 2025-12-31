import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControllerProps {
  hasInteracted: boolean;
}

const AudioController = ({ hasInteracted }: AudioControllerProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/audio/music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (hasInteracted && audioRef.current && !isPlaying) {
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Audio autoplay prevented:', error);
        }
      };
      playAudio();
    }
  }, [hasInteracted, isPlaying]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!hasInteracted) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-40 p-4 rounded-full card-romantic hover:glow-rose transition-all duration-300 group"
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      <AnimatePresence mode="wait">
        {isMuted ? (
          <motion.div
            key="muted"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.div>
        ) : (
          <motion.div
            key="unmuted"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Volume2 className="w-5 h-5 text-primary animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default AudioController;
