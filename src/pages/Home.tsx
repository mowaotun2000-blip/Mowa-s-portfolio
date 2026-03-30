import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { WashiTape, BentoItem } from '../components/Shared';
import { Quote, MapPin, Clock, ArrowUpRight, Mail, Linkedin, FileText } from 'lucide-react';

const ButterflySticker = ({ className, delay = 0, color = "#D81E5B" }: { className?: string, delay?: number, color?: string }) => (
  <motion.div
    className={`absolute z-20 pointer-events-none ${className}`}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.5, 0.8, 0.5],
      scale: [0.8, 1, 0.8],
      y: [0, -10, 0],
      x: [0, 8, 0],
      rotate: [-8, 8, -8]
    }}
    transition={{ 
      duration: 4, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay: delay
    }}
  >
    <svg width="32" height="32" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm opacity-70 mix-blend-multiply">
      <path d="M12 12.5C12 12.5 9 10 5 10C1 10 1 3 5 5C8 6.5 12 11 12 11C12 11 16 6.5 19 5C23 3 23 10 19 10C15 10 12 12.5 12 12.5Z" />
      <path d="M12 13.5C12 13.5 9 16 5 16C1 16 1 22 5 20C8 18.5 12 14.5 12 14.5C12 14.5 16 18.5 19 20C23 22 23 16 19 16C15 16 12 13.5 12 13.5Z" />
      <path d="M11.5 4C11.5 4 11.5 12 12 14C12.5 12 12.5 4 12.5 4" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </svg>
  </motion.div>
);

