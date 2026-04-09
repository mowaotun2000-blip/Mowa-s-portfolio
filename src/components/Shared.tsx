import React from 'react';
import { motion } from 'motion/react';

export const WashiTape = ({ color, className = "w-16 h-6 md:w-20 md:h-8" }: { color: string, className?: string }) => (
  <div
    className={`absolute opacity-70 shadow-sm backdrop-blur-md z-20 ${color} ${className}`}
    style={{ mixBlendMode: 'multiply' }}
  >
    <div className="w-full h-full opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
  </div>
);

export const BentoItem = ({ className, delay, children, rotation = 0, style, isActive, isDimmed, onClick }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: isDimmed ? 0.4 : 1, 
      y: 0,
      scale: isActive ? 1.02 : 1,
      zIndex: isActive ? 30 : 10
    }}
    transition={{ delay: delay || 0, type: "spring", stiffness: 100, damping: 20 }}
    whileHover={{ scale: 1.02, rotate: rotation, zIndex: 30, opacity: 1 }}
    onClick={onClick}
    className={`relative w-full h-full transition-all duration-300 rounded-sm min-h-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    style={style}
  >
    {children}
  </motion.div>
);

export const Sticker = ({ icon: Icon, color, rotation }: any) => (
  <motion.div
    whileHover={{ scale: 1.2, rotate: rotation + 15 }}
    initial={{ rotate: rotation }}
    className="rounded-full bg-white p-2 md:p-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-[3px] md:border-[4px] border-white cursor-pointer"
    style={{ color }}
  >
    <Icon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
  </motion.div>
);
