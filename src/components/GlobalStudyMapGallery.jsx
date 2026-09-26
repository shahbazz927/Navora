import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Sparkles,
  Layers,
  Eye,
  ArrowRight,
  Plane,
  Compass,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import indiaWhiteMap1 from '../assets/images/white_clean_map_no_lines_1789745181194.jpg';
import indiaWhiteMap2 from '../assets/images/white_map_minimal_clean_1789745195958.jpg';

const WHITE_VARIATIONS = [
  {
    id: 'white-clean',
    title: 'Pure White Map (No Lines)',
    subtitle: 'Crisp solid white canvas with soft silver continent silhouettes and zero lines',
    image: indiaWhiteMap1,
    tag: 'Clean Minimalist 16:9',
    description: 'Pristine white background completely free of any lines, flight arcs, grids, text, or borders.'
  },
  {
    id: 'white-vector',
    title: 'Vector Silhouettes (Line-Free)',
    subtitle: 'Refined slate-gray continent contours on clean white background',
    image: indiaWhiteMap2,
    tag: 'Banner Variation',
    description: 'Ultra-clean digital cartography on white with no pre-drawn lines or overlays.'
  }
];

// Coordinate mapping on 1000 x 562.5 viewBox (16:9 aspect ratio)
const INDIA_COORDS = { x: 685, y: 258, name: 'India (Origin)' };

