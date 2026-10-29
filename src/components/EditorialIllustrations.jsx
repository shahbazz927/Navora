import React from 'react';

/**
 * NAVORA Editorial Illustrations
 *
 * Handcrafted vector artwork designed with:
 * - Restrained palette: Navy Ink (#0A1638), Primary Cobalt (#2563EB), Teal Accent (#0D9488), Slate/Paper neutrals
 * - Consistent architectural stroke weights (1.5 - 2px)
 * - Education-focused symbolism: navigation compass, campus colonnades, pathway blueprints, research prisms
 * - Accessible SVG structure with role="img" and customizable size
 */

export function IllustrationCompassHorizon({ className = 'w-48 h-48', ariaLabel = 'Navigation compass pointing toward academic horizon' }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <radialGradient id="compassGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>

      {/* Subtle outer glow disc */}
      <circle cx="120" cy="120" r="105" fill="url(#compassGlow)" />

      {/* Outer latitude / graduation ring */}
      <circle cx="120" cy="120" r="92" stroke="#E2E8F0" strokeWidth="1.5" />
      <circle cx="120" cy="120" r="82" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 5" />
      <circle cx="120" cy="120" r="68" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* Degree ticks */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const isCardinal = deg % 90 === 0;
        const r1 = 82;
        const r2 = isCardinal ? 72 : 77;
        const x1 = 120 + r1 * Math.cos(rad);
        const y1 = 120 + r1 * Math.sin(rad);
        const x2 = 120 + r2 * Math.cos(rad);
        const y2 = 120 + r2 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isCardinal ? '#0A1638' : '#94A3B8'}
            strokeWidth={isCardinal ? '2' : '1'}
            strokeLinecap="round"
          />
        );
      })}

      {/* Orbital trajectory paths */}
      <ellipse cx="120" cy="120" rx="98" ry="42" stroke="#0D9488" strokeWidth="1.25" strokeDasharray="4 6" opacity="0.6" transform="rotate(-25 120 120)" />
      <ellipse cx="120" cy="120" rx="98" ry="42" stroke="#2563EB" strokeWidth="1.25" strokeDasharray="5 7" opacity="0.4" transform="rotate(35 120 120)" />

      {/* Orbit milestones */}
      <circle cx="48" cy="85" r="4" fill="#0D9488" />
      <circle cx="192" cy="155" r="4" fill="#2563EB" />
      <circle cx="178" cy="72" r="3" fill="#0A1638" />

      {/* Central Star / Compass Needle */}
      {/* North needle (pointing up-right toward future) */}
      <path d="M120 120 L113 113 L152 48 L127 113 Z" fill="url(#needleGrad)" />
      {/* South needle */}
      <path d="M120 120 L127 127 L88 192 L113 127 Z" fill="#94A3B8" />
      {/* West needle */}
      <path d="M120 120 L113 127 L48 88 L113 113 Z" fill="#CBD5E1" opacity="0.6" />
      {/* East needle */}
      <path d="M120 120 L127 113 L192 152 L127 127 Z" fill="#E2E8F0" opacity="0.8" />

      {/* Needle pivot */}
      <circle cx="120" cy="120" r="7" fill="#0A1638" />
      <circle cx="120" cy="120" r="3" fill="#FFFFFF" />

      {/* Cardinal Labels */}
      <text x="120" y="24" textAnchor="middle" fill="#0A1638" fontSize="10" fontWeight="700" fontFamily="sans-serif">N</text>
      <text x="216" y="123" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="600" fontFamily="sans-serif">E</text>
      <text x="120" y="222" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="600" fontFamily="sans-serif">S</text>
      <text x="24" y="123" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="600" fontFamily="sans-serif">W</text>
    </svg>
  );
}