const Bookmark = ({ text, color, delay, rotation, active, onClick }: any) => (
  <motion.div
    initial={{ x: 50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay, type: "spring", stiffness: 100 }}
    whileHover={{ x: -10, rotate: rotation }}
    onClick={onClick}
    className={`pl-3 md:pl-4 pr-3 md:pr-5 py-1.5 md:py-2 rounded-l-xl shadow-md cursor-pointer flex items-center border-y border-l border-black/5 transition-all duration-300 ${color} ${active ? 'pr-6 md:pr-8 font-bold scale-105 z-50' : 'opacity-80 hover:opacity-100'}`}
    style={{ rotate: rotation }}
  >
    <span className="font-gelica text-xs md:text-sm whitespace-nowrap">{text}</span>
  </motion.div>
);

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-full relative flex flex-col pt-28 md:pt-36 overflow-hidden" onClick={() => setActiveSection(null)}>
      {/* Bookmarks Navigation */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 md:gap-3 z-40 items-end" onClick={(e) => e.stopPropagation()}>
        <Bookmark text="About Me" color="bg-sky text-white" rotation={-2} delay={0.5} active={activeSection === 'About Me'} onClick={() => setActiveSection('About Me')} />
        <Bookmark text="Projects" color="bg-rose text-white" rotation={1} delay={0.6} active={activeSection === 'Projects'} onClick={() => setActiveSection('Projects')} />
        <Bookmark text="Playground" color="bg-lilac text-plum" rotation={-1} delay={0.7} active={activeSection === 'Playground'} onClick={() => setActiveSection('Playground')} />
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col justify-center px-4 md:px-8 lg:px-12 pb-8 overflow-y-auto md:overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] md:auto-rows-[190px] lg:auto-rows-[210px] gap-4 md:gap-6 w-full">

          {/* 1. Hero (Top Left, 2x2) */}
          <BentoItem
            className="md:col-span-2 md:row-span-2 bg-[#fdfbf7] p-6 md:p-8 flex flex-col justify-between border border-[#e8e2d2] shadow-sm relative overflow-hidden"
            delay={0.1}
            isActive={activeSection === 'Hero'}
            isDimmed={activeSection !== null && activeSection !== 'Hero'}
          >
            <WashiTape color="bg-sky" className="-top-2 -left-4 -rotate-6 w-16 h-6" />
            <div className="flex justify-between items-start text-ink/40 font-satoshi text-xs md:text-sm mb-8">
              <div className="flex items-center gap-1.5"><MapPin size={14}/> Local Time</div>
              <div className="flex items-center gap-1.5"><Clock size={14}/> {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
            <div>
              <h1 className="font-gelica text-5xl md:text-6xl lg:text-7xl text-plum tracking-tight leading-[0.9] mb-4 md:mb-6">
                Hi, I'm <br className="hidden md:block" /><span className="text-rose italic">Mowa.</span>
              </h1>
              <p className="font-satoshi text-ink/70 text-base md:text-lg leading-relaxed max-w-md">
                A digital designer and developer shaping products and experiences with intention, embracing ambiguity as part of the process.
              </p>
            </div>
          </BentoItem>

          {/* 2. Project 1 (Middle Col, Row 1) */}
          <BentoItem
            className="md:col-span-1 md:row-span-1 bg-white p-2.5 flex flex-col shadow-sm border border-gray-200/50 group cursor-pointer relative"
            delay={0.2}
            rotation={1}
            isActive={activeSection === 'Projects'}
            isDimmed={activeSection !== null && activeSection !== 'Projects'}
            onClick={() => navigate('/projects')}
          >
            <WashiTape color="bg-rose" className="-top-2 left-1/2 -translate-x-1/2 -rotate-2 w-10 h-4 z-10" />
            <ButterflySticker className="-top-4 -right-3 rotate-12" delay={0.2} color="#D81E5B" />
            <div className="flex-1 overflow-hidden relative bg-gray-100 mb-2">
              <img src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=400&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" draggable={false} />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="font-gelica text-ink text-sm">Brand Identity</span>
              <ArrowUpRight size={16} className="text-ink/40 group-hover:text-rose transition-colors" />
            </div>
          </BentoItem>

          {/* 3. Tall Image / Playground (Right Col, Row 1-2) */}
          <BentoItem
            className="md:col-span-1 md:row-span-2 bg-white p-3 shadow-sm border border-gray-200/50 group cursor-pointer relative flex flex-col"
            delay={0.3}
            rotation={-1}
            isActive={activeSection === 'Playground'}
            isDimmed={activeSection !== null && activeSection !== 'Playground'}
            onClick={() => navigate('/playground')}
          >
            <WashiTape color="bg-lilac" className="-top-2 right-4 rotate-3 w-12 h-5 z-10" />
            <div className="flex-1 overflow-hidden relative bg-gray-100 mb-3">
              <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" draggable={false} />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="font-gelica text-ink text-lg">Playground</span>
              <ArrowUpRight size={18} className="text-ink/40 group-hover:text-lilac transition-colors" />
            </div>
          </BentoItem>

          {/* 4. Project 2 (Middle Col, Row 2) */}
          <BentoItem
            className="md:col-span-1 md:row-span-1 bg-white p-2.5 flex flex-col shadow-sm border border-gray-200/50 group cursor-pointer relative"
            delay={0.4}
            rotation={-2}
            isActive={activeSection === 'Projects'}
            isDimmed={activeSection !== null && activeSection !== 'Projects'}
            onClick={() => navigate('/projects')}
          >
            <WashiTape color="bg-sky" className="-top-1.5 right-4 rotate-6 w-8 h-3.5 z-10" />
            <ButterflySticker className="-bottom-3 -left-4 -rotate-12" delay={1.5} color="#0EA5E9" />
            <div className="flex-1 overflow-hidden relative bg-gray-100 mb-2">
              <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=400&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" draggable={false} />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="font-gelica text-ink text-sm">Web Design</span>
              <ArrowUpRight size={16} className="text-ink/40 group-hover:text-sky transition-colors" />
            </div>
          </BentoItem>

          {/* 5. Connect (Bottom Left, 2x1) */}
          <BentoItem
            className="md:col-span-2 md:row-span-1 bg-rose/10 p-6 flex flex-col justify-center shadow-sm border border-rose/20 group cursor-pointer relative overflow-hidden"
            delay={0.5}
            rotation={1}
            isActive={activeSection === 'Connect'}
            isDimmed={activeSection !== null && activeSection !== 'Connect'}
            onClick={() => window.location.href = 'mailto:mowaotun2000@gmail.com'}
          >
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
              <Mail size={140} />
            </div>
            <h3 className="font-gelica text-2xl md:text-3xl text-rose mb-1">Let's Connect</h3>
            <p className="font-satoshi text-rose/70 text-sm md:text-base">Open for freelance opportunities and collaborations.</p>
            <div className="flex gap-3 mt-4 relative z-10">
              <div className="p-2.5 bg-white rounded-full shadow-sm text-rose hover:bg-rose hover:text-white transition-colors"><Mail size={18}/></div>
              <div className="p-2.5 bg-white rounded-full shadow-sm text-rose hover:bg-rose hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); window.open('https://linkedin.com', '_blank'); }}><Linkedin size={18}/></div>
            </div>
          </BentoItem>

          {/* 6. Project 3 (Middle Col, Row 3) */}
          <BentoItem
            className="md:col-span-1 md:row-span-1 bg-white p-2.5 flex flex-col shadow-sm border border-gray-200/50 group cursor-pointer relative"
            delay={0.6}
            rotation={1}
            isActive={activeSection === 'Projects'}
            isDimmed={activeSection !== null && activeSection !== 'Projects'}
            onClick={() => navigate('/projects')}
          >
            <WashiTape color="bg-lilac" className="-top-2 left-4 -rotate-3 w-10 h-4 z-10" />
            <ButterflySticker className="top-1/2 -right-5 rotate-45" delay={0.8} color="#DABFFF" />
            <div className="flex-1 overflow-hidden relative bg-gray-100 mb-2">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" draggable={false} />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="font-gelica text-ink text-sm">App Concept</span>
              <ArrowUpRight size={16} className="text-ink/40 group-hover:text-lilac transition-colors" />
            </div>
          </BentoItem>

          {/* 7. Resume / About (Right Col, Row 3) */}
          <BentoItem
            className="md:col-span-1 md:row-span-1 bg-[#f4f0e6] p-6 flex flex-col justify-center items-center shadow-sm border border-[#e8e2d2] group cursor-pointer relative"
            delay={0.7}
            rotation={-1}
            isActive={activeSection === 'About Me'}
            isDimmed={activeSection !== null && activeSection !== 'About Me'}
            onClick={() => navigate('/about')}
          >
            <FileText size={40} className="text-plum/30 mb-3 group-hover:text-plum group-hover:-translate-y-1 transition-all duration-300" />
            <span className="font-gelica text-plum text-xl">Resume</span>
            <span className="font-satoshi text-xs text-plum/50 mt-1">Read more about me</span>
          </BentoItem>

        </div>
      </div>
    </div>
  );
}
