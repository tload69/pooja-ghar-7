
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-400 to-orange-600 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="text-8xl mb-4">🪔</div>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-16 h-16 bg-yellow-300 rounded-full mx-auto opacity-80"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-white"
        >
          <h1 className="text-4xl font-bold mb-2">पूजा घर</h1>
          <h2 className="text-2xl font-semibold">Pooja Ghar</h2>
          <p className="text-lg mt-2 opacity-90">Spiritual Services at Your Doorstep</p>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