export function IllustrationPathwayBlueprint({ className = 'w-48 h-48', ariaLabel = 'Education pathway roadmap blueprint' }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <pattern id="gridBlueprint" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Subtle blueprint frame */}
      <rect x="15" y="15" width="210" height="210" rx="14" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="25" y="25" width="190" height="190" rx="10" fill="url(#gridBlueprint)" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />

      {/* Connecting pathway lines */}
      <path
        d="M 50 170 C 75 170, 75 120, 110 120 C 145 120, 150 70, 185 70"
        stroke="#2563EB"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Alternate branched pathway */}
      <path
        d="M 110 120 C 145 120, 150 165, 185 165"
        stroke="#0D9488"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
        fill="none"
      />

      {/* Node 1: Origin (Stage / 10th / 12th) */}
      <g transform="translate(50, 170)">
        <circle cx="0" cy="0" r="16" fill="#FFFFFF" stroke="#0A1638" strokeWidth="2" />
        <circle cx="0" cy="0" r="6" fill="#2563EB" />
        <text x="0" y="28" textAnchor="middle" fill="#0A1638" fontSize="9" fontWeight="700" fontFamily="sans-serif">STAGE 01</text>
        <text x="0" y="38" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="sans-serif">Foundation</text>
      </g>

      {/* Node 2: Central Branch (Degree Choice) */}
      <g transform="translate(110, 120)">
        <circle cx="0" cy="0" r="18" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="7" fill="#0D9488" />
        {/* Branching indicator */}
        <path d="M -4 0 L 4 0 M 0 -4 L 0 4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <text x="0" y="-24" textAnchor="middle" fill="#0A1638" fontSize="9" fontWeight="700" fontFamily="sans-serif">DEGREE</text>
        <text x="0" y="-14" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="sans-serif">Specialisation</text>
      </g>

      {/* Node 3A: Primary Trajectory (Career Goal) */}
      <g transform="translate(185, 70)">
        <circle cx="0" cy="0" r="18" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
        {/* Guiding star in node */}
        <path d="M 0 -7 L 2 -2 L 7 0 L 2 2 L 0 7 L -2 2 L -7 0 L -2 -2 Z" fill="#FFFFFF" />
        <text x="0" y="-24" textAnchor="middle" fill="#2563EB" fontSize="9" fontWeight="700" fontFamily="sans-serif">CAREER</text>
        <text x="0" y="-14" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="sans-serif">Primary Path</text>
      </g>

      {/* Node 3B: Alternate Trajectory */}
      <g transform="translate(185, 165)">
        <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#0D9488" strokeWidth="2" />
        <circle cx="0" cy="0" r="5" fill="#0D9488" />
        <text x="0" y="24" textAnchor="middle" fill="#0D9488" fontSize="9" fontWeight="700" fontFamily="sans-serif">ALTERNATIVE</text>
        <text x="0" y="34" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="sans-serif">Adjacent Track</text>
      </g>

      {/* Architectural measurement ticks */}
      <line x1="30" y1="205" x2="210" y2="205" stroke="#CBD5E1" strokeWidth="1" />
      <line x1="30" y1="201" x2="30" y2="209" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="120" y1="201" x2="120" y2="209" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="210" y1="201" x2="210" y2="209" stroke="#94A3B8" strokeWidth="1.5" />
    </svg>
  );
}

export function IllustrationGlobalCampus({ className = 'w-48 h-48', ariaLabel = 'Global university campus architecture and international study' }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>

      {/* Background arch window */}
      <path
        d="M 35 205 L 35 95 C 35 48 73 10 120 10 C 167 10 205 48 205 95 L 205 205 Z"
        fill="url(#skyGrad)"
        stroke="#E2E8F0"
        strokeWidth="1.5"
      />

      {/* International globe meridian lines behind campus */}
      <ellipse cx="120" cy="95" rx="65" ry="65" stroke="#E2E8F0" strokeWidth="1" />
      <ellipse cx="120" cy="95" rx="28" ry="65" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="55" y1="95" x2="185" y2="95" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />

      {/* Flight / migration arc with aircraft pin */}
      <path
        d="M 50 150 C 70 60, 160 50, 195 110"
        stroke="#2563EB"
        strokeWidth="1.75"
        strokeDasharray="4 4"
        fill="none"
      />
      <circle cx="195" cy="110" r="3.5" fill="#2563EB" />

      {/* Classical Portico / Colonnade Building */}
      {/* Pediment (triangle roof) */}
      <path d="M 60 145 L 120 115 L 180 145 Z" fill="#FFFFFF" stroke="#0A1638" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="72,143 120,121 168,143" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />

      {/* Architrave bar */}
      <rect x="62" y="145" width="116" height="7" fill="#FFFFFF" stroke="#0A1638" strokeWidth="1.5" />

      {/* Pillars */}
      {[70, 95, 120, 145, 170].map((x, i) => (
        <g key={i}>
          {/* Pillar cap */}
          <rect x={x - 4} y="152" width="8" height="3" fill="#0A1638" />
          {/* Shaft */}
          <line x1={x} y1="155" x2={x} y2="192" stroke="#0A1638" strokeWidth="2" />
          {/* Base */}
          <rect x={x - 4} y="192" width="8" height="3" fill="#0A1638" />
        </g>
      ))}

      {/* Main steps / podium */}
      <rect x="52" y="195" width="136" height="5" fill="#F1F5F9" stroke="#0A1638" strokeWidth="1.5" />
      <rect x="42" y="200" width="156" height="5" fill="#E2E8F0" stroke="#0A1638" strokeWidth="1.5" />

      {/* Verified seal badge on the portico */}
      <g transform="translate(120, 134)">
        <circle cx="0" cy="0" r="6" fill="#0D9488" />
        <path d="M -2.5 0 L -0.5 2 L 3 -1.5" stroke="#FFFFFF" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}