const CORRIDORS = [
  {
    id: 'germany',
    name: 'Germany',
    region: 'Central Europe',
    flag: '🇩🇪',
    coords: { x: 525, y: 160 },
    arcControl: { x: 600, y: 110 },
    duration: '8–10 hrs',
    postStudy: '18-Mo Jobseeker + EU Blue Card',
    budget: '₹12L – ₹16L / yr',
    keyPrograms: 'Automotive, Mechanical, Robotics, CS',
    highlight: 'Zero public tuition at state universities; world engineering powerhouse.',
    accentColor: '#10B981', // emerald
  },
  {
    id: 'usa',
    name: 'United States',
    region: 'North America',
    flag: '🇺🇸',
    coords: { x: 230, y: 195 },
    arcControl: { x: 440, y: 70 },
    duration: '15–18 hrs',
    postStudy: '36-Month STEM OPT Extension',
    budget: '₹35L – ₹55L / yr',
    keyPrograms: 'AI, CS, Robotics, MBA, FinTech',
    highlight: 'World’s deepest tech ecosystem and highest post-grad compensation.',
    accentColor: '#2563EB', // vibrant blue
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    region: 'Western Europe',
    flag: '🇬🇧',
    coords: { x: 485, y: 155 },
    arcControl: { x: 580, y: 100 },
    duration: '8–10 hrs',
    postStudy: '2-Year Graduate Route Visa',
    budget: '₹24L – ₹38L / yr',
    keyPrograms: '1-Yr Masters, Law, Finance, AI',
    highlight: 'Accelerated 1-year master’s degree minimizing living expenses.',
    accentColor: '#6366F1', // indigo
  },
  {
    id: 'canada',
    name: 'Canada',
    region: 'North America',
    flag: '🇨🇦',
    coords: { x: 250, y: 165 },
    arcControl: { x: 450, y: 60 },
    duration: '14–17 hrs',
    postStudy: 'Up to 3-Year PGWP Work Permit',
    budget: '₹22L – ₹34L / yr',
    keyPrograms: 'Co-op Degrees, Cloud, Health, Data',
    highlight: 'Work-integrated co-op degrees with direct post-grad work permits.',
    accentColor: '#E11D48', // rose
  },
  {
    id: 'australia',
    name: 'Australia',
    region: 'Oceania',
    flag: '🇦🇺',
    coords: { x: 885, y: 430 },
    arcControl: { x: 800, y: 330 },
    duration: '11–13 hrs',
    postStudy: '2–4 Year Post-Study Work Rights',
    budget: '₹28L – ₹42L / yr',
    keyPrograms: 'Mining, AI, Data Science, Business',
    highlight: 'High minimum wages, student work rights, and top Group of Eight universities.',
    accentColor: '#D97706', // amber
  },
  {
    id: 'ireland',
    name: 'Ireland',
    region: 'Western Europe',
    flag: '🇮🇪',
    coords: { x: 465, y: 155 },
    arcControl: { x: 570, y: 105 },
    duration: '10–12 hrs',
    postStudy: '2-Year Third Level Graduate Scheme',
    budget: '₹20L – ₹30L / yr',
    keyPrograms: 'Software, Biotech, Pharmaceuticals',
    highlight: 'European headquarters for Google, Apple, Meta, and Pfizer.',
    accentColor: '#059669', // green
  },
  {
    id: 'netherlands',
    name: 'Netherlands',
    region: 'Western Europe',
    flag: '🇳🇱',
    coords: { x: 508, y: 155 },
    arcControl: { x: 595, y: 110 },
    duration: '9–11 hrs',
    postStudy: '1-Year Zoekjaar Orientation Year',
    budget: '₹18L – ₹28L / yr',
    keyPrograms: 'CS, Supply Chain, Clean Tech, AgriTech',
    highlight: 'Largest selection of 100% English-taught university degrees in continental Europe.',
    accentColor: '#EA580C', // orange
  },
  {
    id: 'singapore',
    name: 'Singapore',
    region: 'Southeast Asia',
    flag: '🇸🇬',
    coords: { x: 755, y: 325 },
    arcControl: { x: 730, y: 285 },
    duration: '4.5–5.5 hrs',
    postStudy: 'Tuition Grant Service Bond / LTVP',
    budget: '₹22L – ₹36L / yr',
    keyPrograms: 'NUS & NTU Tech, FinTech, Global Business',
    highlight: 'World-renowned institutions, only 5 hours direct flight from India.',
    accentColor: '#0891B2', // cyan
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    region: 'Southeast Asia',
    flag: '🇲🇾',
    coords: { x: 740, y: 315 },
    arcControl: { x: 715, y: 280 },
    duration: '4–5 hrs',
    postStudy: '12-Mo Job Search Pass / TalentCorp',
    budget: '₹8L – ₹14L / yr',
    keyPrograms: 'Semiconductor, AI, Business, Hospitality',
    highlight: 'Lowest cost in Asia with UK & Australian branch campuses and chip hub.',
    accentColor: '#0EA5E9',
  },
  {
    id: 'uae',
    name: 'UAE / Dubai',
    region: 'Middle East',
    flag: '🇦🇪',
    coords: { x: 615, y: 240 },
    arcControl: { x: 650, y: 200 },
    duration: '3–4 hrs',
    postStudy: 'Golden Visa / Job Exploration Visa',
    budget: '₹16L – ₹26L / yr',
    keyPrograms: 'Aviation, FinTech, AI, Hospitality, Renewable',
    highlight: 'International branch campuses in Dubai with tax-free business hub.',
    accentColor: '#F59E0B',
  }
];

