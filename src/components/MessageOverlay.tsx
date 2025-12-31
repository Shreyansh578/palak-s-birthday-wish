import { motion, AnimatePresence } from 'framer-motion';

interface MessageOverlayProps {
  message: string | null;
  onClose: () => void;
}

const MessageOverlay = ({ message, onClose }: MessageOverlayProps) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          {/* Message card */}
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -20, opacity: 0 }}
            transition={{ 
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
            className="relative max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-romantic p-8 md:p-10">
              {/* Decorative elements */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              {/* Message */}
              <p className="text-xl md:text-2xl text-foreground font-body leading-relaxed text-center">
                {message}
              </p>
              
              {/* Close hint */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-muted-foreground text-sm mt-6 font-body"
              >
                Tap anywhere to close
              </motion.p>
              
              {/* Decorative corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageOverlay;
