import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface IntroOverlayProps {
  show: boolean;
  onEnter: () => void;
}

const IntroOverlay = ({ show, onEnter }: IntroOverlayProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-night"
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, hsl(15 45% 65% / 0.4), transparent)' }}
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, hsl(340 30% 70% / 0.3), transparent)' }}
            />
          </div>
          
          {/* Sparkle overlay */}
          <div className="absolute inset-0 sparkle-overlay opacity-40" />
          
          {/* Content */}
          <div className="relative text-center px-6 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-12 h-12 mx-auto mb-6 text-primary" />
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold text-gradient-romantic mb-4 glow-text">
                Happy Birthday
              </h1>
              
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-6xl md:text-8xl font-script text-primary mb-8"
              >
                Palak
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-lg md:text-xl text-muted-foreground font-body mb-10"
              >
                A special celebration just for you
              </motion.p>
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnter}
              className="btn-romantic text-lg font-display tracking-wider"
            >
              <span className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                Enter
                <Sparkles className="w-5 h-5" />
              </span>
            </motion.button>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.8 }}
              className="text-sm text-muted-foreground mt-8 font-body"
            >
              Drag the photos to explore • Tap to reveal messages
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroOverlay;
