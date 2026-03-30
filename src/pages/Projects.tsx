import React from 'react';
import { motion } from 'motion/react';
import { WashiTape } from '../components/Shared';

const ProjectCard = ({ title, desc, img, delay, rotation }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-3 pb-8 md:pb-12 shadow-sm border border-gray-200/50 relative flex flex-col"
    style={{ rotate: rotation }}
  >
    <WashiTape color="bg-rose" className="-top-2 left-1/2 -translate-x-1/2 -rotate-2 w-16 h-6" />
    <div className="w-full aspect-video overflow-hidden bg-gray-100 mb-4">
      <img src={img} alt={title} className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500" />
    </div>
    <h3 className="font-gelica text-2xl text-plum">{title}</h3>
    <p className="font-satoshi text-ink/70 mt-2">{desc}</p>
  </motion.div>
);

export default function Projects() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto pt-32 md:pt-40 pb-12 px-4 md:px-8 lg:px-12 min-h-screen"
    >
      <div className="mb-12 md:mb-20 text-center">
        <h1 className="font-gelica text-5xl md:text-7xl text-plum leading-[0.9] mb-4">
          Selected <span className="text-sky italic">Projects.</span>
        </h1>
        <p className="font-satoshi text-ink/70 text-lg max-w-2xl mx-auto">A collection of my recent work, spanning web design, development, and creative direction.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        <ProjectCard 
          title="E-Commerce Redesign" 
          desc="A complete overhaul of a boutique fashion brand's online store, focusing on conversion and aesthetic." 
          img="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop"
          delay={0.1}
          rotation={-2}
        />
        <ProjectCard 
          title="Brand Identity" 
          desc="Visual identity and digital guidelines for an emerging tech startup." 
          img="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop"
          delay={0.2}
          rotation={1}
        />
        <ProjectCard 
          title="Editorial Platform" 
          desc="A custom CMS and frontend for a digital magazine, optimizing for readability and performance." 
          img="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop"
          delay={0.3}
          rotation={-1}
        />
      </div>
    </motion.div>
  );
}
