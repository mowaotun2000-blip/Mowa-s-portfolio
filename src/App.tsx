import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, animate, useMotionValue, useSpring } from 'motion/react';
import { Quote, Mail, Linkedin, FileText } from 'lucide-react';

// ─── Card sound effects (Web Audio API) ───────────────────────────────────────
const playSound = (type: 'folder' | 'flip' | 'review' | 'envelope' | 'note' | 'soft') => {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const master = ctx.createGain();
    master.connect(ctx.destination);
    const now = ctx.currentTime;
    const tone = (freq: number, waveform: OscillatorType, startVol: number, dur: number, startAt = 0) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = waveform;
      osc.frequency.setValueAtTime(freq, now + startAt);
      g.gain.setValueAtTime(startVol, now + startAt);
      g.gain.exponentialRampToValueAtTime(0.001, now + startAt + dur);
      osc.connect(g); g.connect(master);
      osc.start(now + startAt); osc.stop(now + startAt + dur);
    };
    switch (type) {
      case 'folder':   tone(200, 'sine', 0.22, 0.28); tone(140, 'sine', 0.12, 0.4, 0.05); break;
      case 'flip':     tone(560, 'triangle', 0.18, 0.14); tone(380, 'triangle', 0.10, 0.18, 0.06); break;
      case 'review':   tone(420, 'sine', 0.16, 0.22); break;
      case 'envelope': tone(440, 'sine', 0.14, 0.18); tone(660, 'sine', 0.10, 0.22, 0.12); break;
      case 'note':     tone(480, 'sine', 0.13, 0.15); break;
      case 'soft':     tone(540, 'sine', 0.05, 0.10); tone(680, 'sine', 0.03, 0.08, 0.04); break;
    }
    setTimeout(() => ctx.close(), 1200);
  } catch (_) {}
};

const WashiTape = ({ color, className }: { color: string, className?: string }) => (
  <div
    className={`absolute opacity-70 shadow-sm backdrop-blur-md ${color} ${className}`}
    style={{ mixBlendMode: 'multiply' }}
  >
    <div className="w-full h-full opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
  </div>
);

// NEW: ManilaFolder for Projects
const ManilaFolder = ({ title, subtitle, className, rotation, zIndex, delay, setCursorText, folderColor = "bg-[#f4e4c4]", tabColor = "bg-[#e8d5b5]" }: any) => (
  <motion.div
    drag
    whileHover={{ scale: 1.15, zIndex: 50, transition: { duration: 0.2, delay: 0 } }}
    initial={{ opacity: 0, y: 30, scale: 0.95, rotate: rotation - 5 }}
    animate={{ opacity: 1, y: 0, scale: 1, rotate: rotation }}
    transition={{ delay, duration: 1.2, type: "spring", stiffness: 100, damping: 20 }}
    className={`absolute cursor-pointer ${className}`}
    style={{ zIndex }}
    onMouseEnter={() => setCursorText('View')}
    onMouseLeave={() => setCursorText('')}
  >
    {/* Tab */}
    <div className={`w-20 h-7 ${tabColor} rounded-t-lg ml-4 border border-b-0 border-black/10 shadow-sm relative z-10 flex items-center px-3`}>
      <span className="font-mono text-[9px] uppercase tracking-widest text-ink/60 select-none pointer-events-none">Project</span>
    </div>
    {/* Folder Front */}
    <div className={`w-56 h-40 ${folderColor} rounded-b-lg rounded-tr-lg shadow-md border border-black/10 p-4 flex flex-col relative z-20`}>
      <div className="bg-[#faf9f5] w-full h-full p-3 border border-black/5 shadow-inner flex flex-col justify-center items-center text-center transform -rotate-1 pointer-events-none">
        <h3 className="font-gelica text-xl text-ink">{title}</h3>
        <p className="font-satoshi text-xs text-ink/60 mt-1">{subtitle}</p>
        <div className="mt-3 px-3 py-1 border border-ink/20 rounded-full text-[10px] font-medium text-ink/70">Open Case Study</div>
      </div>
    </div>
  </motion.div>
);

// NEW: Sketchbook Page for Process/Workspace
const SketchbookPage = ({ src, caption, className, rotation, zIndex, delay, setCursorText }: any) => (
  <motion.div
    drag
    whileHover={{ scale: 1.08, zIndex: 50, transition: { duration: 0.2, delay: 0 } }}
    initial={{ opacity: 0, y: 30, scale: 0.95, rotate: rotation - 5 }}
    animate={{ opacity: 1, y: 0, scale: 1, rotate: rotation }}
    transition={{ delay, duration: 1.2, type: "spring", stiffness: 100, damping: 20 }}
    className={`absolute bg-white shadow-sm border border-gray-200 cursor-pointer flex h-56 ${className}`}
    style={{ zIndex }}
    onMouseEnter={() => setCursorText('View')}
    onMouseLeave={() => setCursorText('')}
  >
    {/* Spiral edge */}
    <div className="w-8 h-full border-r border-gray-100 flex flex-col justify-evenly items-center py-2 bg-[#fdfbf7] relative overflow-hidden pointer-events-none">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="w-4 h-4 rounded-full bg-[#e5e5e5] shadow-inner border border-gray-300 relative -left-2" />
        ))}
    </div>
    {/* Content */}
    <div className="p-4 w-48 flex flex-col justify-between pointer-events-none">
        <div className="w-full h-32 overflow-hidden bg-gray-100">
          <img src={src} className="w-full h-full object-cover grayscale contrast-125 mix-blend-multiply" draggable={false} alt={caption} />
        </div>
        <p className="font-satoshi font-medium text-sm mt-3 text-ink/80">{caption}</p>
    </div>
  </motion.div>
);

// Paper clip SVG
const PaperClip = () => (
  <svg width="22" height="36" viewBox="0 0 22 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none">
    <path
      d="M11 2 C6 2, 2 6, 2 11 L2 28 C2 32, 5.5 35, 9.5 35 C13.5 35, 17 32, 17 28 L17 12 C17 9, 14.5 7, 12 7 C9.5 7, 7 9, 7 12 L7 27 C7 28.6, 8.1 30, 9.5 30 C10.9 30, 12 28.6, 12 27 L12 13"
      stroke="#b0a89e"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);


