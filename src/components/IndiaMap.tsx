import { motion } from 'framer-motion';
import indiaMapSvg from '@/assets/india-map.svg';

const cities = [
  { name: 'Chennai', x: 58, y: 72, delay: 0 },
  { name: 'Mumbai', x: 35, y: 55, delay: 0.5 },
  { name: 'Delhi', x: 48, y: 25, delay: 1 },
  { name: 'Kolkata', x: 72, y: 48, delay: 1.5 },
  { name: 'Bangalore', x: 50, y: 73, delay: 2 },
  { name: 'Gandhinagar', x: 32, y: 42, delay: 2.5 },
];

const IndiaMap = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* India map outline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="w-full max-w-[500px] aspect-square relative"
      >
        <img
          src={indiaMapSvg}
          alt=""
          className="w-full h-full object-contain opacity-30"
          style={{ filter: 'brightness(0) invert(1)' }}
        />

        {/* Animated city dots */}
        {cities.map((city) => (
          <div
            key={city.name}
            className="absolute"
            style={{ left: `${city.x}%`, top: `${city.y}%` }}
          >
            {/* Ping animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: city.delay, duration: 0.5 }}
              className="relative"
            >
              <span className="absolute inline-flex h-3 w-3 rounded-full bg-primary/40 animate-ping" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_hsl(24,95%,53%)]" />
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default IndiaMap;