export function IllustrationEmptyState({ className = 'w-40 h-40', ariaLabel = 'No items in folder' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <circle cx="100" cy="100" r="82" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      
      {/* Portfolio Folder */}
      <path
        d="M 50 78 L 78 78 L 88 88 L 150 88 C 154 88 157 91 157 95 L 157 140 C 157 144 154 147 150 147 L 50 147 C 46 147 43 144 43 140 L 43 85 C 43 81 46 78 50 78 Z"
        fill="#FFFFFF"
        stroke="#0A1638"
        strokeWidth="1.75"
      />
      {/* Folder Tab inner paper */}
      <rect x="58" y="70" width="70" height="24" rx="3" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.25" strokeDasharray="3 3" />
      
      {/* Drafting Ruler / Scale */}
      <rect x="48" y="125" width="104" height="14" rx="2" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.25" />
      {[58, 68, 78, 88, 98, 108, 118, 128, 138, 148].map((x, i) => (
        <line key={i} x1={x} y1="125" x2={x} y2={i % 2 === 0 ? "132" : "129"} stroke="#0D9488" strokeWidth="1" />
      ))}

      {/* Guiding star accent */}
      <path d="M 145 65 L 146.5 69 L 150.5 70.5 L 146.5 72 L 145 76 L 143.5 72 L 139.5 70.5 L 143.5 69 Z" fill="#2563EB" />
      <circle cx="60" cy="55" r="2.5" fill="#CBD5E1" />
    </svg>
  );
}

export function IllustrationNoResults({ className = 'w-40 h-40', ariaLabel = 'Search yielded no matches' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <circle cx="100" cy="100" r="82" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* Optical Loupe / Research Prism */}
      <circle cx="92" cy="90" r="38" fill="#FFFFFF" stroke="#0A1638" strokeWidth="2" />
      <circle cx="92" cy="90" r="30" stroke="#2563EB" strokeWidth="1.25" strokeDasharray="3 4" opacity="0.6" />

      {/* Handle */}
      <path
        d="M 120 118 L 152 150 C 154 152 154 156 152 158 C 150 160 146 160 144 158 L 112 126"
        stroke="#0A1638"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Clean dispersion line through prism */}
      <line x1="72" y1="90" x2="112" y2="90" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="92" cy="90" r="4" fill="#0D9488" />

      {/* Small question or target dot */}
      <circle cx="140" cy="62" r="3" fill="#2563EB" opacity="0.6" />
      <circle cx="58" cy="132" r="2" fill="#94A3B8" />
    </svg>
  );
}

export function IllustrationSkillGrowth({ className = 'w-48 h-48', ariaLabel = 'Personalized skill roadmap timeline' }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Subtle frame */}
      <rect x="20" y="20" width="200" height="200" rx="14" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* Stepped milestone blocks: Learn -> Practise -> Build -> Prepare -> Review */}
      {/* Step 1: Learn */}
      <rect x="35" y="160" width="30" height="40" rx="4" fill="#FFFFFF" stroke="#0A1638" strokeWidth="1.5" />
      <line x1="42" y1="172" x2="58" y2="172" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="180" x2="54" y2="180" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />

      {/* Step 2: Practise */}
      <rect x="72" y="135" width="30" height="65" rx="4" fill="#FFFFFF" stroke="#0A1638" strokeWidth="1.5" />
      <circle cx="87" cy="150" r="5" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5" />
      <line x1="79" y1="168" x2="95" y2="168" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="79" y1="176" x2="92" y2="176" stroke="#CBD5E1" strokeWidth="1.5" />

      {/* Step 3: Build a Project */}
      <rect x="109" y="105" width="30" height="95" rx="4" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.75" />
      {/* Code / project brackets */}
      <path d="M 120 125 L 116 130 L 120 135 M 128 125 L 132 130 L 128 135" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="116" y1="152" x2="132" y2="152" stroke="#2563EB" strokeWidth="1.5" />
      <line x1="116" y1="162" x2="128" y2="162" stroke="#93C5FD" strokeWidth="1.5" />

      {/* Step 4: Prepare */}
      <rect x="146" y="75" width="30" height="125" rx="4" fill="#FFFFFF" stroke="#0A1638" strokeWidth="1.5" />
      <path d="M 156 95 L 160 99 L 167 92" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="153" y1="115" x2="169" y2="115" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="153" y1="125" x2="165" y2="125" stroke="#CBD5E1" strokeWidth="1.5" />

      {/* Step 5: Review & Launch */}
      <rect x="183" y="45" width="30" height="155" rx="4" fill="#FFFFFF" stroke="#0A1638" strokeWidth="1.5" />
      {/* Launch flag / star */}
      <path d="M 198 62 L 200 67 L 205 68.5 L 200 70 L 198 75 L 196 70 L 191 68.5 L 196 67 Z" fill="#0D9488" />
      <line x1="190" y1="90" x2="206" y2="90" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="190" y1="100" x2="203" y2="100" stroke="#CBD5E1" strokeWidth="1.5" />

      {/* Growth curve line with milestone dots */}
      <path
        d="M 40 150 Q 110 95, 198 40"
        stroke="#0D9488"
        strokeWidth="2"
        strokeDasharray="4 4"
        fill="none"
      />
    </svg>
  );
}