// Flip Card – replaces IDCard
const FlipCard = ({ className, rotation, zIndex, delay, setCursorText, compact = false, onOpenAbout }: any) => {
  return (
    <motion.div
      drag
      initial={{ opacity: 0, y: 30, scale: 0.95, rotate: rotation - 5 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: rotation }}
      whileHover={{ scale: 1.04, y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
      transition={{ delay, duration: 1.2, type: "spring", stiffness: 100, damping: 20 }}
      className={`absolute cursor-pointer ${className}`}
      style={{ zIndex }}
      onMouseEnter={() => { setCursorText('About me'); playSound('soft'); }}
      onMouseLeave={() => setCursorText('')}
      onClick={() => { playSound('flip'); onOpenAbout?.(); }}
    >
      {/* Paper clip pinned at top */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <PaperClip />
      </div>

      {/* Card face */}
      <div style={{ width: compact ? '152px' : '220px', height: compact ? '188px' : '260px' }}>
          {/* FRONT FACE */}
          <div
            className="w-full h-full bg-[#fdfbf7] border border-[#e8e0d5] shadow-md rounded-sm flex flex-col items-center justify-between p-4 select-none"
          >
            {/* Portrait photo — polaroid style, larger */}
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-white p-1.5 pb-6 shadow-md border border-black/5 rotate-[2deg]">
                <img
                  src="/mowa.jpeg"
                  alt="Mowa Otun"
                  className={`${compact ? 'w-24 h-24' : 'w-36 h-36'} object-cover object-center`}
                  draggable={false}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Name + title at bottom */}
            <div className="w-full mt-2">
              <h2 className={`font-gelica ${compact ? 'text-sm' : 'text-lg'} text-plum leading-tight`}>Mowa Otun</h2>
              <div className="flex items-center justify-between mt-0.5">
                <p className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Product & UX Designer</p>
                <span className="font-satoshi text-[9px] italic text-ink/25">click to open</span>
              </div>
            </div>
          </div>
      </div>
    </motion.div>
  );
};

const StickyNote = ({ text, className, rotation, zIndex, delay, setCursorText }: any) => (
  <motion.div
    drag
    whileHover={{ scale: 1.08, zIndex: 50, transition: { duration: 0.2, delay: 0 } }}
    initial={{ opacity: 0, y: 30, scale: 0.95, rotate: rotation - 5 }}
    animate={{ opacity: 1, y: 0, scale: 1, rotate: rotation }}
    transition={{ delay, duration: 1.2, type: "spring", stiffness: 100, damping: 20 }}
    className={`absolute p-4 shadow-sm border border-black/5 cursor-pointer w-40 h-40 flex flex-col justify-center items-center text-center ${className}`}
    style={{ zIndex }}
    onMouseEnter={() => setCursorText('Drag')}
    onMouseLeave={() => setCursorText('')}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
    <p className="font-satoshi font-medium text-sm leading-relaxed pointer-events-none relative z-10 text-ink/80 select-none">{text}</p>
  </motion.div>
);

const PaperScrap = ({ text, className, rotation, zIndex, delay, setCursorText }: any) => (
  <motion.div
    drag
    whileHover={{ scale: 1.08, zIndex: 50, transition: { duration: 0.2, delay: 0 } }}
    initial={{ opacity: 0, y: 30, scale: 0.95, rotate: rotation - 5 }}
    animate={{ opacity: 1, y: 0, scale: 1, rotate: rotation }}
    transition={{ delay, duration: 1.2, type: "spring", stiffness: 100, damping: 20 }}
    className={`absolute p-4 bg-[#faf9f5] shadow-sm border border-stone-200 cursor-pointer w-48 ${className}`}
    style={{ zIndex, borderRadius: '2px 8px 3px 4px' }}
    onMouseEnter={() => setCursorText('Drag')}
    onMouseLeave={() => setCursorText('')}
  >
    <WashiTape color="bg-sky" className="-top-2 -right-2 rotate-6 w-10 h-4 opacity-50" />
    <Quote size={14} className="text-rose/40 mb-2 pointer-events-none" />
    <p className="font-satoshi font-medium text-sm text-ink/80 leading-relaxed pointer-events-none select-none">{text}</p>
  </motion.div>
);

const ReviewCardContent = ({ quote, author, role, photoSrc, bgColor = "#fdfbf7", photoRotate = "-4deg", compact = false }: any) => (
  <div
    className={`${compact ? 'w-56' : 'w-72'} flex flex-col shadow-md pointer-events-none select-none border border-black/5 relative`}
    style={{ background: bgColor }}
  >
    {/* Plain washi tape — decoration only */}
    <div
      className="absolute -top-2 left-5 w-20 h-5 bg-lilac/55 z-10 shadow-sm"
      style={{ mixBlendMode: 'multiply', transform: 'rotate(-1.5deg)' }}
    />

    <div className={`flex flex-col ${compact ? 'gap-2.5 p-3 pt-5' : 'gap-3.5 p-5 pt-6'}`}>
      {/* REVIEWS label inside the card */}
      <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-ink/35">Reviews</span>

      {/* Quote */}
      <p
        className={`font-satoshi ${compact ? 'text-[12px]' : 'text-[14px]'} text-ink/70 leading-relaxed`}
        style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}
      >
        "{quote}"
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-black/8" />

      {/* Author row with color photo */}
      <div className="flex items-center gap-3">
        <div
          className={`bg-white ${compact ? 'p-1 pb-3.5' : 'p-1.5 pb-6'} shadow-sm border border-black/5 shrink-0`}
          style={{ transform: `rotate(${photoRotate})` }}
        >
          <img
            src={photoSrc}
            alt={author}
            className={`${compact ? 'w-10 h-10' : 'w-14 h-14'} object-cover opacity-95`}
            draggable={false}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className={`font-satoshi font-bold ${compact ? 'text-xs' : 'text-sm'} text-plum leading-snug`}>{author}</span>
          <span className="font-satoshi text-[8px] uppercase tracking-wider text-ink/40">{role}</span>
        </div>
      </div>
    </div>
  </div>
);

const reviews = [
  {
    quote: "A brilliant problem solver. The user experience was elevated beyond our expectations.",
    author: "Sarah Jenkins",
    role: "VP of Product, FinServe",
    photoSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop",
    bgColor: "#fdfbf7",
    photoRotate: "5deg",
    restRotate: -3,
    restX: -5,
    restY: 8,
  },
  {
    quote: "Incredible attention to detail and a fantastic collaborative spirit throughout the project.",
    author: "Marcus Chen",
    role: "Founder, StartupX",
    photoSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    bgColor: "#faf9f5",
    photoRotate: "-6deg",
    restRotate: 1,
    restX: 3,
    restY: 3,
  },
  {
    quote: "An exceptional product designer who blends aesthetics with functionality beautifully.",
    author: "Elena Rodriguez",
    role: "Product Lead, Build Africa AI",
    photoSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    bgColor: "#ffffff",
    photoRotate: "-3deg",
    restRotate: 0,
    restX: 0,
    restY: 0,
  },
];

const ReviewStack = ({ delay, setCursorText, className, compact = false }: any) => {
  const [flipped, setFlipped] = useState<boolean[]>(reviews.map(() => false));
  const draggedRef = React.useRef(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 1.2, type: "spring", stiffness: 100, damping: 20 }}
      className={`absolute cursor-pointer ${className}`}
      style={{ zIndex: 12 }}
      onMouseEnter={() => { setCursorText('Flip'); playSound('soft'); }}
      onMouseLeave={() => setCursorText('')}
    >
      {reviews.map((review, i) => (
        <motion.div
          key={i}
          drag
          dragMomentum={false}
          initial={{ rotate: review.restRotate, x: review.restX, y: review.restY }}
          whileDrag={{ scale: 1.04, zIndex: 50 }}
          transition={{ type: "spring", stiffness: 250, damping: 22 }}
          onDragStart={() => { draggedRef.current = true; }}
          onDragEnd={() => { setTimeout(() => { draggedRef.current = false; }, 60); }}
          onClick={() => { if (!draggedRef.current) { playSound('review'); setFlipped(prev => prev.map((f, idx) => idx === i ? !f : f)); } }}
          className="absolute cursor-pointer"
          style={{ zIndex: i + 10 }}
        >
          <div style={{ perspective: '900px', width: compact ? '208px' : '256px' }}>
            <motion.div
              animate={{ rotateY: flipped[i] ? 180 : 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%' }}
            >
              {/* Front */}
              <div style={{ backfaceVisibility: 'hidden' }}>
                <ReviewCardContent {...review} compact={compact} />
              </div>
              {/* Back */}
              <div
                className={`${compact ? 'p-3' : 'p-4'} bg-[#f8f4ff] border border-plum/15 shadow-md flex flex-col gap-3 select-none`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className="font-mono text-[8px] uppercase tracking-widest text-plum/40">✦ Review</span>
                <p className={`font-gelica italic ${compact ? 'text-[10px]' : 'text-[12px]'} text-plum/80 leading-relaxed`}>"{review.quote}"</p>
                <div className="mt-auto">
                  <p className="font-satoshi font-semibold text-xs text-plum">{review.author}</p>
                  <p className="font-mono text-[8px] uppercase tracking-wider text-ink/40">{review.role}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
      <div className={`${compact ? 'w-56 h-48' : 'w-72 h-56'} opacity-0 pointer-events-none`} />
    </motion.div>
  );
};

const PhotoStrip = ({ delay, className, setCursorText }: any) => (
  <motion.div
    drag
    whileHover={{ scale: 1.08, zIndex: 50, transition: { duration: 0.2, delay: 0 } }}
    initial={{ opacity: 0, y: 40, rotate: -2 }}
    animate={{ opacity: 1, y: 0, rotate: 2 }}
    transition={{ delay, duration: 1.2, type: "spring", stiffness: 100, damping: 20 }}
    className={`absolute bg-white p-2 shadow-sm border border-gray-100 cursor-pointer flex flex-col gap-2 ${className}`}
    style={{ zIndex: 8 }}
    onMouseEnter={() => setCursorText('Drag')}
    onMouseLeave={() => setCursorText('')}
  >
    <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=200&auto=format&fit=crop" className="w-16 h-16 object-cover pointer-events-none grayscale contrast-100 opacity-90" draggable={false} alt="Texture 1" referrerPolicy="no-referrer" />
    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" className="w-16 h-16 object-cover pointer-events-none grayscale contrast-100 opacity-90" draggable={false} alt="Texture 2" referrerPolicy="no-referrer" />
    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" className="w-16 h-16 object-cover pointer-events-none grayscale contrast-100 opacity-90" draggable={false} alt="Texture 3" referrerPolicy="no-referrer" />
  </motion.div>
);

const EmojiScrap = ({ emoji, className, rotation, zIndex, delay, setCursorText, size = "text-4xl" }: any) => (
  <motion.div
    drag
    whileHover={{ scale: 1.2, rotate: rotation + 10, zIndex: 50, transition: { duration: 0.2, delay: 0 } }}
    initial={{ opacity: 0, y: 20, scale: 0.5, rotate: rotation - 20 }}
    animate={{ opacity: 1, y: 0, scale: 1, rotate: rotation }}
    transition={{ delay, duration: 1.2, type: "spring", stiffness: 100, damping: 15 }}
    className={`absolute cursor-pointer ${size} ${className}`}
    style={{ zIndex }}
    onMouseEnter={() => setCursorText('Drag')}
    onMouseLeave={() => setCursorText('')}
  >
    <span className="pointer-events-none drop-shadow-sm select-none">{emoji}</span>
  </motion.div>
);


const Bookmark = ({ text, color, setCursorText, delay }: any) => (
  <motion.div
    initial={{ x: 50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay, type: "spring", stiffness: 100 }}
    className={`rounded-l-md ${color} text-white py-2 px-4 cursor-pointer shadow-sm transition-transform hover:-translate-x-2 flex items-center w-fit self-end`}
    onMouseEnter={() => setCursorText('View')}
    onMouseLeave={() => setCursorText('')}
  >
    <span className="font-satoshi font-bold uppercase text-[11px] pointer-events-none select-none tracking-wider">{text}</span>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT DATA
// ─────────────────────────────────────────────────────────────────────────────
type CaseSection =
  | { type: 'asset'; label: string; desc: string; image?: string }
  | { type: 'h2'; heading: string; body: string; sectionLabel?: string }
  | { type: 'h3-list'; heading: string; items: string[] }
  | { type: 'stats'; items: { value: string; label: string }[] }
  | { type: 'pullquote'; text: string }
  | { type: 'bold-bullets'; heading?: string; items: { bold: string; text: string }[] };

const PROJECT_DATA: Record<string, {
  title: string; subtitle: string; headline: string; role: string; duration: string;
  tags: string[]; accentColor: string; bgColor: string; thumbnail?: string; sections: CaseSection[];
}> = {
  'Fox Holistic Care': {
    title: 'Fox Holistic Care',
    subtitle: 'Mental Health Platform',
    headline: 'Fox Holistic Care makes mental health support free, instant, and 24/7.',
    role: 'Sole Product Designer',
    duration: '3 months',
    tags: ['UX Research', 'UI Design', 'Product Strategy', 'Mental Health'],
    accentColor: '#f9a8d4',
    bgColor: '#fce7f3',
    thumbnail: '/f-o.jpg',
    sections: [
      { type: 'asset', label: 'Hero Mockup', image: '/f-o.jpg', desc: 'Full-width split view — mobile showing the calming home page with soft colour palette and sparkle navigation animations, desktop showing the doctor booking preview page. Warm, inviting tone.' },
      { type: 'h2', sectionLabel: 'The Problem', heading: 'Mental health is still taboo, and millions of people who need help never ask for it.', body: 'I joined Fox Holistic Care as the sole designer with a clear mission: build a platform where anyone could access a mental health professional for free, at any hour of the day. The product needed to serve everyone from people in acute crisis to those just beginning to think about their mental wellness. That breadth made every design decision high stakes, because one wrong note could make a vulnerable person close the tab.' },
      { type: 'asset', label: '💡 Problem Illustration', desc: '← Add illustration, GIF, or meme here showing the emotional weight of mental health stigma. This could be an editorial illustration, screenshot annotation, or custom graphic that visualizes the problem.' },
      { type: 'h2', sectionLabel: 'The Challenge', heading: 'When I tried to research user needs, people wouldn\'t talk about their mental states.', body: 'The first and hardest challenge was research. Mental health carries so much stigma that the people I most needed to understand were the least willing to open up. Traditional interview methods hit a wall of silence. I had to find indirect ways to gather insights and supplement with secondary research to build a picture of what users actually needed from this experience.' },
      { type: 'asset', label: 'Sketch / Exploration Grid', desc: 'Early research artifacts — user journey mapping, notes from indirect research, and initial problem framing. 4–6 thumbnail grid, slightly desaturated or hand-drawn aesthetic.' },
      { type: 'h2', sectionLabel: 'First Attempt', heading: 'The first version looked like every other health platform, and users called it out immediately.', body: 'My initial design used standard circular layouts, conventional patterns, and typical stock imagery. User feedback was blunt: it felt basic and derivative. For a platform asking vulnerable people to trust it with their mental health, looking like a template was a dealbreaker. I went back to Pinterest and other sources to find an aesthetic that matched the emotional specificity this product demanded.' },
      { type: 'asset', label: '🎨 Strategy Visualization', image: '/Fox.initially.jpg', desc: 'The initial Fox Holistic Care home screen — the first version before the redesign, showing where the design started.' },
      { type: 'h2', sectionLabel: 'My Strategy', heading: 'I decided that every element on screen had to do therapeutic work before a single word was read.', body: 'My guiding strategy was to treat the interface itself as a calming experience. Every decision filtered through one question: does this make a vulnerable person feel safer? Stock photos were replaced with original, intentional imagery. I added micro-interactions throughout, including subtle sparkling stars on the navigation that created a feeling of calm wonder without overwhelming the page. Affirmative words like "relax", "be calm", "we are here for you" were placed as a design layer, not an afterthought.' },
      { type: 'h3-list', heading: 'What this ruled out', items: ['Clinical or sterile visual language that would reinforce medical anxiety', 'Dense informational layouts that would overwhelm someone already in distress', 'Generic stock photography that felt impersonal at a moment requiring trust'] },
      { type: 'asset', label: 'Component Closeup', image: '/Little details.png', desc: 'Zoomed view of the navigation bar showing the sparkling star micro-interaction — the subtlety of the animation and how it sits within the overall UI.' },
      { type: 'asset', label: 'Interaction Demo', image: '/Interaction Demo.mov', desc: 'Navigation sparkle animation in context — how it feels during actual browsing.' },
      { type: 'h2', sectionLabel: 'Key Decision', heading: 'The doctor booking page became a preview, not a form.', body: 'One of the biggest design shifts was reimagining how users book a consultation. Rather than a transactional form with time slots, I built an interactive preview where users could see who they would be speaking with, browse specialisations, and view speaking rates in an approachable, inviting way. For someone who has never sought mental health support before, choosing a person to trust matters far more than choosing a time slot.' },
      { type: 'asset', label: 'Booking Demo', image: '/Book Appointment.mov', desc: 'The doctor booking preview page — interactive browsing experience, doctor profile preview, rate display, and warm visual treatment.' },
      { type: 'h2', sectionLabel: 'The Process', heading: 'I used ChatGPT to write the platform\'s affirmative copy and content at scale.', body: 'With full design ownership and no dedicated copywriter, I used ChatGPT to generate header text, body copy, and the affirmative language woven throughout the platform. This kept the written tone consistent and warm across every page while freeing me to focus on the visual and interaction design that made the emotional strategy tangible.' },
      { type: 'h2', sectionLabel: 'The Outcome', heading: 'Fox Holistic Care now serves over 200,000 users across the United States.', body: 'The platform launched on both mobile and desktop and gained real traction. Users specifically praised how calm the experience felt during navigation. The micro-interactions and affirmative language did what they were designed to do: lower the emotional barrier enough that people followed through.' },
      { type: 'stats', items: [{ value: '200,000+', label: 'Active users in the United States' }, { value: 'Verified', label: 'Psychology Today directory' }, { value: 'Secured', label: 'Insurance company partnerships' }, { value: '30–50%', label: 'User growth rate' }] },
      { type: 'asset', label: 'Final Product Showcase', image: '/Mobile light.jpg', desc: 'Multi-device showcase — the Fox Holistic Care mobile experience, showing the home page and doctor booking preview. Soft, premium aesthetic.' },
      { type: 'h2', sectionLabel: 'Reflection', heading: 'How designing for vulnerability changed the way I think about every project.', body: 'Fox Holistic Care shifted something fundamental in how I approach design. A few things I carry forward from this project:' },
      { type: 'bold-bullets', items: [{ bold: 'Stigma is a design problem', text: '— when your users won\'t even talk about their needs during research, the interface has to earn trust on its own, silently and immediately.' }, { bold: 'Micro-interactions can do emotional work', text: '— the sparkling stars and subtle animations weren\'t decorative. They were load-bearing elements of the calm strategy.' }, { bold: 'Affirmative language is a design layer', text: '— "relax", "be calm", "we are here for you" were as intentional as any colour or layout choice.' }, { bold: 'Booking a doctor is choosing a person to trust', text: '— turning the booking flow into an interactive preview instead of a form was the single biggest UX decision I made on this project.' }, { bold: 'Empathy extends beyond the screen', text: '— this project taught me to see every user as someone potentially arriving in a difficult moment. That lens applies to everything I design now.' }] },
      { type: 'asset', label: 'Hero Video', image: '/Desktop Green.jpg', desc: 'Full desktop view of the Fox Holistic Care platform — home page with soft colour palette, affirmative language, and warm visual identity.' },
    ],
  },
  'Build Africa AI': {
    title: 'Build Africa AI',
    subtitle: 'AI in Construction',
    headline: 'Build Africa AI turns a six-week construction estimate into an instant answer.',
    role: 'Founding Designer',
    duration: '4 months',
    tags: ['AI Integration', 'Dashboard Design', 'B2B SaaS', 'Data Visualisation'],
    accentColor: '#a5b4fc',
    bgColor: '#e0e7ff',
    thumbnail: '/build-africa-ai.jpg',
    sections: [
      { type: 'asset', label: 'Hero Mockup', image: '/build-africa-ai.jpg', desc: 'Full-width hero — the Build Africa AI web platform with the 3D building visualisation on one side and the cost breakdown panel on the other. Dark or earthy tones reflecting the construction context.' },
      { type: 'h2', sectionLabel: 'Context', heading: 'I was the founding designer on a product that had never existed before.', body: 'Build Africa AI is a web platform that lets anyone find out how much their building will cost before they break ground. Users input their dimensions, and the platform generates a 2D layout, a 3D model, a full Bill of Quantities, and an AI-powered cost estimate — all in one place. I joined as the founding designer on a small team of three developers, one product manager, and one CTO, taking full ownership from initial research through to final UI delivery.' },
      { type: 'asset', label: 'Final Product Showcase', image: '/Jitter-1.gif', desc: 'The full Build Africa AI platform flow — dimension input, 2D floor plan, 3D model, and cost estimate.' },
      { type: 'h2', sectionLabel: 'The Problem', heading: 'Getting a construction cost estimate in Africa took four to six weeks — and was often wrong by the time it arrived.', body: 'I spoke directly with architects and civil engineers to understand how cost estimation actually worked in practice. What I found was a process that was slow, fragmented, and structurally unreliable. Professionals were using disconnected tools — some were still working in Excel. By the time a client received their estimate, inflation had often already shifted the numbers. For homeowners, that meant committing to a budget that was already out of date before the project even started.' },
      { type: 'asset', label: '💡 Problem Illustration', desc: '← Add user research visualization, journey map, or problem statement graphic here. This could show the pain points of the old workflow or an illustration of the core problem.' },
      { type: 'asset', label: 'BOQ Before After', image: '/BOQ.png', desc: 'The old way: a manually prepared Bill of Quantities in Excel — weeks of specialist work, prone to inflation errors before delivery.' },
      { type: 'h2', sectionLabel: 'The Impact', heading: 'Homeowners budgeted carefully, then watched their costs spiral during the build.', body: 'The inaccuracy wasn\'t just an inconvenience. People were saving up, committing to a number, and then discovering mid-construction that reality had diverged significantly from the estimate. The root cause wasn\'t a lack of effort from professionals — it was that the tools and timelines made precision nearly impossible. A six-week wait plus fragmented data plus inflation meant the estimate was already stale on delivery.' },
      { type: 'asset', label: 'Cost Estimation Screen', image: '/Cost estimate and Moq.png', desc: 'The AI cost estimation results — real-time pricing, material breakdown by category, and inflation-adjusted totals. Every line item generated instantly.' },
      { type: 'h2', sectionLabel: 'My Strategy', heading: 'I brought every tool into one unified platform and let AI handle accuracy and price prediction.', body: 'The strategic decision was consolidation. Rather than improve one part of the existing workflow, I unified the 2D visualisation, 3D model, BOQ, COQ, and AI cost engine into a single experience. This eliminated the fragmentation that was generating inaccuracy. AI also allowed the platform to model price fluctuations over time — meaning estimates could account for inflation across the build window, not just reflect today\'s prices.' },
      { type: 'h3-list', heading: 'What I scoped out early', items: ['Manual data entry from existing survey documents — initially required, later removed as a barrier', 'Complex professional-only tooling that would alienate homeowner users', 'Multi-project management features — kept the focus on the single estimation journey'] },
      { type: 'asset', label: '🎨 Strategy Architecture', image: '/3D image.jpg', desc: 'The 3D exterior view with the unified AI toolbar — 3D Design, Get Material Estimate, and Ask Build AI all accessible from a single screen.' },
      { type: 'h2', sectionLabel: 'Key Decision', heading: 'We opened the platform to anyone with a tape measure, not just users who already had a survey plan.', body: 'My original design assumed users would arrive with a survey plan in hand. Midway through, I recognised this was locking out a large share of the people who needed the tool most. I redesigned the entry flow to accept raw dimensions instead — length, width, number of floors. That single decision made Build Africa AI accessible to anyone thinking about building, not just those already deep in the process.' },
      { type: 'asset', label: 'Interaction Demo', image: '/2d screenshot.png', desc: 'The "Plan and Visualise your Home" input screen — the redesigned entry flow accepting raw dimensions. Anyone with a tape measure can start.' },
      { type: 'h2', sectionLabel: 'Iteration', heading: 'Showing everything at once overwhelmed users on the 3D page.', body: 'The first version of the 3D results page displayed all information simultaneously — cost data, material quantities, and the 3D model competing for attention at once. User feedback was clear: it was too much. I restructured the layout using a collapsible panel system, letting users expand and collapse sections on demand. The model stayed prominent; the detail was available but not intrusive.' },
      { type: 'asset', label: 'Iteration Collage', image: '/3d-initial-1.jpg', image2: '/3d-final-1.jpg', desc: 'Left: initial 3D view — before refinement. Right: final 3D look — the polished, investor-ready version.' },
      { type: 'h2', sectionLabel: 'The Process', heading: 'I used ChatGPT to pressure-test layouts and critique my own designs in real time.', body: 'Working in a compressed timeline with no existing product to benchmark against, I needed a fast second opinion at every stage. I used ChatGPT throughout the design process — to generate alternative layout directions, stress-test information hierarchy decisions, and critique my work before presenting to the team. It became an always-available collaborator that helped me move faster without sacrificing rigour.' },
      { type: 'asset', label: 'Sketch / Exploration Grid', image: '/process-1.png', image2: '/process-2.png', desc: 'ChatGPT-assisted layout explorations — two directions considered before landing on the final approach.' },
      { type: 'h2', sectionLabel: 'The Outcome', heading: 'Build Africa AI won Best AI at Gitex 2025 and secured investor funding.', body: 'The platform was presented at Gitex 2025, one of the world\'s largest technology events, and won the Best AI award in the AI category. Investors responded to the design directly — citing the animation quality, the user-friendliness, and the clarity of how AI solved the wait-time problem. The team also secured investment, validating the concept and the execution simultaneously.' },
      { type: 'stats', items: [{ value: 'Best AI', label: 'Gitex Global 2025' }, { value: 'Secured', label: 'Investor funding' }, { value: 'Instant', label: 'vs 4–6 week wait' }, { value: '1 platform', label: '2D + 3D + BOQ + AI cost' }] },
      { type: 'asset', label: 'Final Product Showcase', image: '/build-africa-mockup.jpg', desc: 'Polished multi-device showcase of the finished Build Africa AI platform — full dashboard on desktop. Warm, premium aesthetic.' },
      { type: 'h2', sectionLabel: 'Reflection', heading: 'What I learned, and what I\'d do differently with AI tools.', body: 'This project taught me as much about speed and strategy as it did about design. A few things I\'m taking forward:' },
      { type: 'bold-bullets', items: [{ bold: 'Primary research is worth protecting', text: '— even under launch pressure, the interviews with architects and civil engineers shaped every major decision. I\'d fight harder to preserve that time upfront.' }, { bold: 'AI critique accelerates iteration', text: '— using ChatGPT to challenge my layouts in real time saved rounds of internal review. This is now a standard part of my process.' }, { bold: 'Designing with no benchmark is a feature, not a problem', text: '— the absence of a competitor to copy forced genuinely original thinking. The Gitex judges noticed.' }, { bold: 'Next time: prototype with AI before building', text: '— tools like Cursor and Claude would let me create high-fidelity interactive prototypes before a single line of production code is written.' }] },
      { type: 'asset', label: 'Hero Video', image: '/build-africa-phone.png', desc: '10–15 second screen recording of the full Build Africa AI journey — entering dimensions, watching the 2D and 3D generate, reviewing the cost estimate.' },
    ],
  },
  'She': {
    title: 'She',
    subtitle: 'E-Commerce Platform',
    headline: 'SHE redesigned the shopping experience around one principle: let people shop.',
    role: 'UI/UX Designer',
    duration: '4–6 weeks',
    tags: ['E-Commerce', 'UX Review', 'Conversion Design', 'African Jewellery'],
    accentColor: '#d4a96a',
    bgColor: '#f4e4c4',
    thumbnail: '/she.jpg',
    sections: [
      { type: 'asset', label: 'Hero Mockup', image: '/she.jpg', desc: 'SHE e-commerce platform — redesigned landing page with sidebar cart visible alongside the browsing experience. Professional African-centric jewellery photography. Premium, culturally specific aesthetic.' },
      { type: 'h2', sectionLabel: 'Context', heading: 'SHE sells African jewellery to a global audience — and the shopping experience needed to match.', body: 'SHE is an e-commerce platform in the beauty industry selling African jewellery to customers across the UK, US, and Canada — drawn to the cultural identity and craftsmanship of African design. The user base was diverse: people shopping for themselves, buying gifts for wives, girlfriends, and loved ones. I was brought in to conduct a UX review, diagnose usability problems, and implement targeted improvements before the platform went live.' },
      { type: 'pullquote', text: '"People from the UK would literally say, \'Hey, they like African jewelry and they would like to buy.\' It was a diverse target audience that we were offering this service to."' },
      { type: 'h2', sectionLabel: 'The Problem', heading: 'The landing page was trying to market and sell at the same time — and achieving neither.', body: 'A UX review with real users revealed a critical friction point: users were hesitating on the landing page because there was too much information and no clear path to start shopping. The page was cluttered with marketing phrases like "gentle on skin" and "radiance on you", repeated reviews, and images with no calls to action. Information was repeated across several sections. The layout felt scattered and unorganised. Users arriving ready to buy couldn\'t easily find where to start.' },
      { type: 'asset', label: '💡 Problem Visualization', desc: '← Add annotated screenshot of the original landing page, UX heatmap, user research findings, or friction point illustration here.' },
      { type: 'pullquote', text: '"The initial landing page was kind of distracting. It looked more like a landing page rather than an e-commerce platform or a shopping platform."' },
      { type: 'h3-list', heading: 'What the UX review surfaced', items: ['There was lots of information and it was quite hard for users to see where to shop', 'Repetition of information in several places — no clear visual hierarchy', 'Cart and checkout required leaving the page entirely, breaking the browsing flow', 'No calls-to-action visible — purchase intent had nowhere to go'] },
      { type: 'asset', label: 'UX Review Findings', desc: 'Landing page annotated with the key friction points — repeated information, missing calls-to-action, and the scattered layout that made it hard to find where to start shopping.' },
      { type: 'h2', sectionLabel: 'Constraints', heading: 'The biggest obstacle wasn\'t the design — it was finding the right photography.', body: 'Finding high-quality, African-centric product photography that matched the brand identity was one of the biggest challenges. Generic imagery wouldn\'t carry the cultural specificity that SHE needed. This slowed the team down significantly at first. We also had a tight 4–6 week window and, as an MVP, no analytics tracking — meaning success would be measured through qualitative feedback rather than hard data.' },
      { type: 'h2', sectionLabel: 'My Strategy', heading: 'I restructured everything around one principle: let people shop.', body: 'The core strategic choice was to prioritise the shopping journey over brand storytelling. Rather than convincing users through marketing copy and testimonials, the redesign assumed purchase intent and optimised for immediate product discovery. Suggestions and discount prompts were added to give users a clear entry point. The checkout and cart were moved to a sidebar — allowing users to browse, add items, and purchase without ever leaving the page.' },
      { type: 'asset', label: '🎨 New Layout Strategy', image: '/she-landing-page.jpg', desc: 'The redesigned landing page — streamlined layout with clear visual hierarchy and an immediate path to shopping.' },
      { type: 'pullquote', text: '"On the same page you can still check out and you can still buy what you want to buy. Your checkout and your cart are just on the sidebar, and you can do everything all at once."' },
      { type: 'asset', label: 'Sidebar Cart Experience', image: '/she-overlay.jpg', desc: 'Single-page shopping experience — browsing, cart, and checkout coexisting on one screen. No navigating between separate pages to complete a purchase.' },
      { type: 'h2', sectionLabel: 'The Process', heading: 'We took inspiration from the biggest jewellery brands in the US and Canada — then made it SHE\'s own.', body: 'The team drew inspiration from established premium jewellery e-commerce patterns, then adapted them for SHE\'s distinct African-centric identity. A professional photoshoot was commissioned to resolve the imagery bottleneck. Once high-quality, culturally specific images were available, the design came together — a cleaner, more modern layout that preserved SHE\'s African identity intact.' },
      { type: 'asset', label: 'Professional Photography', image: '/she-proff.png', desc: 'High-resolution, authentically African-centric product photography — replacing generic stock imagery and providing the visual foundation the brand required.' },
      { type: 'h3-list', heading: 'What worked', items: ['Product suggestions and discount prompts gave users an immediate path to shopping', 'Sidebar cart and checkout — the entire shopping experience on a single page', 'Professional African-centric photography at the quality the brand required', 'Redesigned icons that users described as "cute and nice"', 'Cleaned-up layout with clear visual hierarchy and no repetition'] },
      { type: 'h2', sectionLabel: 'The Outcome', heading: 'SHE launched — and the feedback confirmed the redesign worked.', body: 'SHE launched as a redesigned e-commerce platform with a streamlined landing page, single-page shopping experience with sidebar cart and checkout, professional African-centric photography, and refreshed iconography. The entire purchase journey — from discovery through to payment — could be completed without leaving the page.' },
      { type: 'stats', items: [{ value: 'Launched', label: 'MVP live for global audience' }, { value: 'Single page', label: 'Browse + cart + checkout' }, { value: '"Cute and nice"', label: 'User feedback on icon redesign' }, { value: '4–6 weeks', label: 'From UX review to live platform' }] },
      { type: 'asset', label: 'Final Product Showcase', image: '/she-mockup.jpg', desc: 'Polished showcase of the finished SHE platform — streamlined landing page with sidebar cart and professional African-centric jewellery photography.' },
      { type: 'h2', sectionLabel: 'Reflection', heading: 'If I did it again, I\'d lock down photography before opening a design file.', body: 'The most significant takeaway was about planning for imagery early. The professional photoshoot was the right solution, but the initial delay in sourcing high-quality, culturally specific images slowed the process. In future projects, I would prioritise locking down photography before beginning design work.' },
      { type: 'bold-bullets', items: [{ bold: 'Plan for photography before design begins', text: '— the photoshoot was the right call, but sourcing culturally specific, high-quality images took longer than expected. Lock it down first.' }, { bold: 'The UX review was the right starting point', text: '— real user feedback pinpointed exactly where to focus. Starting with observation rather than assumption saved time.' }, { bold: 'Sidebar cart is a standout UX pattern', text: '— users appreciated not being bounced between pages. I\'d reach for this pattern early in any e-commerce project.' }, { bold: 'Brand identity lives in the details', text: '— the icon redesign was called out specifically as "cute and nice." Small things carry big brand signal.' }] },
    ],
  },
};

const FolderContent = ({ title, subtitle, folderColor, tabColor, image, compact = false }: any) => (
  <>
    <div className={`${compact ? 'w-14 h-5' : 'w-20 h-7'} ${tabColor} rounded-t-lg ml-3 border border-b-0 border-black/10 shadow-sm relative z-10 flex items-center px-2`}>
      <span className="font-mono text-[8px] uppercase tracking-widest text-ink/60 select-none pointer-events-none">Project</span>
    </div>
    <div className={`${compact ? 'w-40 h-40' : 'w-60 h-56'} ${folderColor} rounded-b-lg rounded-tr-lg shadow-md border border-black/10 ${compact ? 'p-2' : 'p-3'} flex flex-col gap-2 relative z-20`}>
      {/* Image preview — like a photo slipped into the folder */}
      {image && (
        <div className={`w-full ${compact ? 'h-16' : 'h-28'} overflow-hidden shrink-0 bg-black/10 shadow-sm border border-white/60`} style={{ transform: 'rotate(-0.5deg)' }}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover opacity-95 pointer-events-none"
            draggable={false}
          />
        </div>
      )}
      {/* Text card */}
      <div className={`flex-1 bg-[#faf9f5] w-full ${compact ? 'p-1.5' : 'p-2.5'} border border-black/5 shadow-inner flex flex-col justify-center items-center text-center transform -rotate-1 pointer-events-none`}>
        <h3 className={`font-gelica ${compact ? 'text-xs' : 'text-lg'} text-ink leading-tight`}>{title}</h3>
        <p className="font-satoshi text-[9px] text-ink/60 mt-0.5">{subtitle}</p>
        {!compact && <p className="font-mono text-[8px] uppercase tracking-widest text-ink/30 mt-2">Click to explore ↗</p>}
      </div>
    </div>
  </>
);

const ProjectStack = ({ delay, setCursorText, className, compact = false, onOpenProjects }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      drag
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 1.2, type: "spring", stiffness: 100, damping: 20 }}
      className={`absolute cursor-pointer ${className}`}
      style={{ zIndex: 13 }}
      onMouseEnter={() => { setCursorText('View projects'); setIsHovered(true); playSound('soft'); }}
      onMouseLeave={() => { setCursorText(''); setIsHovered(false); }}
      whileHover={{ scale: 1.05, zIndex: 50, transition: { duration: 0.2 } }}
      onTap={onOpenProjects}
    >
      {/* Bottom Folder (Light Brown) */}
      <motion.div
        animate={{
          rotate: isHovered ? -15 : -4,
          x: isHovered ? (compact ? -40 : -70) : -4,
          y: isHovered ? 10 : 4
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute origin-bottom-left"
      >
        <FolderContent
          title="She"
          subtitle="E-Commerce Platform"
          folderColor="bg-[#f4e4c4]"
          tabColor="bg-[#e8d5b5]"
          image="/she.jpg"
          compact={compact}
        />
      </motion.div>

      {/* Middle Folder — Fox Holistic Care (center, most visible) */}
      <motion.div
        animate={{
          rotate: isHovered ? 0 : 0,
          x: isHovered ? 0 : 0,
          y: isHovered ? -20 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute origin-bottom"
      >
        <FolderContent
          title="Fox Holistic Care"
          subtitle="Mental Health Platform"
          folderColor="bg-[#fce7f3]"
          tabColor="bg-[#fbcfe8]"
          image="/f-o.jpg"
          compact={compact}
        />
      </motion.div>

      {/* Top Folder — Build Africa AI (right tilt) */}
      <motion.div
        animate={{
          rotate: isHovered ? 15 : 4,
          x: isHovered ? (compact ? 40 : 70) : 4,
          y: isHovered ? 10 : -4
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative origin-bottom-right"
      >
        <FolderContent
          title="Build Africa AI"
          subtitle="AI in Construction"
          folderColor="bg-[#e0e7ff]"
          tabColor="bg-[#c7d2fe]"
          image="/build-africa-ai.jpg"
          compact={compact}
        />
      </motion.div>
    </motion.div>
  );
};

const ContactEnvelope = ({ delay, setCursorText, className, rotation = 0, zIndex = 10, compact = false }: any) => (
  <motion.div
    drag
    initial={{ opacity: 0, scale: 0.9, rotate: rotation - 10 }}
    animate={{ opacity: 1, scale: 1, rotate: rotation }}
    transition={{ delay, duration: 1.2, type: "spring", stiffness: 100, damping: 20 }}
    whileHover={{ y: -6, scale: 1.04, zIndex: 50, transition: { duration: 0.25, ease: 'easeOut' } }}
    className={`absolute cursor-pointer ${className}`}
    style={{ zIndex }}
    onMouseEnter={() => { setCursorText('Contact'); playSound('envelope'); }}
    onMouseLeave={() => setCursorText('')}
  >
    <div className={`relative ${compact ? 'w-52' : 'w-72'}`} style={{ paddingTop: compact ? '42px' : '52px' }}>
      {/* Washi tape across top */}
      <div className="absolute top-8 left-6 w-20 h-5 bg-[#DABFFF]/70 rotate-[-1deg] z-30 shadow-sm pointer-events-none"
        style={{ mixBlendMode: 'multiply' }}>
        <div className="w-full h-full opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Inner card — always visible/elevated */}
      <div className="relative w-full bg-white shadow-md border border-black/5 rounded-sm z-20 flex flex-col items-center py-5 gap-3">
        <span className="font-gelica italic text-sm text-plum tracking-wide">reach out ✦</span>
        <div className="flex gap-5 items-start">
          {/* Email */}
          <div className="flex flex-col items-center gap-1.5">
            <a
              href="mailto:mowaotun2000@gmail.com"
              title="Send an email"
              className={`${compact ? 'w-9 h-9' : 'w-12 h-12'} rounded-full bg-rose/10 border border-rose/20 flex items-center justify-center text-rose hover:bg-rose hover:text-white hover:scale-110 hover:shadow-md transition-all duration-200 shadow-sm pointer-events-auto cursor-pointer`}
            >
              <Mail size={20} />
            </a>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50 pointer-events-none">Gmail</span>
          </div>
          {/* LinkedIn */}
          <div className="flex flex-col items-center gap-1.5">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              title="View LinkedIn profile"
              className={`${compact ? 'w-9 h-9' : 'w-12 h-12'} rounded-full bg-sky/10 border border-sky/20 flex items-center justify-center text-sky hover:bg-sky hover:text-white hover:scale-110 hover:shadow-md transition-all duration-200 shadow-sm pointer-events-auto cursor-pointer`}
            >
              <Linkedin size={20} />
            </a>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50 pointer-events-none">LinkedIn</span>
          </div>
          {/* Resume */}
          <div className="flex flex-col items-center gap-1.5">
            <a
              href="https://docs.google.com/document/d/your-doc-id/edit"
              target="_blank"
              rel="noreferrer"
              title="View resume on Google Docs"
              className={`${compact ? 'w-9 h-9' : 'w-12 h-12'} rounded-full bg-plum/10 border border-plum/20 flex items-center justify-center text-plum hover:bg-plum hover:text-white hover:scale-110 hover:shadow-md transition-all duration-200 shadow-sm pointer-events-auto cursor-pointer`}
            >
              <FileText size={20} />
            </a>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50 pointer-events-none">Resume</span>
          </div>
        </div>
      </div>

      {/* Envelope body — sits behind/below the card */}
      <div className={`absolute bottom-0 left-0 right-0 ${compact ? 'h-12' : 'h-16'} bg-[#fce9f5] border border-rose/10 rounded-b-sm z-10 overflow-hidden pointer-events-none`}>
        {/* Left triangle flap */}
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 50% 60%, 0 100%)', background: '#f0e6ff' }} />
        {/* Right triangle flap */}
        <div className="absolute inset-0" style={{ clipPath: 'polygon(100% 0, 50% 60%, 100% 100%)', background: '#fce7f3' }} />
        {/* Bottom flap */}
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 100%, 50% 40%, 100% 100%)', background: '#fdfbf7' }} />
        {/* Open top flap (folded back) */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{ clipPath: 'polygon(0 0, 50% 60%, 100% 0)', background: '#f5e8ff', borderBottom: '1px solid rgba(216,30,91,0.06)', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}
          />
      </div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PATH BUTTERFLY — decorative 🦋 that floats gently at a fixed canvas position
// ─────────────────────────────────────────────────────────────────────────────
const PathButterfly = ({
  className,
  driftX = 4,
  driftY = 6,
  delay = 0,
  size = 'text-2xl',
}: {
  className: string;
  driftX?: number;
  driftY?: number;
  delay?: number;
  size?: string;
}) => (
  <motion.div
    className={`absolute pointer-events-none select-none z-[8] ${size} ${className}`}
    initial={{ opacity: 0, scale: 0.6 }}
    animate={{
      opacity: [0, 1, 1],
      scale: [0.6, 1.1, 1],
      x: [0, driftX, -driftX * 0.6, driftX * 0.3, 0],
      y: [0, -driftY, driftY * 0.5, -driftY * 0.4, 0],
    }}
    transition={{
      opacity: { delay, duration: 0.9, times: [0, 0.6, 1] },
      scale:   { delay, duration: 0.9, times: [0, 0.6, 1] },
      x: { delay: delay + 0.9, duration: 5.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
      y: { delay: delay + 0.9, duration: 4.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
    }}
  >
    🦋
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCRIBBLE ANNOTATIONS — two hand-drawn curly-loop arrows labelling FlipCard + ProjectStack
// ─────────────────────────────────────────────────────────────────────────────
const ScribbleAnnotations = ({ show, compact = false }: { show: boolean; compact?: boolean }) => {
  useEffect(() => {
    const id = 'caveat-font';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap';
    document.head.appendChild(link);
  }, []);

  if (!show || compact) return null;

  const arrowColor = '#b0a8b0';
  // Dashed body
  const sw = { stroke: arrowColor, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeDasharray: '5 3.5', fill: 'none' };
  // Solid arrowhead tip
  const tip = { stroke: arrowColor, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const label: React.CSSProperties = { fontFamily: "'Caveat', cursive", fontSize: '19px', color: '#111', display: 'block', lineHeight: 1.2, whiteSpace: 'nowrap', userSelect: 'none' };

  return (
    <>
      {/* ── "Hi, this is me" — below-right of FlipCard, curly arrow points UP toward card ── */}
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{ top: '37%', right: '7%', zIndex: 20, transform: 'rotate(-6deg)', transformOrigin: 'center bottom' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1.0, ease: 'easeOut' }}
      >
        {/* Curly looping arrow pointing UP — tail at bottom, arrowhead at top */}
        <svg width="78" height="122" viewBox="0 0 78 122" fill="none" style={{ display: 'block', marginBottom: 5 }}>
          {/* Body: starts at bottom, curves up, loops, continues to tip */}
          <path d="M 58 120 C 66 102, 62 88, 56 76 C 50 64, 38 67, 42 78 C 46 89, 60 87, 55 74 C 50 60, 36 46, 22 30 C 18 24, 12 16, 8 8" {...sw} />
          {/* Arrowhead — two solid prongs at top */}
          <path d="M 2 17 L 8 8 L 17 13" {...tip} />
        </svg>
        <span style={label}>Hi, this is me ✨</span>
      </motion.div>

      {/* ── "selected projects" — right of ProjectStack, curly arrow points LEFT toward stack ── */}
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{ top: '34%', left: '12%', zIndex: 20, transform: 'rotate(-4deg)', transformOrigin: 'center center' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1.0, ease: 'easeOut' }}
      >
        {/* Curly looping arrow pointing UP — tail at bottom, arrowhead at top */}
        <svg width="78" height="122" viewBox="0 0 78 122" fill="none" style={{ display: 'block', marginBottom: 5 }}>
          <path d="M 58 120 C 66 102, 62 88, 56 76 C 50 64, 38 67, 42 78 C 46 89, 60 87, 55 74 C 50 60, 36 46, 22 30 C 18 24, 12 16, 8 8" {...sw} />
          <path d="M 2 17 L 8 8 L 17 13" {...tip} />
        </svg>
        <span style={label}>selected projects</span>
      </motion.div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// ABOUT PAGE — full-screen about me overlay
// ─────────────────────────────────────────────────────────────────────────────
const AboutPage = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 40 }}
    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="fixed inset-0 z-[500] overflow-y-auto bg-[#fefcfa]"
  >
    <button
      onClick={onClose}
      className="fixed top-6 left-[90px] z-[600] flex items-center gap-2 bg-white border border-black/10 shadow-sm rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink/60 hover:text-ink hover:border-ink/30 transition-all duration-200 cursor-pointer"
    >
      ← Back
    </button>

    <div className="max-w-3xl mx-auto px-8 pt-24 pb-32">
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="flex flex-col md:flex-row gap-12 items-start mb-16"
      >
        {/* Polaroid photo */}
        <div className="flex-shrink-0">
          <div className="bg-white p-3 pb-10 shadow-md border border-gray-200/60" style={{ transform: 'rotate(-1.5deg)' }}>
            <img src="/mowa.jpeg" alt="Mowa Otun" className="w-52 h-64 object-cover object-center" draggable={false} />
            <p className="font-satoshi text-xs text-ink/40 text-center mt-3 italic">That's me ✦</p>
          </div>
        </div>
        {/* Bio */}
        <div className="flex-1 pt-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-plum/50 mb-3">About me</p>
          <h1 className="font-gelica text-4xl md:text-5xl text-ink font-semibold leading-tight mb-2">Mowa Otun</h1>
          <p className="font-satoshi text-lg text-ink/50 italic mb-6">Product & UX Designer</p>
          <p className="font-satoshi text-base text-ink leading-relaxed mb-4">
            I design digital products that feel like they were made for people — because they were. I care deeply about the space between what a product does and how it makes someone feel.
          </p>
          <p className="font-satoshi text-base text-ink leading-relaxed">
            With experience across health, fintech, and AI, I've learned that the best designs come from listening first and designing second. I'm based in Lagos, working globally.
          </p>
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-16"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-plum/50 mb-6">What I do</p>
        <div className="flex flex-wrap gap-3">
          {['UX Research', 'UI Design', 'Product Strategy', 'Design Systems', 'Interaction Design', 'Prototyping', 'User Testing', 'AI Products'].map((skill, i) => {
            const c = ['bg-white text-plum border-plum/30', 'bg-white text-rose border-rose/25', 'bg-white text-sky border-sky/30', 'bg-white text-plum/60 border-lilac/40'];
            return <span key={skill} className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 border rounded-full ${c[i % c.length]}`}>{skill}</span>;
          })}
        </div>
      </motion.div>

      {/* Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.6 }}
        className="mb-16"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-plum/50 mb-6">Tools I use</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Figma', desc: 'Design & prototyping', dot: '#F24E1E' },
            { name: 'Claude Code', desc: 'AI-assisted development', dot: '#541388' },
            { name: 'Adobe XD', desc: 'UX wireframing', dot: '#FF61F6' },
            { name: 'Photoshop', desc: 'Image editing & retouching', dot: '#31A8FF' },
            { name: 'Illustrator', desc: 'Vector & brand assets', dot: '#FF9A00' },
          ].map((tool) => (
            <div key={tool.name} className="bg-white border border-black/6 rounded-xl p-4 shadow-sm flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: tool.dot }} />
              <div>
                <p className="font-gelica text-sm font-semibold text-ink leading-tight">{tool.name}</p>
                <p className="font-satoshi text-xs text-ink/45 mt-0.5">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Connect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="bg-white p-8 rounded-2xl border border-black/6 shadow-sm"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-plum/50 mb-3">Say hello</p>
        <p className="font-gelica text-2xl text-ink italic mb-6">Open to collaborations & new projects.</p>
        <div className="flex flex-wrap gap-4">
          <a href="mailto:hello@mowa.design" className="font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 bg-ink text-white rounded-full hover:bg-plum transition-colors duration-200 cursor-pointer">Email me</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 border border-black/15 text-ink/60 rounded-full hover:text-ink hover:border-ink/30 transition-colors duration-200 cursor-pointer">LinkedIn</a>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

// PROJECTS OVERVIEW PAGE — lists all projects, leads into individual pages
// ─────────────────────────────────────────────────────────────────────────────
const WASHI_NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const ProjectsOverviewPage = ({ onClose, onSelectProject }: { onClose: () => void; onSelectProject: (key: string) => void }) => {
  const projects = Object.values(PROJECT_DATA);
  const washiColors = ['bg-rose', 'bg-sky', 'bg-lilac'];
  const cardRotations = [-1.5, 1, -0.5];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed inset-0 z-[500] overflow-y-auto bg-[#fefcfa]"
    >
      <button
        onClick={onClose}
        className="fixed top-6 left-6 z-[600] flex items-center gap-2 bg-white border border-black/10 shadow-sm rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink/60 hover:text-ink hover:border-ink/30 transition-all duration-200 cursor-pointer"
      >
        ← Back
      </button>

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-20 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/35 mb-3">Selected Work</p>
          <h1 className="font-gelica text-5xl md:text-6xl text-plum leading-tight">My Projects.</h1>
          <p className="font-satoshi text-base text-ink/50 mt-3 max-w-md mx-auto">Click any project to explore the full case study.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-20 items-start">
          {projects.map((p, i) => (
            <motion.button
              key={p.title}
              onClick={() => onSelectProject(p.title)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, rotate: 0, scale: 1.03, zIndex: 10, transition: { duration: 0.2 } }}
              className="text-left relative cursor-pointer group"
              style={{ transform: `rotate(${cardRotations[i]}deg)` }}
            >
              {/* Polaroid card */}
              <div className="bg-white p-3 pb-10 shadow-md border border-gray-200/60 relative">
                {/* Washi tape */}
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 opacity-70 shadow-sm z-10 ${washiColors[i]}`}
                  style={{ mixBlendMode: 'multiply', transform: 'rotate(-1.5deg)' }}
                >
                  <div className="w-full h-full opacity-20" style={{ backgroundImage: WASHI_NOISE }} />
                </div>

                {/* Image — consistent aspect ratio, full coverage */}
                <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-gelica text-3xl text-ink/20">{p.title.charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Polaroid caption */}
                <div className="mt-4 px-1">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.tags.slice(0, 2).map(t => (
                      <span key={t} className="font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 border border-ink/12 text-ink/35 rounded-sm">{t}</span>
                    ))}
                  </div>
                  <h2 className="font-gelica text-lg text-ink leading-snug">{p.title}</h2>
                  <p className="font-satoshi text-xs text-ink/50 italic mt-0.5">{p.subtitle}</p>
                </div>
              </div>

              <p className="font-mono text-[9px] uppercase tracking-widest text-ink/30 group-hover:text-rose transition-colors duration-200 text-center mt-3">
                Open Case Study →
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT PAGE — full-screen case study view
// ─────────────────────────────────────────────────────────────────────────────
const FoxProblemIllustration = () => (
  <img src="/mental-health.png" alt="Mental health stigma illustration" className="w-full block"/>
);

// ─────────────────────────────────────────────────────────────────────────────
const FoxSketchGrid = () => (
  <svg viewBox="0 0 560 268" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
    <rect width="560" height="268" fill="#f7f6f3" rx="8"/>
    <text x="280" y="22" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="8" fill="#999" letterSpacing="3">EARLY RESEARCH ARTIFACTS</text>
    {/* ── ROW 1 ── */}
    {/* Note 1: User Interviews */}
    <g transform="rotate(-2 130 88)">
      <rect x="60" y="38" width="140" height="97" rx="2" fill="#f5e878"/>
      <line x1="60" y1="54" x2="200" y2="54" stroke="#d4c840" strokeWidth="1"/>
      <text x="74" y="70" fontFamily="'Courier New',monospace" fontSize="7.5" fontWeight="700" fill="#555" letterSpacing="1">USER INTERVIEWS</text>
      <text x="74" y="84" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">19 conversations.</text>
      <text x="74" y="96" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">0 easy answers.</text>
      <text x="74" y="112" fontFamily="'Courier New',monospace" fontSize="6.5" fill="#999" fontStyle="italic">"I just don't talk about it"</text>
      <text x="74" y="123" fontFamily="'Courier New',monospace" fontSize="6.5" fill="#999" fontStyle="italic">— said 14 out of 19 times</text>
    </g>
    {/* Note 2: Journey Map */}
    <g transform="rotate(1.5 280 88)">
      <rect x="210" y="38" width="140" height="97" rx="2" fill="#c5e8f5"/>
      <line x1="210" y1="54" x2="350" y2="54" stroke="#88c8e0" strokeWidth="1"/>
      <text x="224" y="70" fontFamily="'Courier New',monospace" fontSize="7.5" fontWeight="700" fill="#555" letterSpacing="1">JOURNEY MAP</text>
      <text x="224" y="84" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">Where it goes wrong:</text>
      <text x="224" y="96" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">Step 1 → Step 2 →</text>
      <text x="224" y="108" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">Step 3 → give up</text>
      <text x="224" y="123" fontFamily="'Courier New',monospace" fontSize="6.5" fill="#999" fontStyle="italic">(every step, actually)</text>
    </g>
    {/* Note 3: Problem Statement */}
    <g transform="rotate(-1.5 430 88)">
      <rect x="360" y="38" width="140" height="97" rx="2" fill="#f0c8d0"/>
      <line x1="360" y1="54" x2="500" y2="54" stroke="#d89898" strokeWidth="1"/>
      <text x="374" y="70" fontFamily="'Courier New',monospace" fontSize="7.5" fontWeight="700" fill="#555" letterSpacing="1">THE PROBLEM</text>
      <text x="374" y="84" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">People need support.</text>
      <text x="374" y="96" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">Stigma says asking</text>
      <text x="374" y="108" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">= weakness.</text>
      <text x="374" y="123" fontFamily="'Courier New',monospace" fontSize="6.5" fill="#999" fontStyle="italic">So they just don't.</text>
    </g>
    {/* ── Connectors row 1 → row 2 ── */}
    <line x1="130" y1="136" x2="130" y2="152" stroke="#ccc" strokeWidth="1" strokeDasharray="3 2"/>
    <line x1="280" y1="136" x2="280" y2="152" stroke="#ccc" strokeWidth="1" strokeDasharray="3 2"/>
    <line x1="430" y1="136" x2="430" y2="152" stroke="#ccc" strokeWidth="1" strokeDasharray="3 2"/>
    {/* ── ROW 2 ── */}
    {/* Note 4: Affinity Map */}
    <g transform="rotate(2 130 200)">
      <rect x="60" y="152" width="140" height="90" rx="2" fill="#b8e8b0"/>
      <line x1="60" y1="166" x2="200" y2="166" stroke="#88c880" strokeWidth="1"/>
      <text x="74" y="182" fontFamily="'Courier New',monospace" fontSize="7.5" fontWeight="700" fill="#555" letterSpacing="1">AFFINITY MAP</text>
      <text x="74" y="196" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">Clusters found:</text>
      <text x="74" y="208" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">▸ Fear / Stigma</text>
      <text x="74" y="220" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">▸ Isolation</text>
      <text x="74" y="232" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">▸ "Not bad enough"</text>
    </g>
    {/* Note 5: Key Insight */}
    <g transform="rotate(-1.5 280 200)">
      <rect x="210" y="152" width="140" height="90" rx="2" fill="#f0d8b0"/>
      <line x1="210" y1="166" x2="350" y2="166" stroke="#d0a860" strokeWidth="1"/>
      <text x="224" y="182" fontFamily="'Courier New',monospace" fontSize="7.5" fontWeight="700" fill="#555" letterSpacing="1">KEY INSIGHT</text>
      <text x="224" y="196" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">Asking for help =</text>
      <text x="224" y="208" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">admitting weakness.</text>
      <text x="224" y="220" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">Design must remove</text>
      <text x="224" y="232" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">that friction entirely.</text>
    </g>
    {/* Note 6: Design Direction */}
    <g transform="rotate(1 430 200)">
      <rect x="360" y="152" width="140" height="90" rx="2" fill="#d8b8f0"/>
      <line x1="360" y1="166" x2="500" y2="166" stroke="#b090d0" strokeWidth="1"/>
      <text x="374" y="182" fontFamily="'Courier New',monospace" fontSize="7.5" fontWeight="700" fill="#555" letterSpacing="1">DIRECTION</text>
      <text x="374" y="196" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">Normalize. Don't</text>
      <text x="374" y="208" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">dramatize the pain.</text>
      <text x="374" y="220" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">Make help feel like</text>
      <text x="374" y="232" fontFamily="'Courier New',monospace" fontSize="7" fill="#777">a calm, safe choice.</text>
    </g>
    {/* Caption */}
    <text x="280" y="260" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7" fill="#aaa" letterSpacing="2">WHAT WE LEARNED BEFORE WE KNEW WHAT WE NEEDED TO LEARN</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
const FoxCopyShowcase = () => (
  <svg viewBox="0 0 560 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
    {/* Page background */}
    <rect width="560" height="300" fill="#f0faf8"/>
    {/* Nav bar */}
    <rect width="560" height="44" fill="#ffffff"/>
    <text x="24" y="27" fontFamily="'Courier New',monospace" fontSize="11" fontWeight="700" fill="#009e8e">FoxHolisticCare</text>
    <text x="210" y="27" fontFamily="sans-serif" fontSize="9" fill="#555">Telemedicine</text>
    <text x="280" y="27" fontFamily="sans-serif" fontSize="9" fill="#555">Forms</text>
    <text x="328" y="27" fontFamily="sans-serif" fontSize="9" fill="#555">Payments</text>
    <text x="378" y="27" fontFamily="sans-serif" fontSize="9" fill="#555">About Us</text>
    <text x="425" y="27" fontFamily="sans-serif" fontSize="9" fill="#555">Contact</text>
    <rect x="470" y="14" width="72" height="18" rx="9" fill="#009e8e"/>
    <text x="506" y="26" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="600" fill="white">Book Appt →</text>
    {/* Sparkle stars on nav */}
    <text x="195" y="30" fontSize="10" fill="#009e8e">✦</text>
    <text x="260" y="32" fontSize="8" fill="#b2e0da">✦</text>
    <text x="460" y="28" fontSize="7" fill="#009e8e">✦</text>
    {/* Hero section */}
    <rect x="0" y="44" width="560" height="200" fill="#f0faf8"/>
    {/* Left content */}
    <text x="36" y="90" fontFamily="sans-serif" fontSize="22" fontWeight="700" fill="#0d3d36">Your Path to</text>
    <text x="36" y="116" fontFamily="sans-serif" fontSize="22" fontWeight="700" fill="#0d3d36">Holistic</text>
    <text x="36" y="142" fontFamily="sans-serif" fontSize="22" fontWeight="700" fill="#0d3d36">Mental Wellness</text>
    <text x="36" y="164" fontFamily="sans-serif" fontSize="9" fill="#555" letterSpacing="0.3">From therapy and counseling to mindfulness practices and</text>
    <text x="36" y="177" fontFamily="sans-serif" fontSize="9" fill="#555" letterSpacing="0.3">nutritional guidance, we offer a range of services tailored</text>
    <text x="36" y="190" fontFamily="sans-serif" fontSize="9" fill="#555" letterSpacing="0.3">to your unique needs.</text>
    {/* CTA buttons */}
    <rect x="36" y="202" width="110" height="22" rx="11" fill="#009e8e"/>
    <text x="91" y="216" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="600" fill="white">Book an Appointment →</text>
    <rect x="154" y="202" width="90" height="22" rx="11" fill="none" stroke="#009e8e" strokeWidth="1.5"/>
    <text x="199" y="216" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill="#009e8e">Fill Medical Form</text>
    {/* Affirmative word tags floating */}
    <rect x="290" y="68" width="52" height="18" rx="9" fill="#d4f0ec" stroke="#009e8e" strokeWidth="1"/>
    <text x="316" y="80" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="600" fill="#006e61">• RELAX</text>
    <rect x="360" y="95" width="56" height="18" rx="9" fill="#d4f0ec" stroke="#009e8e" strokeWidth="1"/>
    <text x="388" y="107" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="600" fill="#006e61">• BREATHE</text>
    <rect x="300" y="145" width="64" height="18" rx="9" fill="#d4f0ec" stroke="#009e8e" strokeWidth="1"/>
    <text x="332" y="157" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="600" fill="#006e61">• BE CALM</text>
    <rect x="370" y="175" width="96" height="18" rx="9" fill="#d4f0ec" stroke="#009e8e" strokeWidth="1"/>
    <text x="418" y="187" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="600" fill="#006e61">• WE ARE HERE FOR YOU</text>
    {/* Sparkle accents */}
    <text x="350" y="88" fontSize="12" fill="#009e8e">✦</text>
    <text x="480" y="130" fontSize="10" fill="#b2e0da">✦</text>
    <text x="295" y="130" fontSize="9" fill="#009e8e">✦</text>
    {/* Person image placeholder */}
    <rect x="430" y="62" width="104" height="120" rx="8" fill="#a8dcd5"/>
    <ellipse cx="482" cy="100" rx="22" ry="22" fill="#7cc9be"/>
    <rect x="458" y="126" width="48" height="56" rx="6" fill="#6bbfb4"/>
    {/* Footer strip */}
    <rect x="0" y="244" width="560" height="56" fill="#ffffff"/>
    <text x="36" y="268" fontFamily="sans-serif" fontSize="8" fill="#888">Affirmative language as a design layer — every word chosen to reduce anxiety and build trust</text>
    <text x="36" y="284" fontFamily="sans-serif" fontSize="8" fill="#aaa">FoxHolisticCare © 2024 · Built with intentional care for mental wellness</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
const BuildAfricaProblemIllustration = () => (
  <svg viewBox="0 0 560 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
    <rect width="560" height="260" fill="#f5f5f5" rx="8"/>
    <text x="280" y="22" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="8" fill="#999" letterSpacing="3">HOW CONSTRUCTION BUDGETS USED TO GET MADE</text>
    {/* ── FULL WIDTH: The Old Way ── */}
    <rect x="22" y="34" width="516" height="196" rx="6" fill="#ececec"/>
    <text x="280" y="56" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="8.5" fontWeight="700" fill="#666" letterSpacing="1.5">THE OLD WAY</text>
    {/* Laptop with spreadsheet — centered left */}
    <rect x="140" y="66" width="100" height="66" rx="4" fill="#d8d8d8"/>
    <rect x="145" y="71" width="90" height="56" rx="2" fill="#c8c8c8"/>
    <line x1="145" y1="81" x2="235" y2="81" stroke="#b8b8b8" strokeWidth="1"/>
    <line x1="145" y1="91" x2="235" y2="91" stroke="#b8b8b8" strokeWidth="1"/>
    <line x1="145" y1="101" x2="235" y2="101" stroke="#b8b8b8" strokeWidth="1"/>
    <line x1="145" y1="111" x2="235" y2="111" stroke="#b8b8b8" strokeWidth="1"/>
    <line x1="169" y1="71" x2="169" y2="127" stroke="#b8b8b8" strokeWidth="1"/>
    <line x1="199" y1="71" x2="199" y2="127" stroke="#b8b8b8" strokeWidth="1"/>
    <text x="190" y="142" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="6.5" fill="#999">BUDGET_FINAL_v7.xlsx</text>
    {/* Stacked quote papers */}
    <rect x="312" y="76" width="52" height="62" rx="1" fill="#e2e2e2" transform="rotate(-6 338 107)"/>
    <rect x="316" y="80" width="52" height="62" rx="1" fill="#d8d8d8" transform="rotate(-2 342 111)"/>
    <rect x="320" y="84" width="52" height="62" rx="1" fill="#d0d0d0"/>
    <text x="346" y="106" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="5.5" fill="#aaa">quote1.pdf</text>
    <text x="346" y="116" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="5.5" fill="#aaa">quote2.pdf</text>
    <text x="346" y="126" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="5.5" fill="#aaa">final_FINAL.pdf</text>
    {/* Calendar of doom */}
    <rect x="390" y="76" width="72" height="66" rx="2" fill="#e0e0e0"/>
    <line x1="390" y1="90" x2="462" y2="90" stroke="#ccc" strokeWidth="1"/>
    <text x="426" y="87" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="6" fill="#888">6 WEEKS</text>
    <text x="405" y="104" fontFamily="'Courier New',monospace" fontSize="9" fill="#999">✗ ✗ ✗</text>
    <text x="405" y="118" fontFamily="'Courier New',monospace" fontSize="9" fill="#999">✗ ✗ ✗</text>
    <text x="405" y="132" fontFamily="'Courier New',monospace" fontSize="9" fill="#aaa">✗ ✗ ?</text>
    {/* "this is fine" speech bubble */}
    <rect x="110" y="66" width="76" height="20" rx="4" fill="white" fillOpacity="0.85"/>
    <text x="148" y="80" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7" fill="#888">"this is fine" 🔥</text>
    {/* Stats row */}
    <text x="280" y="176" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="9" fontWeight="700" fill="#888">6 WEEKS · 3 SPECIALISTS · STILL WRONG 30% OF THE TIME</text>
    {/* Gap annotation */}
    <rect x="60" y="192" width="440" height="26" rx="4" fill="#e0e0e0"/>
    <text x="280" y="209" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7.5" fill="#888">By the time the estimate arrived, inflation had already shifted the numbers.</text>
    {/* Caption */}
    <text x="280" y="248" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7" fill="#aaa" letterSpacing="2">SOURCE: 200+ CONTRACTORS &amp; ARCHITECTS SURVEYED</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
const BuildAfricaCostIllustration = () => (
  <svg viewBox="0 0 560 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
    {/* Background */}
    <rect width="560" height="340" fill="#f0f4f0" rx="10"/>
    {/* Header label */}
    <text x="280" y="22" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7.5" fill="#7a9e7a" letterSpacing="3">AI COST ESTIMATION · RESULTS SCREEN</text>

    {/* Screen frame */}
    <rect x="60" y="34" width="440" height="270" rx="12" fill="white" stroke="#d0ddd0" strokeWidth="1.5"/>
    {/* Screen top bar */}
    <rect x="60" y="34" width="440" height="32" rx="12" fill="#1a3c2a"/>
    <rect x="60" y="52" width="440" height="14" fill="#1a3c2a"/>
    <circle cx="82" cy="50" r="5" fill="#ff5f56"/>
    <circle cx="97" cy="50" r="5" fill="#ffbd2e"/>
    <circle cx="112" cy="50" r="5" fill="#27c93f"/>
    <text x="280" y="54" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="8" fill="#7aad8a" letterSpacing="1">BUILD AFRICA AI — COST ESTIMATE</text>

    {/* Project summary row */}
    <rect x="76" y="78" width="408" height="28" rx="6" fill="#f0f7f2"/>
    <text x="92" y="96" fontFamily="'Courier New',monospace" fontSize="7.5" fill="#2d6a4f" fontWeight="700">3-BED BUNGALOW · LAGOS</text>
    <text x="420" y="96" textAnchor="end" fontFamily="'Courier New',monospace" fontSize="7.5" fill="#52b788">GENERATED IN 0.8s ⚡</text>

    {/* Section header: Materials */}
    <text x="92" y="120" fontFamily="'Courier New',monospace" fontSize="7" fill="#999" letterSpacing="2">MATERIAL BREAKDOWN</text>
    <line x1="92" y1="124" x2="468" y2="124" stroke="#e8ede8" strokeWidth="1"/>

    {/* Line items */}
    {/* Concrete & Blocks */}
    <rect x="76" y="128" width="408" height="22" rx="3" fill="#f9fcf9"/>
    <text x="92" y="143" fontFamily="'Courier New',monospace" fontSize="8" fill="#3a5c3a">Concrete &amp; Blocks</text>
    <rect x="300" y="132" width="100" height="10" rx="2" fill="#d8f0e0"/>
    <rect x="300" y="132" width="82" height="10" rx="2" fill="#52b788"/>
    <text x="410" y="143" fontFamily="'Courier New',monospace" fontSize="8" fill="#2d6a4f" fontWeight="700">₦ 4,280,000</text>

    {/* Steel & Iron */}
    <rect x="76" y="152" width="408" height="22" rx="3" fill="#f9fcf9"/>
    <text x="92" y="167" fontFamily="'Courier New',monospace" fontSize="8" fill="#3a5c3a">Steel &amp; Reinforcement</text>
    <rect x="300" y="156" width="100" height="10" rx="2" fill="#d8f0e0"/>
    <rect x="300" y="156" width="65" height="10" rx="2" fill="#52b788"/>
    <text x="410" y="167" fontFamily="'Courier New',monospace" fontSize="8" fill="#2d6a4f" fontWeight="700">₦ 3,100,000</text>

    {/* Roofing */}
    <rect x="76" y="176" width="408" height="22" rx="3" fill="#f9fcf9"/>
    <text x="92" y="191" fontFamily="'Courier New',monospace" fontSize="8" fill="#3a5c3a">Roofing &amp; Tiling</text>
    <rect x="300" y="180" width="100" height="10" rx="2" fill="#d8f0e0"/>
    <rect x="300" y="180" width="50" height="10" rx="2" fill="#74c69d"/>
    <text x="410" y="191" fontFamily="'Courier New',monospace" fontSize="8" fill="#2d6a4f" fontWeight="700">₦ 2,450,000</text>

    {/* Finishing */}
    <rect x="76" y="200" width="408" height="22" rx="3" fill="#f9fcf9"/>
    <text x="92" y="215" fontFamily="'Courier New',monospace" fontSize="8" fill="#3a5c3a">Finishing &amp; Paint</text>
    <rect x="300" y="204" width="100" height="10" rx="2" fill="#d8f0e0"/>
    <rect x="300" y="204" width="38" height="10" rx="2" fill="#95d5b2"/>
    <text x="410" y="215" fontFamily="'Courier New',monospace" fontSize="8" fill="#2d6a4f" fontWeight="700">₦ 1,800,000</text>

    {/* Inflation badge */}
    <rect x="76" y="228" width="260" height="22" rx="5" fill="#fff8e1"/>
    <text x="88" y="243" fontFamily="'Courier New',monospace" fontSize="7" fill="#c77800">📈 INFLATION WINDOW: +8.2% PROJECTED OVER 6 MONTHS</text>

    {/* Divider */}
    <line x1="76" y1="256" x2="484" y2="256" stroke="#d0ddd0" strokeWidth="1"/>

    {/* Total */}
    <rect x="76" y="260" width="408" height="30" rx="6" fill="#1a3c2a"/>
    <text x="92" y="280" fontFamily="'Courier New',monospace" fontSize="9" fill="#7aad8a" letterSpacing="1">TOTAL ESTIMATE</text>
    <text x="472" y="280" textAnchor="end" fontFamily="'Courier New',monospace" fontSize="12" fontWeight="700" fill="white">₦ 11,630,000</text>

    {/* ── Callout 1: Real-time pricing ── */}
    <line x1="234" y1="160" x2="180" y2="316" stroke="#e63946" strokeWidth="1" strokeDasharray="3 2"/>
    <rect x="60" y="310" width="150" height="24" rx="5" fill="#e63946"/>
    <text x="135" y="326" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7" fill="white">REAL-TIME MARKET PRICING</text>

    {/* ── Callout 2: Inflation window ── */}
    <line x1="206" y1="239" x2="310" y2="316" stroke="#f4a261" strokeWidth="1" strokeDasharray="3 2"/>
    <rect x="256" y="310" width="140" height="24" rx="5" fill="#f4a261"/>
    <text x="326" y="326" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7" fill="white">INFLATION PREDICTION</text>

    {/* ── Callout 3: Total breakdown ── */}
    <line x1="420" y1="275" x2="460" y2="316" stroke="#52b788" strokeWidth="1" strokeDasharray="3 2"/>
    <rect x="396" y="310" width="104" height="24" rx="5" fill="#52b788"/>
    <text x="448" y="326" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7" fill="white">TOTAL BREAKDOWN</text>

    {/* Footer caption */}
    <text x="280" y="334" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="6.5" fill="#aaa" letterSpacing="2">INSTANT · ACCURATE · INFLATION-ADJUSTED</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
const SheProblemIllustration = () => (
  <svg viewBox="0 0 560 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
    <rect width="560" height="300" fill="#f0f0f8" rx="10"/>
    <text x="280" y="22" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7.5" fill="#9090bb" letterSpacing="3">WHY THE OLD SITE WASN'T CONVERTING</text>

    {/* Left circle — what users needed */}
    <circle cx="193" cy="155" r="118" stroke="#aaaadd" strokeWidth="1.2" strokeDasharray="4 3" fill="#e8e8f5" fillOpacity="0.5"/>
    {/* Right circle — what they got */}
    <circle cx="367" cy="155" r="118" stroke="#aaaadd" strokeWidth="1.2" strokeDasharray="4 3" fill="#e8e8f5" fillOpacity="0.5"/>

    {/* Circle labels */}
    <text x="128" y="50" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7" fill="#8888bb" letterSpacing="2">WHAT USERS NEEDED</text>
    <text x="432" y="50" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7" fill="#8888bb" letterSpacing="2">WHAT THEY GOT</text>

    {/* Left icons — desired experience */}
    <text x="108" y="133" fontSize="38" textAnchor="middle">🛍️</text>
    <text x="108" y="156" fontFamily="'Courier New',monospace" fontSize="6" fill="#9090bb" textAnchor="middle" letterSpacing="1">BROWSE FREELY</text>
    <text x="96" y="203" fontSize="38" textAnchor="middle">💳</text>
    <text x="96" y="225" fontFamily="'Courier New',monospace" fontSize="6" fill="#9090bb" textAnchor="middle" letterSpacing="1">EASY CHECKOUT</text>

    {/* Right icons — what they actually encountered */}
    <text x="442" y="126" fontSize="38" textAnchor="middle">😵</text>
    <text x="442" y="148" fontFamily="'Courier New',monospace" fontSize="6" fill="#9090bb" textAnchor="middle" letterSpacing="1">CONFUSING LAYOUT</text>
    <text x="458" y="203" fontSize="38" textAnchor="middle">🔄</text>
    <text x="458" y="225" fontFamily="'Courier New',monospace" fontSize="6" fill="#9090bb" textAnchor="middle" letterSpacing="1">REPEATED CONTENT</text>

    {/* Intersection — the gap */}
    <text x="280" y="162" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="30" fill="#9090bb">?</text>

    {/* Caption */}
    <text x="280" y="282" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="6.5" fill="#aaaacc" letterSpacing="2">SOURCE: UX AUDIT · SHE PLATFORM · INDIRECT RESEARCH</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
const SheUXFindingsIllustration = () => (
  <svg viewBox="0 0 560 330" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
    <rect width="560" height="330" fill="#f0f0f8" rx="10"/>

    {/* Top wide card */}
    <rect x="155" y="28" width="250" height="72" rx="8" fill="#e2e2f0"/>
    <text x="280" y="68" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="9" fill="#8080bb" letterSpacing="1.5">NO CLEAR STARTING POINT</text>

    {/* Middle 2 cards */}
    <rect x="28" y="116" width="238" height="82" rx="8" fill="#e2e2f0"/>
    <text x="147" y="152" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="8" fill="#8080bb" letterSpacing="1">REPEATED</text>
    <text x="147" y="167" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="8" fill="#8080bb" letterSpacing="1">INFORMATION</text>

    <rect x="294" y="116" width="238" height="82" rx="8" fill="#e2e2f0"/>
    <text x="413" y="152" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="8" fill="#8080bb" letterSpacing="1">MISSING</text>
    <text x="413" y="167" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="8" fill="#8080bb" letterSpacing="1">CALLS-TO-ACTION</text>

    {/* Bottom 3 cards */}
    <rect x="28" y="214" width="158" height="72" rx="8" fill="#e2e2f0"/>
    <text x="107" y="250" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7.5" fill="#8080bb" letterSpacing="1">SCATTERED</text>
    <text x="107" y="264" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7.5" fill="#8080bb" letterSpacing="1">LAYOUT</text>

    <rect x="201" y="214" width="158" height="72" rx="8" fill="#e2e2f0"/>
    <text x="280" y="250" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7.5" fill="#8080bb" letterSpacing="1">HIDDEN</text>
    <text x="280" y="264" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7.5" fill="#8080bb" letterSpacing="1">CART</text>

    <rect x="374" y="214" width="158" height="72" rx="8" fill="#e2e2f0"/>
    <text x="453" y="250" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7.5" fill="#8080bb" letterSpacing="1">WEAK</text>
    <text x="453" y="264" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7.5" fill="#8080bb" letterSpacing="1">HIERARCHY</text>

    {/* Caption */}
    <text x="280" y="318" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="7" fill="#aaaacc" letterSpacing="3">THE FRICTION POINTS</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
const ProjectPage = ({ projectKey, onClose, onOpenProject }: { projectKey: string; onClose: () => void; onOpenProject: (key: string) => void }) => {
  const p = PROJECT_DATA[projectKey];
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const sectionRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      setShowScrollTop(el.scrollTop > 400);
      // Track which section is in view
      const sections = Object.entries(sectionRefs.current);
      for (const [id, ref] of sections) {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const scrollToTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollToSection = (sectionId: string) => {
    const ref = sectionRefs.current[sectionId];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // Get h2 sections for sidebar navigation
  const h2Sections = p.sections
    .map((section, i) => ({
      id: `section-${i}`,
      label: section.type === 'h2' ? section.heading : null,
      sectionLabel: section.type === 'h2' ? section.sectionLabel : null,
    }))
    .filter(s => s.label !== null);

  if (!p) return null;

  const otherProjects = Object.keys(PROJECT_DATA).filter(k => k !== projectKey);

  return (
    <motion.div
      ref={scrollRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed inset-0 z-[500] overflow-y-auto bg-[#fefcfa]"
    >
      {/* Back to projects overview */}
      <button
        onClick={onClose}
        className="fixed top-6 left-6 lg:left-[90px] z-[600] flex items-center gap-2 bg-white border border-black/10 shadow-sm rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink/60 hover:text-ink hover:border-ink/30 transition-all duration-200 cursor-pointer"
      >
        ← All Projects
      </button>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[600] w-11 h-11 rounded-full bg-white border border-black/10 shadow-md flex items-center justify-center text-ink/50 hover:text-ink hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 12V4M4 8l4-4 4 4"/>
          </svg>
        </button>
      )}

      {/* Left Sidebar — Desktop only, editorial line-indicator style */}
      <div className="hidden lg:block fixed left-[90px] top-6 w-44 max-h-[calc(100vh-2rem)] overflow-y-auto z-[450]">
        {h2Sections.length > 0 && (
          <div className="pt-1 mt-14">
            <p className="font-gelica text-[10px] italic text-ink/30 mb-4 pl-1">In this study</p>
            <nav>
              {h2Sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`group flex items-center gap-3 w-full text-left py-2 transition-all duration-200 ${
                    activeSection === section.id ? 'text-plum' : 'text-ink/35 hover:text-ink/65'
                  }`}
                >
                  <span className={`flex-shrink-0 h-px rounded-full transition-all duration-300 ${
                    activeSection === section.id
                      ? 'w-6 bg-plum'
                      : 'w-3 bg-ink/20 group-hover:w-5 group-hover:bg-ink/40'
                  }`} />
                  <span className={`font-gelica text-[12px] leading-tight ${activeSection === section.id ? 'font-medium' : ''}`}>
                    {section.sectionLabel}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

        {/* Main Content — centered on page */}
        <div className="w-full">

          <div className="max-w-2xl mx-auto px-8 pt-20 pb-32">

        {/* ── Case study header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-14"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-7">
            {p.tags.map((tag, idx) => {
              const fills = [
                'bg-white text-plum border-plum/30',
                'bg-white text-rose border-rose/25',
                'bg-white text-sky border-sky/30',
                'bg-white text-plum/60 border-lilac/40',
              ];
              return (
                <span key={tag} className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1 border rounded-full ${fills[idx % fills.length]}`}>{tag}</span>
              );
            })}
          </div>

          <h1 className="font-gelica text-5xl md:text-6xl text-ink font-semibold leading-tight mb-3">{p.title}</h1>
          <p className="font-satoshi text-xl text-ink/50 italic mb-8">{p.subtitle}</p>

          {/* Meta row */}
          <div className="flex flex-wrap gap-10 pt-8 border-t border-black/8">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-ink/35 mb-1">Role</p>
              <p className="font-satoshi text-sm text-ink">{p.role}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-ink/35 mb-1">Duration</p>
              <p className="font-satoshi text-sm text-ink">{p.duration}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Case study sections ── */}
        {p.sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.04, duration: 0.55 }}
            className="mb-12"
          >
            {/* ASSET — Fox video assets: device frame */}
            {section.type === 'asset' && section.image && (section.label === 'Interaction Demo' || section.label === 'Booking Demo') && projectKey === 'Fox Holistic Care' && (
              <div className="w-full border border-ink/8 flex flex-col items-center py-10 px-8" style={{ background: '#e8f5f3' }}>
                <div className="w-full max-w-sm border-2 border-ink/12 rounded-2xl overflow-hidden shadow-md">
                  <video src={section.image} className="w-full h-auto rounded-2xl" controls autoPlay loop muted playsInline />
                </div>
                {section.desc && (
                  <p className="font-satoshi text-xs text-ink/40 text-center mt-5 italic max-w-xs leading-relaxed">{section.desc}</p>
                )}
              </div>
            )}

            {/* ASSET — device frame image (Fox Strategy Visualization) */}
            {section.type === 'asset' && section.image && section.label === '🎨 Strategy Visualization' && projectKey === 'Fox Holistic Care' && (
              <div className="w-full bg-white border border-ink/8 flex flex-col items-center py-10 px-8">
                <div className="w-full max-w-sm border-2 border-ink/12 rounded-2xl overflow-hidden shadow-md">
                  <img src={section.image} alt={section.label} className="w-full h-auto object-cover rounded-2xl" draggable={false} />
                </div>
                {section.desc && (
                  <p className="font-satoshi text-xs text-ink/40 text-center mt-5 italic max-w-xs leading-relaxed">{section.desc}</p>
                )}
              </div>
            )}

            {/* ASSET — Fox Component Closeup: centered, small, no tape */}
            {section.type === 'asset' && section.image && section.label === 'Component Closeup' && projectKey === 'Fox Holistic Care' && (
              <div className="w-full bg-white border border-ink/8 flex flex-col items-center py-10 px-8">
                <img src={section.image} alt={section.label} className="w-full max-w-md h-auto object-contain" draggable={false} />
                {section.desc && (
                  <p className="font-satoshi text-xs text-ink/40 text-center mt-5 italic max-w-xs leading-relaxed">{section.desc}</p>
                )}
              </div>
            )}

            {/* ASSET — Build Africa AI Cost Estimation — grey device frame */}
            {section.type === 'asset' && section.label === 'Cost Estimation Screen' && projectKey === 'Build Africa AI' && (
              <div className="w-full flex flex-col items-center py-10 px-8" style={{ background: '#0d0d0d' }}>
                <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img src={section.image} alt={section.label} className="w-full h-auto object-cover" draggable={false} />
                </div>
                {section.desc && (
                  <p className="font-satoshi text-xs text-white/40 text-center mt-5 italic max-w-xs leading-relaxed">{section.desc}</p>
                )}
              </div>
            )}

            {/* ASSET — Build Africa AI screen shots — dark device frame */}
            {section.type === 'asset' && section.image && (section.label === '🎨 Strategy Architecture' || section.label === 'Interaction Demo') && projectKey === 'Build Africa AI' && (
              <div className="w-full flex flex-col items-center py-10 px-8" style={{ background: '#232323' }}>
                <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img src={section.image} alt={section.label} className="w-full h-auto object-cover" draggable={false} />
                </div>
                {section.desc && (
                  <p className="font-satoshi text-xs text-white/60 text-center mt-5 italic max-w-xs leading-relaxed">{section.desc}</p>
                )}
              </div>
            )}

            {/* ASSET — She device frame: layout + sidebar cart */}
            {section.type === 'asset' && section.image && (section.label === '🎨 New Layout Strategy' || section.label === 'Sidebar Cart Experience') && projectKey === 'She' && (
              <div className="w-full flex flex-col items-center py-10 px-8" style={{ background: '#fdf6f8' }}>
                <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-md border-2 border-[#e8d0d8]">
                  <img src={section.image} alt={section.label} className="w-full h-auto object-cover" draggable={false} />
                </div>
                {section.desc && (
                  <p className="font-satoshi text-xs text-ink/45 text-center mt-5 italic max-w-xs leading-relaxed">{section.desc}</p>
                )}
              </div>
            )}

            {/* ASSET — with image: polaroid frame */}
            {section.type === 'asset' && section.image && !(section.label === '🎨 Strategy Visualization' && projectKey === 'Fox Holistic Care') && !(section.label === 'Component Closeup' && projectKey === 'Fox Holistic Care') && !((section.label === 'Interaction Demo' || section.label === 'Booking Demo') && projectKey === 'Fox Holistic Care') &&
              !(section.label === 'BOQ Before After' && projectKey === 'Build Africa AI') &&
              !(section.label === 'Cost Estimation Screen' && projectKey === 'Build Africa AI') &&
              !((section.label === '🎨 Strategy Architecture' || section.label === 'Interaction Demo') && projectKey === 'Build Africa AI') &&
              !((section.label === 'Sketch / Exploration Grid' || section.label === 'Iteration Collage') && projectKey === 'Build Africa AI') &&
              !(section.label === 'Hero Video' && projectKey === 'Build Africa AI') &&
              !(section.label === 'Final Product Showcase' && projectKey === 'Build Africa AI') &&
              !((section.label === '🎨 New Layout Strategy' || section.label === 'Sidebar Cart Experience') && projectKey === 'She') && (
              <div className="bg-white p-3 pb-8 shadow-sm border border-gray-200/60 relative">
                {/* Washi tape pin */}
                <div
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-5 bg-rose opacity-60 z-10"
                  style={{ mixBlendMode: 'multiply', transform: 'translateX(-50%) rotate(-1deg)' }}
                >
                  <div className="w-full h-full opacity-20" style={{ backgroundImage: WASHI_NOISE }} />
                </div>
                <img src={section.image} alt={section.label} className="w-full h-auto object-cover" />
                {section.desc && (
                  <p className="font-satoshi text-xs text-ink/40 text-center mt-4 italic px-2">{section.desc}</p>
                )}
              </div>
            )}

            {/* ASSET — Fox Problem Illustration */}
            {section.type === 'asset' && !section.image && section.label === '💡 Problem Illustration' && projectKey === 'Fox Holistic Care' && (
              <div className="w-full bg-white border border-ink/8 overflow-hidden rounded-sm">
                <FoxProblemIllustration />
              </div>
            )}

            {/* ASSET — Fox Sketch/Exploration Grid */}
            {section.type === 'asset' && !section.image && section.label === 'Sketch / Exploration Grid' && projectKey === 'Fox Holistic Care' && (
              <div className="w-full bg-white border border-ink/8 overflow-hidden rounded-sm">
                <FoxSketchGrid />
              </div>
            )}

            {/* ASSET — Fox Copy Showcase (Process section) */}
            {section.type === 'asset' && !section.image && section.label === 'Fox Copy Showcase' && projectKey === 'Fox Holistic Care' && (
              <div className="w-full border border-ink/8 overflow-hidden rounded-sm">
                <FoxCopyShowcase />
              </div>
            )}

            {/* ASSET — Build Africa AI Problem Illustration */}
            {section.type === 'asset' && !section.image && section.label === '💡 Problem Illustration' && projectKey === 'Build Africa AI' && (
              <div className="w-full bg-white border border-ink/8 overflow-hidden rounded-sm">
                <BuildAfricaProblemIllustration />
              </div>
            )}

            {/* ASSET — Build Africa AI two-image grid: Sketch/Exploration Grid + Iteration Collage */}
            {section.type === 'asset' && section.image && (section.label === 'Sketch / Exploration Grid' || section.label === 'Iteration Collage') && projectKey === 'Build Africa AI' && (
              <div className="w-full bg-[#f5f4f0] border border-ink/8 flex flex-col gap-4 py-8 px-6">
                {section.label === 'Iteration Collage' && (
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/40 text-center">Before → After</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="rounded-xl overflow-hidden shadow-sm border border-ink/8">
                      <img src={section.image} alt={section.label + ' A'} className="w-full h-auto object-cover" draggable={false} />
                    </div>
                    {section.label === 'Iteration Collage' && (
                      <p className="font-mono text-[8px] text-ink/40 text-center tracking-wide">INITIAL VERSION</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="rounded-xl overflow-hidden shadow-sm border border-ink/8">
                      <img src={(section as any).image2} alt={section.label + ' B'} className="w-full h-auto object-cover" draggable={false} />
                    </div>
                    {section.label === 'Iteration Collage' && (
                      <p className="font-mono text-[8px] text-ink/40 text-center tracking-wide">FINAL VERSION</p>
                    )}
                  </div>
                </div>
                {section.desc && (
                  <p className="font-satoshi text-xs text-ink/40 text-center italic leading-relaxed">{section.desc}</p>
                )}
              </div>
            )}

            {/* ASSET — Build Africa AI Final Product Showcase */}
            {section.type === 'asset' && section.image && section.label === 'Final Product Showcase' && projectKey === 'Build Africa AI' && (
              <div className="w-full flex flex-col items-center py-10 px-8" style={{ background: '#111c14' }}>
                <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img src={section.image} alt="Build Africa AI Mockup" className="w-full h-auto object-cover" draggable={false} />
                </div>
                {section.desc && (
                  <p className="font-satoshi text-xs text-white/40 text-center mt-5 italic max-w-xs leading-relaxed">{section.desc}</p>
                )}
              </div>
            )}

            {/* ASSET — Build Africa AI Hero Video — phone mockup */}
            {section.type === 'asset' && section.image && section.label === 'Hero Video' && projectKey === 'Build Africa AI' && (
              <div className="w-full flex flex-col items-center py-12 px-8" style={{ background: '#111c14' }}>
                <div className="w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <img src={section.image} alt="Build Africa AI on mobile" className="w-full h-auto object-cover" draggable={false} />
                </div>
                {section.desc && (
                  <p className="font-satoshi text-xs text-white/50 text-center mt-5 italic max-w-xs leading-relaxed">{section.desc}</p>
                )}
              </div>
            )}

            {/* ASSET — Build Africa AI BOQ image — device frame centred */}
            {section.type === 'asset' && section.image && section.label === 'BOQ Before After' && projectKey === 'Build Africa AI' && (
              <div className="w-full bg-white border border-ink/8 flex flex-col items-center py-10 px-8">
                <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-md border-2 border-ink/12">
                  <img src={section.image} alt="Old BOQ" className="w-full h-auto object-cover" draggable={false} />
                </div>
                <div className="mt-4 w-full max-w-lg px-4 py-3 bg-red-50 rounded-xl border border-red-100">
                  <p className="font-mono text-[9px] text-red-400 leading-relaxed">⚠ Manual Excel BOQ · 6-week turnaround · 3 specialists · 30% error rate · stale by delivery</p>
                </div>
              </div>
            )}

            {/* ASSET — She Problem Visualization */}
            {section.type === 'asset' && !section.image && section.label === '💡 Problem Visualization' && projectKey === 'She' && (
              <div className="w-full bg-[#f0f0f8] border border-ink/8 overflow-hidden rounded-sm">
                <SheProblemIllustration />
              </div>
            )}

            {/* ASSET — She UX Review Findings */}
            {section.type === 'asset' && !section.image && section.label === 'UX Review Findings' && projectKey === 'She' && (
              <div className="w-full bg-[#f0f0f8] border border-ink/8 overflow-hidden rounded-sm">
                <SheUXFindingsIllustration />
              </div>
            )}

            {/* ASSET — no image: minimal placeholder */}
            {section.type === 'asset' && !section.image &&
              !(section.label === '💡 Problem Illustration' && projectKey === 'Fox Holistic Care') &&
              !(section.label === 'Sketch / Exploration Grid' && projectKey === 'Fox Holistic Care') &&
              !(section.label === 'Fox Copy Showcase' && projectKey === 'Fox Holistic Care') &&
              !(section.label === '💡 Problem Illustration' && projectKey === 'Build Africa AI') &&
              !(section.label === '💡 Problem Visualization' && projectKey === 'She') &&
              !(section.label === 'UX Review Findings' && projectKey === 'She') && (
              <div className="w-full flex flex-col items-center justify-center gap-3 py-12 px-8 bg-white border border-dashed border-ink/12">
                <span className="font-mono text-[9px] uppercase tracking-widest px-3 py-1 border border-ink/15 text-ink/35 rounded-full">
                  {section.label}
                </span>
                <p className="font-satoshi text-sm text-ink/35 text-center max-w-sm leading-relaxed italic">{section.desc}</p>
              </div>
            )}

            {/* H2 */}
            {section.type === 'h2' && (
              <div
                ref={(el) => {
                  if (el) sectionRefs.current[`section-${i}`] = el;
                }}
                id={`section-${i}`}
              >
                {section.sectionLabel && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-plum/50 mb-2">{section.sectionLabel}</p>
                )}
                <h2 className="font-gelica text-2xl md:text-3xl text-ink leading-snug mb-4">{section.heading}</h2>
                <p className="font-satoshi text-base text-ink leading-relaxed">{section.body}</p>
              </div>
            )}

            {/* H3 LIST */}
            {section.type === 'h3-list' && (
              <div>
                <h3 className="font-gelica text-xl text-plum mb-4">{section.heading}</h3>
                <ul className="space-y-2.5">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rose flex-shrink-0" />
                      <span className="font-satoshi text-base text-ink leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* STATS */}
            {section.type === 'stats' && (
              <div className="grid grid-cols-2 gap-4">
                {section.items.map((stat, j) => (
                  <div key={j} className="bg-white border border-black/8 shadow-sm p-6 relative overflow-hidden">
                    {/* Small washi tape accent */}
                    <div
                      className={`absolute -top-1.5 ${j % 2 === 0 ? 'left-3' : 'right-3'} w-10 h-3.5 opacity-55 ${j % 2 === 0 ? 'bg-rose' : 'bg-sky'}`}
                      style={{ mixBlendMode: 'multiply', transform: 'rotate(-0.5deg)' }}
                    />
                    <p className="font-gelica text-3xl text-plum leading-none mb-2">{stat.value}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink/45 leading-snug">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* PULL QUOTE */}
            {section.type === 'pullquote' && (
              <blockquote className="pl-5 py-1 font-gelica text-xl md:text-2xl text-plum leading-snug italic border-l-[3px] border-rose">
                {section.text}
              </blockquote>
            )}

            {/* BOLD BULLETS */}
            {section.type === 'bold-bullets' && (
              <div>
                {section.heading && (
                  <h3 className="font-gelica text-xl text-plum mb-4">{section.heading}</h3>
                )}
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rose flex-shrink-0" />
                      <span className="font-satoshi text-base text-ink leading-relaxed">
                        <strong className="text-ink font-semibold">{item.bold}</strong>{item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}

        {/* ── More case studies ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.55 }}
          className="mt-20 pt-12 border-t border-black/8"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/35 mb-8">More Case Studies</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {otherProjects.map((key, idx) => {
              const op = PROJECT_DATA[key];
              return (
                <button
                  key={key}
                  onClick={() => onOpenProject(key)}
                  className="group text-left bg-white p-3 pb-8 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative"
                  style={{ transform: `rotate(${idx === 0 ? -1 : 0.5}deg)` }}
                >
                  {op.thumbnail && (
                    <div className="w-full aspect-video overflow-hidden bg-gray-100 mb-4">
                      <img src={op.thumbnail} alt={op.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="px-1">
                    <p className="font-gelica text-lg text-ink leading-snug mb-0.5 group-hover:text-plum transition-colors duration-200">{op.title}</p>
                    <p className="font-satoshi text-xs text-ink/50 italic">{op.subtitle}</p>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-ink/30 mt-3 group-hover:text-rose/60 transition-colors duration-200">View Case Study →</p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="mt-10 w-full flex items-center justify-center gap-2 py-3 border border-black/10 font-mono text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink hover:border-ink/25 transition-all duration-200 cursor-pointer rounded-full"
          >
            ← Back to all projects
          </button>
        </motion.div>

          </div>
        </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAGIC BUTTERFLY — interactive flying butterfly with dust trail + burst effect
// ─────────────────────────────────────────────────────────────────────────────

const DUST_COLORS = [
  '#38bdf8', '#7dd3fc', '#0ea5e9', '#bae6fd',
  '#60a5fa', '#38bdf8', '#93c5fd', '#7dd3fc',
  '#0284c7', '#38bdf8', '#bae6fd', '#60a5fa',
  '#7dd3fc', '#0ea5e9', '#38bdf8', '#93c5fd',
  '#bae6fd', '#38bdf8', '#60a5fa', '#7dd3fc',
];

// Perch positions as viewport fractions — ordered for a natural circuit
const PERCHES = [
  { xPct: 0.21, yPct: 0.14 }, // ProjectStack — top-left
  { xPct: 0.82, yPct: 0.16 }, // FlipCard — top-right
  { xPct: 0.08, yPct: 0.60 }, // ReviewStack — mid-left
  { xPct: 0.79, yPct: 0.70 }, // ContactEnvelope — mid-right
  { xPct: 0.50, yPct: 0.07 }, // Ribbon — top-centre
];

/* ── CSS cartoon butterfly — injected stylesheet + HTML structure ── */
const ButterflyShape = ({ isFlying }: { isFlying: boolean }) => {
  const flapDur = isFlying ? '0.30s' : '1.7s';

  useEffect(() => {
    const id = 'mbf-butterfly-styles';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      .mbf-cc{position:relative;width:var(--mbf-sz,92px);height:var(--mbf-sz,92px);font-size:calc(var(--mbf-sz,92px)/80);display:inline-block}
      .mbf-cc *{box-sizing:border-box}
      .mbf-c{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80em;height:80em;--body:#1a1a1a;--wing-light:#42d4ff;--wing-dark:#0055ff;--wing-edge:#111111;--dot-color:#ffffff;perspective:200em}
      .mbf-c div{position:absolute;box-sizing:border-box}
      .mbf-r{border-radius:100%}
      .mbf-c .mbf-hb::before,.mbf-c .mbf-ha::after{content:"";display:block;position:absolute;box-sizing:border-box}
      .mbf-ant,.mbf-bod{width:4%;height:4%;background:var(--body);top:40%;left:50%;transform:translate(-50%,-50%);z-index:10}
      .mbf-bod::before{width:60%;height:1000%;background:var(--body);left:50%;transform:translate(-50%,0);border-radius:50%}
      .mbf-bod::after{width:150%;height:400%;background:var(--body);top:90%;left:50%;transform:translate(-50%,0);border-radius:50%}
      .mbf-ant{box-shadow:-4.1em -9.1em 0 -1em var(--body),4.1em -9.1em 0 -1em var(--body)}
      .mbf-ant::before{width:150%;height:350%;border-radius:50%;left:80%;bottom:20%;border:0.25em solid transparent;border-left:0.5em solid var(--body);transform:rotate(20deg)}
      .mbf-ant::after{width:150%;height:350%;border-radius:50%;bottom:20%;border:0.25em solid transparent;border-left:0.5em solid transparent;border-right:0.5em solid var(--body);transform:rotate(-20deg);left:-135%}
      .mbf-wg{position:absolute;width:100%;height:100%;top:0;left:0;transform-origin:50% 50%;transform-style:preserve-3d;z-index:5}
      .mbf-wl{animation-name:mbfFL;animation-duration:var(--mbf-fd,0.6s);animation-timing-function:ease-in-out;animation-iteration-count:infinite}
      .mbf-wr{animation-name:mbfFR;animation-duration:var(--mbf-fd,0.6s);animation-timing-function:ease-in-out;animation-iteration-count:infinite}
      @keyframes mbfFL{0%,100%{transform:rotateY(0deg)}50%{transform:rotateY(60deg)}}
      @keyframes mbfFR{0%,100%{transform:scaleX(-1) rotateY(0deg)}50%{transform:scaleX(-1) rotateY(60deg)}}
      .mbf-wt{top:5%;width:50%;height:45%;left:-0.125%;background:linear-gradient(135deg,var(--wing-light),var(--wing-dark));border-radius:20% 100% 10% 80%;transform-origin:right bottom;transform:rotate(-12deg);box-shadow:inset 3.5em 1.5em 0 1em var(--wing-edge),inset -0.5em 0 0 1em var(--wing-edge);overflow:hidden}
      .mbf-wt::after{width:120%;height:90%;border-radius:50%;transform:rotate(35deg);left:30%;top:-5%;box-shadow:inset 1em -2em var(--wing-edge)}
      .mbf-wt::before{width:64%;height:25%;transform:rotate(0deg);top:61.5%;border-radius:50% 50% 40% 60%;box-shadow:-1em -0.25em 0 1.5em var(--wing-edge)}
      .mbf-dots{width:2em;height:2em;background:white;left:5%;top:10%;box-shadow:-0.5em 3em white,-0.5em 6em 0 0.125em white,1.5em -2.25em var(--wing-light),3.5em -3em 0 -0.5em white,20em 7em 0 2em var(--wing-edge),20em 7.25em 0 3em white}
      .mbf-wb{width:28%;height:40%;background:linear-gradient(135deg,var(--wing-dark),var(--wing-light));border-radius:100% / 125% 125% 70% 50%;transform-origin:right top;transform:rotate(55deg);top:59%;left:27.5%;box-shadow:inset 1em -2em 0 0.5em var(--wing-edge);overflow:hidden}
      .mbf-wb::before{width:100%;height:100%;left:55%;top:-30%;border-radius:50%;box-shadow:-1em 0.5em var(--wing-edge),-3em 2em 0 1em var(--wing-dark),-3em 3em 0 1.5em var(--wing-edge)}
      .mbf-wb::after{width:3em;height:3em;background:var(--wing-edge);top:70%;left:15%;border-radius:50%;box-shadow:2em 2em 0 -0.5em var(--wing-edge),2.75em -0.5em 0 -0.5em var(--dot-color),4.25em 1.5em 0 -0.75em var(--dot-color),11em -10em 0 1em var(--wing-edge),15em -12em 0 -0.5em var(--dot-color)}
    `;
    document.head.appendChild(el);
  }, []);

  return (
    <div
      key={isFlying ? 'f' : 'p'}
      className="mbf-cc"
      style={{ '--mbf-sz': '52px', '--mbf-fd': flapDur } as React.CSSProperties}
    >
      <div className="mbf-c mbf-hb">
        {/* Left wing group */}
        <div className="mbf-wg mbf-wl">
          <div className="mbf-wb mbf-ha mbf-hb" />
          <div className="mbf-wt mbf-ha mbf-hb">
            <div className="mbf-dots mbf-r" />
          </div>
        </div>
        {/* Right wing group */}
        <div className="mbf-wg mbf-wr">
          <div className="mbf-wb mbf-ha mbf-hb" />
          <div className="mbf-wt mbf-ha mbf-hb">
            <div className="mbf-dots mbf-r" />
          </div>
        </div>
        <div className="mbf-bod mbf-r mbf-ha mbf-hb" />
        <div className="mbf-ant mbf-r mbf-ha mbf-hb" />
      </div>
    </div>
  );
};

/* ── Single spring-lagged dust particle ── */
const DustParticle = ({ index, color, motionX, motionY }: { index: number; color: string; motionX: any; motionY: any }) => {
  // Aggressive stiffness drop so the tail stretches long and lingers
  const stiffness = Math.max(6, 190 - index * 9);
  const x = useSpring(motionX, { stiffness, damping: 13 });
  const y = useSpring(motionY, { stiffness, damping: 13 });
  const size = Math.max(2, 11.5 - index * 0.48);
  const opacity = Math.max(0.04, 0.9 - index * 0.044);
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, x, y, translateX: '-50%', translateY: '-50%',
        width: size, height: size, borderRadius: '50%',
        background: color, opacity,
        boxShadow: `0 0 ${size * 2 + 3}px ${color}, 0 0 ${size * 4 + 6}px ${color}bb, 0 0 ${size * 8 + 6}px ${color}55`,
        pointerEvents: 'none', zIndex: 9996,
      }}
    />
  );
};

/* ── Burst sparkle explosion ── */
const BurstExplosion = ({ x, y }: { x: number; y: number }) => {
  const palette = ['#38bdf8', '#7dd3fc', '#0ea5e9', '#bae6fd', '#60a5fa', '#0284c7', '#93c5fd', '#e0f2fe'];
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => {
      const angle = (i / 30) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = 55 + Math.random() * 130;
      return {
        tx: Math.cos(angle) * dist, ty: Math.sin(angle) * dist,
        color: palette[i % 8],
        size: 4 + Math.random() * 10,
        duration: 0.65 + Math.random() * 0.55,
        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
        isRound: Math.random() > 0.4,
      };
    }), []
  );
  const symbols = [
    { sym: '✦', col: '#38bdf8' }, { sym: '✧', col: '#bae6fd' },
    { sym: '✨', col: '#7dd3fc' }, { sym: '💫', col: '#0ea5e9' },
    { sym: '✦', col: '#93c5fd' }, { sym: '❄️', col: '#e0f2fe' },
  ];
  return (
    <div style={{ position: 'fixed', left: x, top: y, zIndex: 9999, pointerEvents: 'none' }}>
      {/* Central flash */}
      <motion.div
        initial={{ scale: 0, opacity: 0.95 }} animate={{ scale: 3.5, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ position: 'absolute', width: 32, height: 32, borderRadius: '50%', background: 'radial-gradient(circle,#ffffff,#bae6fd,transparent)', transform: 'translate(-50%,-50%)' }}
      />
      {/* Particles */}
      {particles.map((p, i) => (
        <motion.div key={i}
          initial={{ x: 0, y: 0, scale: 1.2, opacity: 1, rotate: 0 }}
          animate={{ x: p.tx, y: p.ty, scale: 0, opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', left: -p.size / 2, top: -p.size / 2, width: p.size, height: p.size, borderRadius: p.isRound ? '50%' : '20%', background: p.color, boxShadow: `0 0 ${p.size + 4}px ${p.color}` }}
        />
      ))}
      {/* Emoji sparkles */}
      {symbols.map(({ sym, col }, i) => (
        <motion.span key={i}
          initial={{ x: 0, y: 0, scale: 1.3, opacity: 1 }}
          animate={{ x: (Math.random() - 0.5) * 220, y: -70 - Math.random() * 130, scale: 0, opacity: 0 }}
          transition={{ duration: 0.8 + Math.random() * 0.45, ease: 'easeOut', delay: Math.random() * 0.15 }}
          style={{ position: 'absolute', fontSize: 14 + Math.random() * 14, color: col, userSelect: 'none' }}
        >{sym}</motion.span>
      ))}
    </div>
  );
};

/* ── Organic multi-waypoint flight path generator ── */
function generateFlightPath(sx: number, sy: number, tx: number, ty: number) {
  const N = 7; // more waypoints = silkier arc
  const xs: number[] = [sx], ys: number[] = [sy], ts: number[] = [0];
  const dx = tx - sx, dy = ty - sy;
  const len = Math.hypot(dx, dy) + 0.01;
  // perpendicular unit vector for a single consistent bow direction
  const px = -dy / len, py = dx / len;
  // One random bow direction per flight, consistent across all waypoints
  const bowDir = Math.random() > 0.5 ? 1 : -1;
  const bowAmp = len * (0.12 + Math.random() * 0.14); // 12–26% of distance
  for (let i = 1; i < N - 1; i++) {
    const t = i / (N - 1);
    // Smooth bell-curve bow — peaks at midpoint, tapers at start/end
    const bow = bowDir * bowAmp * Math.sin(t * Math.PI);
    // Tiny along-axis micro-jitter so the path has a hand-drawn wobble
    const jitter = (Math.random() - 0.5) * len * 0.025;
    xs.push(sx + dx * t + jitter + px * bow);
    ys.push(sy + dy * t + py * bow);
    ts.push(t);
  }
  xs.push(tx); ys.push(ty); ts.push(1);
  return { xs, ys, ts };
}

/* ── Orchestrator ── */
const MagicButterfly = ({ ready, isHomePage }: { ready: boolean; isHomePage: boolean }) => {
  const [phase, setPhase] = useState<'flying' | 'perching' | 'bursting'>('flying');
  const [gone, setGone] = useState(false);
  const [perchIdx, setPerchIdx] = useState(0);
  const [burstPos, setBurstPos] = useState({ x: 0, y: 0 });
  const [burstKey, setBurstKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bX = useMotionValue(window.innerWidth * 0.5);
  const bY = useMotionValue(window.innerHeight * 0.35);
  // Direction-facing rotation
  const bRot = useMotionValue(0);
  const smoothRot = useSpring(bRot, { stiffness: 60, damping: 16 });

  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  const doFlyTo = useCallback((tx: number, ty: number, onDone?: () => void) => {
    setPhase('flying');
    const sx = bX.get(), sy = bY.get();
    // Smoothly rotate to face direction of travel (+90° offset — body points up by default)
    const rawAngle = Math.atan2(ty - sy, tx - sx) * (180 / Math.PI) + 90;
    const cur = bRot.get();
    let delta = rawAngle - cur;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    animate(bRot, cur + delta, { duration: 0.55, ease: [0.4, 0, 0.2, 1] as any });
    // Organic curved path
    const { xs, ys, ts } = generateFlightPath(sx, sy, tx, ty);
    const dist = Math.hypot(tx - sx, ty - sy);
    const duration = Math.max(2.4, 2.0 + dist * 0.0016);
    // Custom ease: slow start, fluid mid, gentle deceleration into landing
    const ease: any = [0.3, 0, 0.15, 1];
    animate(bX, xs, { duration, ease, times: ts });
    animate(bY, ys, { duration, ease, times: ts, onComplete: onDone });
  }, [bX, bY, bRot]);

  const scheduleNext = useCallback((fromIdx: number) => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      const nextIdx = (fromIdx + 1) % PERCHES.length;
      const p = PERCHES[nextIdx];
      doFlyTo(p.xPct * window.innerWidth, p.yPct * window.innerHeight, () => {
        setPhase('perching');
        setPerchIdx(nextIdx);
        // Gently straighten up when landing
        animate(bRot, 0, { duration: 1.0, ease: 'easeInOut' });
        scheduleNext(nextIdx);
      });
    }, 5000 + Math.random() * 5000);
  }, [doFlyTo, bRot]);

  // Only start flying once the welcome intro has fully finished
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      const p = PERCHES[0];
      doFlyTo(p.xPct * window.innerWidth, p.yPct * window.innerHeight, () => {
        setPhase('perching');
        setPerchIdx(0);
        animate(bRot, 0, { duration: 1.0, ease: 'easeInOut' });
        scheduleNext(0);
      });
    }, 700);
    return () => { clearTimeout(t); clearTimer(); };
  }, [ready, doFlyTo, scheduleNext, bRot]);

  // Reset gone state when returning to homepage
  useEffect(() => { if (isHomePage) setGone(false); }, [isHomePage]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase === 'bursting') return;
    if (!isHomePage) {
      // Permanently dismiss on non-homepage pages
      clearTimer();
      setGone(true);
      return;
    }
    clearTimer();
    setBurstPos({ x: e.clientX, y: e.clientY });
    setBurstKey(k => k + 1);
    setPhase('bursting');
    setTimeout(() => {
      bX.set(window.innerWidth * 0.3 + Math.random() * window.innerWidth * 0.4);
      bY.set(window.innerHeight * 0.15 + Math.random() * window.innerHeight * 0.25);
      const nextIdx = (perchIdx + 1) % PERCHES.length;
      const p = PERCHES[nextIdx];
      doFlyTo(p.xPct * window.innerWidth, p.yPct * window.innerHeight, () => {
        setPhase('perching');
        setPerchIdx(nextIdx);
        animate(bRot, 0, { duration: 1.0, ease: 'easeInOut' });
        scheduleNext(nextIdx);
      });
    }, 2000);
  }, [phase, perchIdx, bX, bY, bRot, doFlyTo, scheduleNext, isHomePage]);

  const isVisible = ready && phase !== 'bursting' && !gone;
  const isFlying = phase === 'flying';

  if (!ready) return null;

  return (
    <>
      {/* Trailing dust */}
      {isVisible && DUST_COLORS.map((color, i) => (
        <DustParticle key={i} index={i} color={color} motionX={bX} motionY={bY} />
      ))}

      {/* Butterfly */}
      {isVisible && (
        <motion.div
          style={{ position: 'fixed', top: 0, left: 0, x: bX, y: bY, translateX: '-50%', translateY: '-50%', rotate: smoothRot, zIndex: 9998, cursor: 'pointer', filter: 'drop-shadow(0 4px 18px rgba(14,165,233,.5))' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.18, filter: 'drop-shadow(0 6px 24px rgba(14,165,233,.7))' }}
          onClick={handleClick}
        >
          {/* Inner wrapper handles perch-bob without conflicting with position */}
          <motion.div
            animate={{ y: isFlying ? 0 : [0, -6, 0] }}
            transition={isFlying ? { duration: 0.3 } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ButterflyShape isFlying={isFlying} />
          </motion.div>
        </motion.div>
      )}

      {/* Burst explosion */}
      {phase === 'bursting' && <BurstExplosion key={burstKey} x={burstPos.x} y={burstPos.y} />}
    </>
  );
};

export default function App() {
  const [cursorText, setCursorText] = useState("");
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [showPaths, setShowPaths] = useState(false);
  const [vw, setVw] = useState(() => window.innerWidth);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [showProjectsOverview, setShowProjectsOverview] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = vw < 640;

  // Show paths after welcome screen completes (8.5s: 3.5s intro text + 3s butterflies + 2s buffer)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPaths(true);
    }, 8500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-screen relative overflow-hidden bg-[#fefcfa] selection:bg-lilac selection:text-plum cursor-default"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect x='0' y='0' width='100' height='100' fill='%23FEFCFA' fill-opacity='1'/%3E%3Crect x='100' y='100' width='100' height='100' fill='%23FEFCFA' fill-opacity='1'/%3E%3Crect x='100' y='0' width='100' height='100' fill='%23C9BCE8' fill-opacity='0.05'/%3E%3Crect x='0' y='100' width='100' height='100' fill='%23C9BCE8' fill-opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      >
        {/* Intro Butterflies */}
        {/* Focal Butterfly */}
        <motion.div
          initial={{ opacity: 0, x: '50vw', y: '60vh', rotate: -15, scale: 0.8 }}
          animate={{
            opacity: [0, 1, 1, 1, 0],
            x: ['50vw', '45vw', '55vw', '80vw', '110vw'],
            y: ['60vh', '45vh', '55vh', '20vh', '-10vh'],
            rotate: [-15, 10, -20, 15, 30],
            scale: [0.8, 1.2, 1, 1.1, 0.8]
          }}
          transition={{ duration: 6, times: [0, 0.1, 0.4, 0.7, 1], ease: "easeInOut", delay: 0.5 }}
          className="fixed top-0 left-0 text-6xl drop-shadow-md z-[100] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        >
          🦋
        </motion.div>

        {/* Butterfly 2 */}
        <motion.div
          initial={{ opacity: 0, x: '30vw', y: '70vh', rotate: 15, scale: 0.6 }}
          animate={{
            opacity: [0, 0.8, 0.8, 0],
            x: ['30vw', '20vw', '40vw', '10vw'],
            y: ['70vh', '50vh', '30vh', '10vh'],
            rotate: [15, -10, 5, 25],
            scale: [0.6, 1, 0.9, 0.7]
          }}
          transition={{ duration: 5, times: [0, 0.2, 0.6, 1], ease: "easeInOut", delay: 1.0 }}
          className="fixed top-0 left-0 text-5xl drop-shadow-md z-[90] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        >
          🦋
        </motion.div>

        {/* Butterfly 3 */}
        <motion.div
          initial={{ opacity: 0, x: '70vw', y: '60vh', rotate: -10, scale: 0.5 }}
          animate={{
            opacity: [0, 0.7, 0.7, 0],
            x: ['70vw', '60vw', '75vw', '90vw'],
            y: ['60vh', '40vh', '20vh', '0vh'],
            rotate: [-10, 15, -5, 20],
            scale: [0.5, 0.8, 0.7, 0.6]
          }}
          transition={{ duration: 4.5, times: [0, 0.3, 0.7, 1], ease: "easeInOut", delay: 1.2 }}
          className="fixed top-0 left-0 text-4xl drop-shadow-md z-[90] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        >
          🦋
        </motion.div>

            {/* Noise Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Drag to explore tab */}
            <motion.div 
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ delay: 7.0, type: "spring" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-sm px-6 py-2 rounded-b-xl z-30"
            >
              <p className="font-mono text-xs text-ink/60 uppercase tracking-widest select-none">Click on cards to explore</p>
            </motion.div>



            {/* Fixed Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 4.0, ease: "easeOut" }}
              className="absolute top-[22%] sm:top-[26%] left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-0 text-center"
            >
              <h1 className="font-gelica text-[2.6rem] sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95]" style={{ textShadow: '3px 3px 0px rgba(84,19,136,0.10), 0px 6px 18px rgba(84,19,136,0.07)' }}>
                <span className="text-plum font-black block">Super</span>
                <span className="text-plum font-black block">Product</span>
                <span className="text-rose italic font-black block">Designer.</span>
              </h1>
              <p className="font-satoshi text-ink/70 mt-3 sm:mt-6 max-w-sm text-sm sm:text-lg leading-relaxed mx-auto">
                A curated collection of thoughts, work, and design thinking. <br/>
              </p>
            </motion.div>

            {/* Scribble annotations — visible after welcome screen */}
            <ScribbleAnnotations show={showPaths} compact={isMobile} />

            {/* Draggable Elements */}
            <ProjectStack className={isMobile ? "top-[5%] left-[3%]" : "top-[8%] left-[11%]"} compact={isMobile} setCursorText={setCursorText} delay={5.0} onOpenProjects={() => setShowProjectsOverview(true)} />

            <FlipCard
              className={isMobile ? "top-[5%] right-[3%]" : "top-[10%] right-[11%]"}
              rotation={-3}
              zIndex={15}
              compact={isMobile}
              setCursorText={setCursorText}
              delay={6.1}
              onOpenAbout={() => setShowAbout(true)}
            />

            <ContactEnvelope
              className={isMobile ? "top-[58%] right-[3%]" : "top-[62%] right-[12%]"}
              rotation={5}
              zIndex={40}
              compact={isMobile}
              delay={6.2}
              setCursorText={setCursorText}
            />




            <ReviewStack className={isMobile ? "top-[53%] left-[3%]" : "top-[58%] left-[8%]"} compact={isMobile} setCursorText={setCursorText} delay={4.4} />

            {/* Path Butterflies — floating 🦋 accents, appear after welcome screen */}
            {showPaths && (
              <>
                <PathButterfly className={isMobile ? "top-[6%] left-[43%]" : "top-[9%] left-[58%]"}  driftX={-5} driftY={4}  delay={0.4} size={isMobile ? "text-lg" : "text-2xl"} />
                <PathButterfly className={isMobile ? "top-[76%] left-[36%]" : "top-[83%] left-[42%]"} driftX={6}  driftY={3}  delay={1.0} size={isMobile ? "text-lg" : "text-2xl"} />
              </>
            )}

            {/* Scrapbook Extras */}
            {/* Ribbon — decorative accent pinned to top-right corner of FlipCard */}
            <EmojiScrap emoji="🎀" className={isMobile ? "top-[3%] right-[2%]" : "top-[6%] right-[10%]"} rotation={5} zIndex={17} setCursorText={setCursorText} delay={6.7} />
            {/* Sparkles — accent decorations */}
            <EmojiScrap emoji="✨" className="top-[40%] left-[32%]" rotation={0} zIndex={16} setCursorText={setCursorText} delay={6.8} size="text-2xl" />
            {/* Bubbles near bottom sweep */}
            <EmojiScrap emoji="🫧" className="top-[78%] left-[40%]" rotation={-5} zIndex={16} setCursorText={setCursorText} delay={7.1} size="text-2xl" />


          </motion.div>

      {/* MagicButterfly rendered OUTSIDE the transformed/overflow-hidden motion.div
          so that position:fixed works relative to the real viewport.
          Only mounted after welcome intro finishes (showPaths = 8.5 s). */}
      <MagicButterfly ready={showPaths} isHomePage={!showAbout && !showProjectsOverview && !activeProject} />

      {/* Custom cursor — arrow + pill badge */}
      {showPaths && cursorText && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-end gap-1.5"
          animate={{ x: mousePos.x, y: mousePos.y, opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          {/* Cursor arrow */}
          <svg width="26" height="26" viewBox="17 14 55 57" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 6px rgba(84,19,136,0.35))' }}>
            <path d="M33.3223 66.5446L20.5491 21.6653C19.8896 19.3479 22.2926 17.3469 24.4777 18.3939L66.795 38.6707C69.0453 39.7489 68.876 42.9833 66.526 43.8174L49.1221 49.9939C48.4899 50.2181 47.9598 50.6596 47.6275 51.2385L38.4762 67.1755C37.2406 69.3275 34.0012 68.931 33.3223 66.5446Z" fill="#541388"/>
          </svg>
          {/* Label pill */}
          <div className="bg-plum text-white font-satoshi font-semibold text-[11px] tracking-wide px-3.5 py-1.5 rounded-full whitespace-nowrap shadow-[0_4px_16px_rgba(84,19,136,0.28)] mb-1">
            {cursorText}
          </div>
        </motion.div>
      )}

      {/* About page */}
      {showAbout && <AboutPage onClose={() => setShowAbout(false)} />}

      {/* Projects overview — opens on ProjectStack click */}
      {showProjectsOverview && !activeProject && (
        <ProjectsOverviewPage
          onClose={() => setShowProjectsOverview(false)}
          onSelectProject={setActiveProject}
        />
      )}

      {/* Individual project case study — opens from overview */}
      {activeProject && (
        <ProjectPage
          projectKey={activeProject}
          onClose={() => setActiveProject(null)}
          onOpenProject={(key) => setActiveProject(key)}
        />
      )}
    </>
  );
}
