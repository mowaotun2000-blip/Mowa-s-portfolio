import React from 'react';
import { motion } from 'motion/react';
import { WashiTape } from '../components/Shared';

const ExperimentCard = ({ title, img, delay, rotation }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-white p-2 pb-6 md:pb-8 shadow-sm border border-gray-200/50 relative flex flex-col"
    style={{ rotate: rotation }}
  >
    <WashiTape color="bg-lilac" className="-top-2 left-1/2 -translate-x-1/2 -rotate-3 w-12 h-5" />
    <div className="w-full aspect-square overflow-hidden bg-gray-100 mb-2">
      <img src={img} alt={title} className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500" />
    </div>
    <h3 className="font-gelica text-lg text-center text-plum">{title}</h3>
  </motion.div>
);

export default function Playground() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto pt-32 md:pt-40 pb-12 px-4 md:px-8 lg:px-12 min-h-screen"
    >
      <div className="mb-12 md:mb-20 text-center">
        <h1 className="font-gelica text-5xl md:text-7xl text-plum leading-[0.9] mb-4">
          My <span className="text-lilac italic">Playground.</span>
        </h1>
        <p className="font-satoshi text-ink/70 text-lg max-w-2xl mx-auto">A space for creative coding, UI experiments, and visual explorations that don't fit anywhere else.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        <ExperimentCard 
          title="Generative Art" 
          img="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop"
          delay={0.1}
          rotation={-3}
        />
        <ExperimentCard 
          title="CSS Animations" 
          img="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop"
          delay={0.2}
          rotation={2}
        />
        <ExperimentCard 
          title="3D Interactions" 
          img="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop"
          delay={0.3}
          rotation={-1}
        />
        <ExperimentCard 
          title="Typography" 
          img="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=400&auto=format&fit=crop"
          delay={0.4}
          rotation={4}
        />
      </div>
    </motion.div>
  );
}