export default function GlobalStudyMapGallery({ onExploreCountry, onStartQuiz }) {
  const [selectedVar, setSelectedVar] = useState(WHITE_VARIATIONS[0].id);
  const [selectedCorridor, setSelectedCorridor] = useState('germany');
  const [showCleanView, setShowCleanView] = useState(false);

  const activeVariation = WHITE_VARIATIONS.find(v => v.id === selectedVar) || WHITE_VARIATIONS[0];
  const activeCorridor = CORRIDORS.find(c => c.id === selectedCorridor) || CORRIDORS[0];

  return (
    <section className="bg-white text-slate-900 border-y border-slate-200 py-12 lg:py-18 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3.5 py-1 text-xs font-semibold text-brand-700 tracking-wider uppercase mb-3 shadow-xs">
            <Globe className="w-3.5 h-3.5 text-brand-600" />
            Interactive Study Destinations · White Canvas
          </span>
          <h2 className="font-ui font-bold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-[-0.03em] leading-tight">
            Transcontinental Pathways from India
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Clean, flat digital map on a pure white background. Click any country to illuminate exactly one glowing pathway connecting India directly to that destination.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mr-1 pl-1">
              <Layers className="w-3.5 h-3.5 text-brand-600" /> Clean White Variations:
            </span>
            {WHITE_VARIATIONS.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVar(v.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedVar === v.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>{v.title}</span>
                <span className="text-[0.65rem] opacity-80 font-normal">({v.tag})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCleanView(!showCleanView)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                showCleanView
                  ? 'bg-brand-50 border-brand-300 text-brand-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Toggle to view only the pure white map without any icons or pins"
            >
              <Eye className="w-3.5 h-3.5 text-brand-600" />
              {showCleanView ? 'Showing Pure Artwork' : 'Pure Art View'}
            </button>
            <a
              href={activeVariation.image}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors"
            >
              <Maximize2 className="w-3 h-3 text-slate-400" /> High-Res
            </a>
          </div>
        </div>

        {/* Interactive Country Selection Bar */}
        {!showCleanView && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                Select to Light Up:
              </span>
              {CORRIDORS.map(corridor => {
                const isSelected = selectedCorridor === corridor.id;
                return (
                  <button
                    key={corridor.id}
                    onClick={() => setSelectedCorridor(corridor.id)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-sm font-semibold scale-[1.03]'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-sm">{corridor.flag}</span>
                    <span>{corridor.name}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Map Display Stage (Pure White Canvas with No Blue Lines) */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-lg">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-white">
            {/* Flat digital background map on clean white with NO lines */}
            <img
              src={activeVariation.image}
              alt="Clean flat digital map on white background without lines or text"
              className="w-full h-full object-cover object-center select-none"
              referrerPolicy="no-referrer"
            />

            {/* SVG Light-Up Overlay: ZERO background blue lines. ONLY the clicked country illuminates */}
            {!showCleanView && (
              <svg
                viewBox="0 0 1000 562.5"
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Glowing Filter for the Active Lit-up Country */}
                  <filter id="beaconGlow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* 1. India Origin Hub Beacon */}
                <g transform={`translate(${INDIA_COORDS.x}, ${INDIA_COORDS.y})`}>
                  <circle r="16" fill="#F59E0B" fillOpacity="0.18" className="animate-ping" style={{ animationDuration: '3s' }} />
                  <circle r="9" fill="#F59E0B" fillOpacity="0.35" />
                  <circle r="5" fill="#D97706" />
                  <circle r="2" fill="#FFFFFF" />
                </g>

                {/* 2. THE ONE LINE: Exclusively connects India to the currently clicked country */}
                {activeCorridor && activeCorridor.arcControl && (
                  <g key={`single-line-${activeCorridor.id}`}>
                    {/* Subtle glow halo for the single line */}
                    <path
                      d={`M ${INDIA_COORDS.x} ${INDIA_COORDS.y} Q ${activeCorridor.arcControl.x} ${activeCorridor.arcControl.y} ${activeCorridor.coords.x} ${activeCorridor.coords.y}`}
                      fill="none"
                      stroke={activeCorridor.accentColor}
                      strokeWidth="6"
                      strokeOpacity="0.2"
                      filter="url(#beaconGlow)"
                    />
                    {/* Main crisp illuminated line */}
                    <path
                      d={`M ${INDIA_COORDS.x} ${INDIA_COORDS.y} Q ${activeCorridor.arcControl.x} ${activeCorridor.arcControl.y} ${activeCorridor.coords.x} ${activeCorridor.coords.y}`}
                      fill="none"
                      stroke={activeCorridor.accentColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* 3. Destination Nodes: ONLY the clicked country lights up with radiant pulsing rings */}
                {CORRIDORS.map(corridor => {
                  const isSelected = selectedCorridor === corridor.id;
                  const { x, y } = corridor.coords;

                  if (isSelected) {
                    return (
                      <g
                        key={`node-${corridor.id}`}
                        transform={`translate(${x}, ${y})`}
                        filter="url(#beaconGlow)"
                        className="pointer-events-auto cursor-pointer"
                        onClick={() => setSelectedCorridor(corridor.id)}
                      >
                        {/* Lit-up radiant expanding halos */}
                        <circle
                          r="26"
                          fill={corridor.accentColor}
                          fillOpacity="0.18"
                          className="animate-ping"
                          style={{ animationDuration: '1.8s' }}
                        />
                        <circle r="18" fill={corridor.accentColor} fillOpacity="0.28" />
                        <circle r="11" fill={corridor.accentColor} stroke="#FFFFFF" strokeWidth="2.5" />
                        <circle r="4" fill="#FFFFFF" />
                      </g>
                    );
                  }

                  // Non-selected countries: faint, subtle neutral point
                  return (
                    <g
                      key={`node-${corridor.id}`}
                      transform={`translate(${x}, ${y})`}
                      className="pointer-events-auto cursor-pointer group"
                      onClick={() => setSelectedCorridor(corridor.id)}
                    >
                      <circle r="10" fill="transparent" />
                      <circle
                        r="3"
                        fill="#CBD5E1"
                        className="transition-all group-hover:scale-150 group-hover:fill-slate-500"
                      />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Clickable Overlay Hotspots (Badges) */}
            {!showCleanView && (
              <div className="absolute inset-0 pointer-events-none">
                {/* India Origin Label */}
                <div
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-full mb-1"
                  style={{ left: '68.5%', top: '45%' }}
                >
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 border border-amber-300 text-[0.65rem] font-bold text-amber-900 shadow-sm whitespace-nowrap">
                    🇮🇳 India (Origin Hub)
                  </span>
                </div>

                {/* Lit-up Destination Callout Badge (Only for active clicked country) */}
                {activeCorridor && (
                  <motion.div
                    key={activeCorridor.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-full mb-3"
                    style={{
                      left: `${(activeCorridor.coords.x / 1000) * 100}%`,
                      top: `${(activeCorridor.coords.y / 562.5) * 100}%`
                    }}
                  >
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow-lg whitespace-nowrap border text-white"
                      style={{
                        backgroundColor: activeCorridor.accentColor,
                        borderColor: '#FFFFFF'
                      }}
                    >
                      <span>{activeCorridor.flag}</span>
                      <span>{activeCorridor.name} (Lit Up)</span>
                    </span>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Active Corridor Insights Drawer on Clean White Theme */}
          <div className="p-5 sm:p-7 border-t border-slate-200 bg-white">
            <div className="grid lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="text-2xl">{activeCorridor.flag}</span>
                  <h3 className="text-lg sm:text-xl font-bold font-ui text-slate-900">
                    India ➔ {activeCorridor.name} Study Corridor
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                    {activeCorridor.region}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium flex items-center gap-1">
                    <Plane className="w-3 h-3 text-brand-600" /> {activeCorridor.duration} flight from India
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {activeCorridor.highlight} In-demand programs: <strong className="text-slate-900 font-semibold">{activeCorridor.keyPrograms}</strong>.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                    <span className="text-[0.7rem] uppercase tracking-wider text-slate-500 font-semibold block mb-0.5">Post-Study Work</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-700">{activeCorridor.postStudy}</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                    <span className="text-[0.7rem] uppercase tracking-wider text-slate-500 font-semibold block mb-0.5">Estimated Total Cost</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{activeCorridor.budget}</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 col-span-2 sm:col-span-1">
                    <span className="text-[0.7rem] uppercase tracking-wider text-slate-500 font-semibold block mb-0.5">Selected Destination</span>
                    <span className="text-xs sm:text-sm font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Currently Lit Up
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center">
                {onExploreCountry && (
                  <button
                    onClick={() => onExploreCountry(activeCorridor.id)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-brand-950 text-white font-ui font-semibold text-xs sm:text-sm px-4 py-3 shadow-sm transition-all"
                  >
                    <span>Explore {activeCorridor.name} Universities</span>
                    <ArrowRight className="w-4 h-4 text-brand-300" />
                  </button>
                )}
                {onStartQuiz && (
                  <button
                    onClick={onStartQuiz}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold text-xs sm:text-sm px-4 py-3 shadow-brand transition-all"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Match My Profile to {activeCorridor.name}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="mt-3 text-center text-xs text-slate-400">
          Clean flat digital cartography on white background. Clicking any country lights up exactly one pathway connecting India to that destination.
        </p>
      </div>
    </section>
  );
}
