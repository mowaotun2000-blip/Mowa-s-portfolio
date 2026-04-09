import React from 'react';
import { motion } from 'motion/react';
import { WashiTape } from '../components/Shared';

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto pt-32 md:pt-40 pb-12 px-4 md:px-8 lg:px-12 min-h-screen flex flex-col md:flex-row gap-8 md:gap-16 items-center"
    >
      <div className="w-full md:w-1/2 relative">
        <div className="bg-white p-4 pb-16 rotate-[-2deg] shadow-sm border border-gray-200/50 relative z-10">
          <WashiTape color="bg-sky" className="-top-3 left-1/2 -translate-x-1/2 -rotate-3 w-20 h-8" />
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop" alt="Mowa" className="w-full h-64 md:h-96 object-cover grayscale contrast-125" />
          <p className="font-gelica text-2xl text-center mt-6 text-ink">Mowa.</p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <h1 className="font-gelica text-5xl md:text-7xl text-plum leading-[0.9]">
          About <span className="text-rose italic">Me.</span>
        </h1>
        <div className="font-satoshi text-ink/80 text-lg leading-relaxed space-y-4">
          <p>
            Hello! I'm Mowa, a passionate digital designer and developer who loves bridging the gap between aesthetics and functionality.
          </p>
          <p>
            With a background in both visual design and frontend engineering, I approach every project holistically. I believe that the best digital experiences feel human, tactile, and deeply intentional.
          </p>
          <p>
            When I'm not pushing pixels or writing code, you can find me exploring new coffee shops, curating my scrapbook, or experimenting with analog photography.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
