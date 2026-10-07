import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Check, Globe, Compass, GraduationCap, Wallet,
  Languages, Target, MapPin, ExternalLink, Scale, Info, AlertTriangle,
  Award, Building2, ChevronDown, ChevronUp, X, Sparkles, Search,
  SlidersHorizontal, ShieldCheck, Clock, BookOpen, Briefcase
} from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { useUser } from '../context/UserContext';
import { useScrollTop } from '../hooks/useLocalStorage';
import globalStudyHeroImage from '../assets/images/global_study_hero_landmarks_1789742691121.jpg';
import GlobalStudyMapGallery from '../components/GlobalStudyMapGallery';
import { COUNTRIES, UNIVERSITIES, BUDGET_RANGES, FX, annualCostINR, degreeCostINR } from '../data/studyAbroad.js';
import { rankCountries, getBudgetMax } from '../data/studyAbroadEngine.js';
import { useSubscription } from '../hooks/useSubscription';
import UpgradeModal from '../components/UpgradeModal';
import LockedFeature from '../components/LockedFeature';
import {
  getScholarshipCountriesWithData,
  getAbroadScholarshipsByCountry,
} from '../data/scholarships.js';
import GatedOfficialLink from '../components/GatedOfficialLink';

const COUNTRY_HIGHLIGHTS = {
  usa: { tag: '36-Mo STEM OPT · World’s #1 Tech Ecosystem', badgeClass: 'bg-blue-50 text-blue-800 border-blue-200' },
  uk: { tag: '1-Year Master’s · 2-Year Graduate Route', badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  canada: { tag: 'Up to 3-Year PGWP · Co-op Programs', badgeClass: 'bg-rose-50 text-rose-800 border-rose-200' },
  australia: { tag: '2–4 Year Post-Study · 48h/Fortnight Work', badgeClass: 'bg-amber-50 text-amber-900 border-amber-200' },
  germany: { tag: 'Zero / Low Public Tuition · Industrial Powerhouse', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  france: { tag: 'Grandes Écoles · 12-Month APS & EU Mobility', badgeClass: 'bg-purple-50 text-purple-800 border-purple-200' },
  netherlands: { tag: 'Largest English Breadth in EU · 1-Yr Zoekjaar', badgeClass: 'bg-orange-50 text-orange-900 border-orange-200' },
  italy: { tag: 'Low Tuition · Global Design & Automotive Capital', badgeClass: 'bg-teal-50 text-teal-800 border-teal-200' },
  ireland: { tag: 'EMEA Big Tech HQ · 2-Year Third Level Route', badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
  sweden: { tag: 'Sustainability Pioneer · Full-Time Work Allowed', badgeClass: 'bg-cyan-50 text-cyan-900 border-cyan-200' },
  norway: { tag: 'Energy & Maritime Leader · 1-Year Job Search', badgeClass: 'bg-sky-50 text-sky-900 border-sky-200' },
  belgium: { tag: 'EU Capital · Moderate Tuition & Biotech Hub', badgeClass: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
  spain: { tag: 'Affordable Living & Tuition · Tech & Tourism', badgeClass: 'bg-red-50 text-red-800 border-red-200' },
  poland: { tag: 'Fast-Growing Tech Hub · High Value for Money', badgeClass: 'bg-slate-50 text-slate-800 border-slate-200' },
  latvia: { tag: 'Lowest Entry Cost in EU · Recognized European Degrees', badgeClass: 'bg-stone-50 text-stone-800 border-stone-200' },
  malaysia: { tag: 'Lowest Cost in Asia · Semiconductor & Branch Campuses', badgeClass: 'bg-blue-50 text-blue-900 border-blue-200' },
  singapore: { tag: 'World Top 10 Unis · 5 Hrs from India · FinTech Hub', badgeClass: 'bg-red-50 text-red-800 border-red-200' },
  uae: { tag: 'Global Business Hub · International Branch Campuses · Tax-Free', badgeClass: 'bg-amber-50 text-amber-900 border-amber-200' },
};

// ── Step config ──────────────────────────────────────────
const STEPS = [
  { id: 'studyLevel', label: 'PROFILE', title: 'What are you planning to study?' },
  { id: 'academic', label: 'PROFILE', title: 'Your academic background' },
  { id: 'goal', label: 'GOAL', title: 'What do you want this degree to lead to?' },
  { id: 'budget', label: 'BUDGET', title: 'What is your realistic total study budget?' },
  { id: 'priority', label: 'PRIORITY', title: 'What matters most in your decision?' },
  { id: 'language', label: 'LANGUAGE', title: 'How comfortable are you studying in a non-English environment?' },
  { id: 'preferences', label: 'PREFERENCES', title: 'Any preferences to shape your plan?' },
];

const studyLevels = ["Bachelor's after Class 12","Master's after graduation","MBA / Management","Healthcare / Medicine","PhD / Research","I'm still exploring"];
const goals = [
  'Software Engineering','AI / Machine Learning','Data Science','Cybersecurity',
  'Mechanical','Automotive','Electrical / Electronics','Civil','Aerospace',
  'Finance','Consulting','Business Analytics',
  'Medicine','Nursing','Biotechnology',
  'Design','Architecture','Fashion','UX/UI',
  'Renewable Energy / Sustainability','Not sure yet',
];
const prioritiesList = [
  { id:'cost', label:'Lower total cost' },
  { id:'employment', label:'Strong employment opportunities' },
  { id:'post-study', label:'Strong post-study work options' },
  { id:'immigration', label:'Long-term immigration pathway' },
  { id:'reputation', label:'Top university / academic reputation' },
  { id:'scholarship', label:'Scholarships' },
  { id:'research', label:'Research opportunities' },
  { id:'english', label:'English-taught study' },
  { id:'duration', label:'Shorter degree duration' },
];
const languageOpts = [
  { id:'english-only', label:'English only', desc:'Prefer to study and work in English' },
  { id:'comfortable', label:'Comfortable learning the local language', desc:'Willing to learn German / French / etc.' },
  { id:'already', label:'Already know another language', desc:'German, French, Spanish, etc.' },
  { id:'no-pref', label:'No preference', desc:'Language is not a constraint' },
];
const prefOpts = ['Big city','Smaller student city','Research-focused','Industry-focused','Flexible'];

// ── Helpers ───────────────────────────────────────────────
function flagFromCode(code){
  if(!code || code.length!==2) return '🏳️';
  const A = 0x1F1E6;
  return String.fromCodePoint(...[...code.toUpperCase()].map(ch=> A + ch.charCodeAt(0)-65));
}
function flagForCountry(c){ return c?.code ? flagFromCode(c.code) : '🏳️'; }
function FlagLogo({ code, size=20 }){
  if(!code || code.length!==2) return <span aria-hidden="true" className="inline-flex w-5 h-3.5 rounded-sm bg-paper border border-line shrink-0" />;
  const lc = code.toLowerCase();
  return <img src={`https://flagcdn.com/w${size}/${lc}.png`} srcSet={`https://flagcdn.com/w40/${lc}.png 2x`} alt="" aria-hidden="true" width={size} height={Math.round(size*0.75)} className="w-5 h-3.5 rounded-sm object-cover border border-line/60 shrink-0 shadow-sm" loading="lazy" decoding="async" onError={(e)=>{ e.currentTarget.style.display='none'; e.currentTarget.nextSibling && (e.currentTarget.nextSibling.style.display='inline'); }} />;
}
function Pill({ children }) { return <span className="inline-flex items-center rounded-full bg-paper border border-line px-2.5 py-1 text-xs font-medium text-ink-2">{children}</span>; }
function SourceBadge({ url, date }) {
  return <span className="inline-flex items-center gap-1 text-[0.7rem] text-ink-3"><Info className="w-3 h-3"/>{date} · <GatedOfficialLink url={url} linkLabel="Official source" section="study_abroad" className="underline hover:text-ink">source</GatedOfficialLink></span>;
}

function Choice({ selected, onClick, label, desc, multi }) {
  return (
    <button type="button" role={multi?'checkbox':'radio'} aria-checked={selected} onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl border flex items-start gap-3 transition-all ${selected?'border-brand-500 bg-brand-500 text-white shadow-brand':'border-line bg-surface hover:border-brand-300 hover:shadow-sm text-ink'}`}>
      <span className={`mt-0.5 w-5 h-5 shrink-0 flex items-center justify-center border-2 ${multi?'rounded-md':'rounded-full'} ${selected?'bg-white border-white':'border-line-strong bg-transparent'}`}>
        {selected && (multi ? <Check className="w-3 h-3" style={{color:'#2563eb'}} strokeWidth={3}/> : <span className="w-2.5 h-2.5 rounded-full" style={{background:'#2563eb'}}/>)}
      </span>
      <span className="flex flex-col"><span className={`text-sm font-medium ${selected?'text-white':'text-ink'}`}>{label}</span>{desc && <span className={`text-xs mt-0.5 ${selected?'text-white/80':'text-ink-3'}`}>{desc}</span>}</span>
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────
export default function StudyAbroad(){
  useScrollTop();
  const navigate = useNavigate();
  const { answers: navAnswers } = useUser();
  const [view, setView] = useState('landing'); // landing | quiz | results | compare | universities | plan
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState('right');
  const headingRef = useRef(null);
  const [compareIds, setCompareIds] = useState([]);
  const [uniCompare, setUniCompare] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [expandedCountryId, setExpandedCountryId] = useState(null);
  // Scholarships for Indian students — filters
  const [schCountry, setSchCountry] = useState('all');
  const [schLevel, setSchLevel] = useState('all');
  const [schFullOnly, setSchFullOnly] = useState(false);
  const [schOpenId, setSchOpenId] = useState(null);
  const { isPro, plan } = useSubscription();
  const [upgradeFeature, setUpgradeFeature] = useState(null);
  const countryLimit = plan.country_compare_limit;
  const uniLimit = plan.university_compare_limit || 0;

  // Canonical entitlement guards (display only — backend enforces where APIs exist).
  const addCountry = (id) => {
    if (compareIds.includes(id)) { setCompareIds(compareIds.filter((x) => x !== id)); return; }
    if (compareIds.length >= countryLimit) { setUpgradeFeature('country_compare'); return; }
    setCompareIds([...compareIds, id]);
  };
  const addUni = (id) => {
    if (uniCompare.includes(id)) { setUniCompare(uniCompare.filter((x) => x !== id)); return; }
    if (uniCompare.length >= uniLimit) { setUpgradeFeature('university_compare'); return; }
    setUniCompare([...uniCompare, id]);
  };

  // Pre-fill from NAVORA profile if exists
  const inferredLevel = useMemo(()=>{
    const s = String(navAnswers?.stream || navAnswers?.streamV2 || '').toLowerCase();
    if(['mpc','bipc','cec','mec','commerce','arts'].includes(s)) return "Bachelor's after Class 12";
    if(navAnswers?.degree || navAnswers?.gradDegree) return "Master's after graduation";
    return '';
  },[navAnswers]);

  const [form, setForm] = useState({
    studyLevel: inferredLevel,
    stream: navAnswers?.stream || navAnswers?.streamV2 || '',
    marks: '',
    degree: '',
    goal: '',
    budgetId: '',
    priorities: [],
    language: '',
    preferences: '',
    optimize: 'Best overall fit',
  });
  const [errors, setErrors] = useState({});

  useEffect(()=>{ window.scrollTo({top:0,behavior:'auto'}); const t=setTimeout(()=>headingRef.current?.focus(),300); return()=>clearTimeout(t); },[step,view]);

  const totalSteps = STEPS.length;
  const current = STEPS[step];

  const results = useMemo(()=>{
    if(view!=='results' && view!=='compare' && view!=='universities' && view!=='plan') return [];
    return rankCountries({ studyLevel: form.studyLevel, goal: form.goal, budgetId: form.budgetId, budgetMaxINR: getBudgetMax(form.budgetId), priorities: form.priorities, language: form.language });
  },[view, form]);

  const validate = ()=>{
    const id = current.id;
    if(id==='studyLevel' && !form.studyLevel) return 'Please select your study level';
    if(id==='academic'){
      // light validation — stream/marks optional but encourage
      if(form.studyLevel==="Bachelor's after Class 12" && !form.stream) return 'Select your stream or choose exploring';
      return null;
    }
    if(id==='goal' && !form.goal) return 'Please choose a direction (or Not sure yet)';
    if(id==='budget' && !form.budgetId) return 'Please select a budget range';
    if(id==='priority' && form.priorities.length===0) return 'Choose 1–3 priorities';
    if(id==='priority' && form.priorities.length>3) return 'Please choose up to 3';
    if(id==='language' && !form.language) return 'Please select a language comfort level';
    return null;
  };

  const next = ()=>{
    const msg = validate();
    if(msg){ setErrors({[current.id]:msg}); return; }
    setErrors({});
    if(step < totalSteps-1){ setDir('right'); setStep(s=>s+1); }
    else setView('results');
  };
  const back = ()=>{
    if(view==='quiz' && step>0){ setDir('left'); setStep(s=>s-1); }
    else if(view==='quiz' && step===0) setView('landing');
    else if(view==='explore') setView('landing');
    else if(view==='scholarships') setView('landing');
    else if(view==='results') { setView('quiz'); setStep(totalSteps-1); }
    else if(view==='compare' || view==='universities' || view==='plan') setView('results');
  };

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => {
      if (selectedRegion !== 'all' && c.region !== selectedRegion) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = c.name.toLowerCase().includes(q);
        const matchCode = c.code.toLowerCase().includes(q);
        const matchRegion = c.region.toLowerCase().includes(q);
        const matchCareers = c.careerStrengths?.some(s => s.toLowerCase().includes(q));
        const matchStudies = c.studyStrengths?.some(s => s.toLowerCase().includes(q));
        const matchCurrency = c.currency?.toLowerCase().includes(q);
        const matchCity = c.cityNote?.toLowerCase().includes(q);
        const matchUnis = UNIVERSITIES.some(u => u.countryId === c.id && (u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q)));
        return matchName || matchCode || matchRegion || matchCareers || matchStudies || matchCurrency || matchCity || matchUnis;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'cost_asc') return annualCostINR(a) - annualCostINR(b);
      if (sortBy === 'tuition_asc') {
        const rateA = FX[a.currency] || 83;
        const rateB = FX[b.currency] || 83;
        const minA = a.tuitionRange.min * rateA;
        const minB = b.tuitionRange.min * rateB;
        return minA - minB;
      }
      if (sortBy === 'work_desc') {
        const getDurMonths = (str) => {
          if (!str) return 0;
          if (str.includes('36') || str.includes('3 years') || str.includes('Up to 3')) return 36;
          if (str.includes('2–4') || str.includes('2-4')) return 36;
          if (str.includes('2 years') || str.includes('24')) return 24;
          if (str.includes('18')) return 18;
          if (str.includes('12') || str.includes('1 year') || str.includes('1-yr')) return 12;
          if (str.includes('9')) return 9;
          if (str.includes('6')) return 6;
          return 12;
        };
        return getDurMonths(b.postStudyDuration) - getDurMonths(a.postStudyDuration);
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [selectedRegion, searchQuery, sortBy]);

  const togglePriority = (id)=>{
    setForm(f=>{
      const has=f.priorities.includes(id);
      let next;
      if(has) next=f.priorities.filter(x=>x!==id);
      else {
        if(f.priorities.length>=3) return f;
        next=[...f.priorities,id];
      }
      return {...f, priorities:next};
    });
  };

  // ── Render helpers per step
  const renderStep = ()=>{
    const id=current.id;
    if(id==='studyLevel'){
      return <div className="grid sm:grid-cols-2 gap-2.5">{studyLevels.map(l=><Choice key={l} label={l} selected={form.studyLevel===l} onClick={()=>setForm(f=>({...f,studyLevel:l}))}/>)}</div>;
    }
    if(id==='academic'){
      const isBach = form.studyLevel==="Bachelor's after Class 12";
      return (
        <div className="space-y-5">
          {form.studyLevel && <div className="inline-flex items-center gap-2 text-xs bg-brand-50 border border-brand-100 text-brand-700 rounded-full px-3 py-1.5">Using your NAVORA profile — <button onClick={()=>setForm(f=>({...f,studyLevel:''}))} className="underline font-semibold">Edit</button></div>}
          {isBach ? (
            <>
              <div>
                <p className="text-sm font-medium text-ink mb-2">Current / finished stream</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{['MPC','BiPC','CEC','MEC','Commerce','Arts','Diploma','Not sure'].map(s=><button key={s} onClick={()=>setForm(f=>({...f,stream:s}))} className={`px-3 py-2.5 rounded-xl border text-sm font-medium ${form.stream===s?'bg-brand-500 text-white border-brand-500':'bg-surface border-line hover:border-brand-200'}`}>{s}</button>)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-ink mb-2">Expected / actual performance</p>
                <div className="flex flex-wrap gap-2">{['90%+','75–89%','60–74%','Below 60%','CGPA 8+','CGPA 7–8'].map(m=><button key={m} onClick={()=>setForm(f=>({...f,marks:m}))} className={`px-3 py-2 rounded-full border text-sm ${form.marks===m?'bg-ink text-white border-ink':'bg-surface border-line'}`}>{m}</button>)}</div>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-ink mb-2">Degree & specialization</p>
                <input value={form.degree} onChange={e=>setForm(f=>({...f,degree:e.target.value}))} placeholder="e.g. B.Tech Mechanical, B.Com, BSc CS" className="w-full px-4 py-3 rounded-xl border border-line bg-surface text-sm focus:outline-none focus:border-brand-400"/>
              </div>
              <div>
                <p className="text-sm font-medium text-ink mb-2">CGPA / Percentage</p>
                <div className="flex flex-wrap gap-2">{['8.5+','7.5–8.5','6.5–7.5','Below 6.5','75%+','60–74%'].map(m=><button key={m} onClick={()=>setForm(f=>({...f,marks:m}))} className={`px-3 py-2 rounded-full border text-sm ${form.marks===m?'bg-ink text-white border-ink':'bg-surface border-line'}`}>{m}</button>)}</div>
              </div>
              {form.studyLevel==='Healthcare / Medicine' && <p className="text-xs text-warning flex gap-1.5"><AlertTriangle className="w-4 h-4 shrink-0"/>Medicine requires recognition & licensing checks — we surface this in your matches.</p>}
            </>
          )}
        </div>
      );
    }
    if(id==='goal'){
      return (
        <div>
          <div className="grid sm:grid-cols-2 gap-2.5">{goals.map(g=><Choice key={g} label={g} selected={form.goal===g} onClick={()=>setForm(f=>({...f,goal:g}))}/>)}</div>
          {form.goal==='Not sure yet' && <p className="mt-3 text-sm text-ink-2 bg-paper border border-line rounded-xl px-4 py-3">No problem — we will show a broad fit and route you to course discovery. Your budget and priorities still shape the match.</p>}
        </div>
      );
    }
    if(id==='budget'){
      return (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-2.5">{BUDGET_RANGES.map(b=><Choice key={b.id} label={b.label} desc={b.id==='unsure'?'We estimate from your profile': b.maxINR?`Up to ₹${(b.maxINR/100000).toFixed(0)}L` : ''} selected={form.budgetId===b.id} onClick={()=>setForm(f=>({...f,budgetId:b.id}))}/>)}</div>
          <p className="text-xs text-ink-3">Total cost = tuition + living for the full degree. Ranges, not fee promises.</p>
        </div>
      );
    }
    if(id==='priority'){
      return (
        <div>
          <div className="grid sm:grid-cols-2 gap-2.5">{prioritiesList.map(p=><Choice key={p.id} multi label={p.label} selected={form.priorities.includes(p.id)} onClick={()=>togglePriority(p.id)}/>)}</div>
          <p className="mt-2 text-xs text-ink-3">Selected {form.priorities.length} of 3 — choose the 2–3 that truly drive your decision.</p>
        </div>
      );
    }
    if(id==='language'){
      return <div className="space-y-2.5">{languageOpts.map(o=><Choice key={o.id} label={o.label} desc={o.desc} selected={form.language===o.id} onClick={()=>setForm(f=>({...f,language:o.id}))}/>)}</div>;
    }
    if(id==='preferences'){
      return (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-ink mb-2">Campus / city preference</p>
            <div className="flex flex-wrap gap-2">{prefOpts.map(p=><button key={p} onClick={()=>setForm(f=>({...f,preferences:p}))} className={`px-4 py-2 rounded-full border text-sm font-medium ${form.preferences===p?'bg-brand-500 text-white border-brand-500':'bg-surface border-line hover:border-brand-200'}`}>{p}</button>)}</div>
          </div>
          <div>
            <p className="text-sm font-medium text-ink mb-2">Optimize for (optional)</p>
            <div className="flex flex-wrap gap-2">{['Best overall fit','Best value','Best career opportunity','Lowest financial risk','Strongest post-study opportunity'].map(o=><button key={o} onClick={()=>setForm(f=>({...f,optimize:o}))} className={`px-3 py-2 rounded-full border text-xs font-medium ${form.optimize===o?'bg-ink text-white border-ink':'bg-paper border-line'}`}>{o}</button>)}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  // ── Landing ────────────────────────────────────────────
  if(view==='landing'){
    return (
      <div className="bg-surface">
        {/* Hero — editorial, calm, premium with photo background */}
        <section className="relative overflow-hidden border-b border-line min-h-[580px] lg:min-h-[640px] flex items-center">
          {/* Background photo covering the section */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={globalStudyHeroImage}
              alt="Global study destinations: USA, UK, Canada, Singapore"
              className="w-full h-full object-cover object-[center_35%] scale-[1.01]"
              referrerPolicy="no-referrer"
            />
            {/* Light, balanced scrim: allows landmarks, waters, and skylines to be vividly visible while keeping text legible */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-slate-950/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-black/10" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 lg:py-24 w-full">
            <div className="max-w-2xl lg:max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md border border-white/60 px-4 py-1.5 shadow-md mb-6">
                <Logo size="sm" />
                <span className="eyebrow text-brand-800 font-semibold">Global Study · Premium Consultancy</span>
              </span>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase text-brand-100 border border-white/25 rounded-full px-3 py-1 bg-slate-950/40 backdrop-blur-md shadow-xs">LEARN · EXPLORE · DECIDE · GROW</span>
              </div>
              <h1 className="font-ui font-bold text-[2.6rem] sm:text-5xl lg:text-[3.5rem] leading-[1.04] tracking-[-0.03em] text-white drop-shadow-md text-balance">
                Global Study<br/>
                <span className="font-display italic font-medium text-brand-300 drop-shadow-sm">with clarity.</span>
              </h1>
              <p className="mt-5 text-[1.1rem] sm:text-[1.18rem] text-slate-100 drop-shadow leading-relaxed max-w-2xl">
                Compare countries, courses, costs, universities and post-study opportunities — based on <em className="text-white font-semibold underline decoration-brand-400 decoration-2 underline-offset-4">your</em> profile. Not a directory. A decision.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button onClick={()=>setView('quiz')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-ui font-semibold px-7 py-3.5 shadow-xl shadow-brand-950/40 transition-all hover:-translate-y-px">
                  Build my study plan <ArrowRight className="w-4 h-4"/>
                </button>
                <button onClick={()=>setView('explore')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/30 text-white backdrop-blur-md font-ui font-semibold px-7 py-3.5 shadow-md transition-all hover:-translate-y-px">
                  <Globe className="w-4 h-4 text-brand-300"/> Explore countries
                </button>
                <button onClick={()=>setView('scholarships')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/30 text-white backdrop-blur-md font-ui font-semibold px-7 py-3.5 shadow-md transition-all hover:-translate-y-px">
                  <Award className="w-4 h-4 text-amber-300"/> Scholarships for Indians
                </button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-200">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/40 backdrop-blur-sm border border-white/10"><Check className="w-3.5 h-3.5 text-emerald-400"/> ~6–8 questions</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/40 backdrop-blur-sm border border-white/10"><Check className="w-3.5 h-3.5 text-emerald-400"/> Uses your NAVORA profile</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/40 backdrop-blur-sm border border-white/10"><Check className="w-3.5 h-3.5 text-emerald-400"/> No spam, no agents</span>
              </div>
            </div>
          </div>
        </section>

        {/* Website-ready interactive map layouts and banner variations */}
        <GlobalStudyMapGallery
          onExploreCountry={(countryId) => {
            const country = COUNTRIES.find(c => c.id === countryId);
            if (country) {
              setSelectedRegion(country.region);
              setExpandedCountryId(country.id);
              setView('explore');
            }
          }}
          onStartQuiz={() => setView('quiz')}
        />

        {/* How it works — McKinsey clarity */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-16">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="eyebrow text-brand-600 mb-3">How it works</p>
              <h2 className="font-ui font-bold text-3xl text-ink tracking-[-0.03em]">Seven questions.<br/>One clear plan.</h2>
              <p className="mt-4 text-ink-2 leading-relaxed">Every question changes the recommendation. Nothing generic. If NAVORA already knows your stream or degree, we reuse it.</p>
              <button onClick={()=>setView('quiz')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink text-white font-semibold px-5 py-3 hover:bg-brand-950 transition-colors">Start now <ArrowRight className="w-4 h-4"/></button>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-3 gap-3">
              {[
                { n:'01', k:'PROFILE', d:'Study level & academic background' },
                { n:'02', k:'GOAL', d:'Career direction & course fit' },
                { n:'03', k:'BUDGET', d:'Total cost — tuition + living' },
                { n:'04', k:'PRIORITY', d:'2–3 trade-offs you care about' },
                { n:'05', k:'LANGUAGE', d:'English-only vs open to local' },
                { n:'06', k:'PREFERENCE', d:'City, focus & optimization' },
              ].map(s=>(
                <div key={s.n} className="bg-white border border-line rounded-2xl p-5 card-lift">
                  <span className="font-display italic text-brand-500 text-xl">{s.n}</span>
                  <p className="eyebrow text-ink mt-3">{s.k}</p>
                  <p className="text-sm text-ink-2 mt-1 leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
          <p className="text-xs text-ink-3 leading-relaxed text-center max-w-3xl mx-auto">Tuition fees, living costs, admission requirements and immigration rules can change. NAVORA provides decision-support information based on available sources and does not guarantee admission, employment, visa approval or immigration outcomes. Always verify final requirements with the university and relevant government authority.</p>
        </div>
      </div>
    );
  }

  // ── Explore Countries ──────────────────────────────────
  if(view === 'explore'){
    return (
      <div className="bg-paper min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink mb-6">
            <ArrowLeft className="w-4 h-4"/> Back to Global Study Overview
          </button>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="eyebrow text-brand-600">NAVORA Global Directory</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">{COUNTRIES.length} Destinations Verified</span>
              </div>
              <h1 className="font-ui font-bold text-3xl sm:text-[2.2rem] text-ink tracking-[-0.03em]">
                Explore Countries & Study Destinations
              </h1>
              <p className="mt-2 text-ink-2 text-sm leading-relaxed max-w-3xl">
                Unvarnished, verified data on tuition costs, actual living expenses, official visa proof of funds, post-study work routes, and premier universities across 15 destinations.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {compareIds.length > 0 && (
                <button onClick={() => setView('compare')} className="inline-flex items-center gap-2 rounded-xl bg-white border border-brand-200 text-brand-700 px-4 py-2.5 text-sm font-semibold hover:bg-brand-50 transition-colors shadow-xs">
                  <Scale className="w-4 h-4 text-brand-600"/> Compare Selected ({compareIds.length})
                </button>
              )}
              <button onClick={() => setView('quiz')} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 text-sm font-semibold shadow-brand transition-all">
                <Compass className="w-4 h-4"/> Build My Study Plan
              </button>
            </div>
          </div>

          {/* Search, Filter and Sort Controls */}
          <div className="bg-white border border-line rounded-2xl p-5 shadow-card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search Bar */}
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by country, major (e.g. CS, Mechanical, Finance), or city..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-line bg-paper text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Region Filter Tabs */}
              <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
                {[
                  { id: 'all', label: `All (${COUNTRIES.length})` },
                  { id: 'Europe', label: `Europe (${COUNTRIES.filter(c=>c.region==='Europe').length})` },
                  { id: 'Asia', label: `Asia (${COUNTRIES.filter(c=>c.region==='Asia').length})` },
                  { id: 'Middle East', label: `Middle East (${COUNTRIES.filter(c=>c.region==='Middle East').length})` },
                  { id: 'North America', label: `North America (${COUNTRIES.filter(c=>c.region==='North America').length})` },
                  { id: 'Oceania', label: `Oceania (${COUNTRIES.filter(c=>c.region==='Oceania').length})` },
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRegion(r.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selectedRegion === r.id
                        ? 'bg-brand-500 text-white shadow-xs'
                        : 'bg-paper text-ink-2 hover:bg-paper/80 border border-line/60'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div className="md:col-span-2 flex items-center justify-end">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full text-xs font-medium text-ink bg-paper border border-line rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
                >
                  <option value="default">Sort: Default</option>
                  <option value="cost_asc">Lowest Total Cost (₹)</option>
                  <option value="tuition_asc">Lowest Tuition</option>
                  <option value="work_desc">Longest Post-Study Work</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-line/60 flex items-center justify-between text-xs text-ink-3">
              <span>Showing <b>{filteredCountries.length}</b> of {COUNTRIES.length} destinations</span>
              {(searchQuery || selectedRegion !== 'all' || sortBy !== 'default') && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedRegion('all'); setSortBy('default'); }}
                  className="text-brand-700 hover:text-brand-800 font-semibold"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>

          {/* Countries List */}
          {filteredCountries.length === 0 ? (
            <div className="bg-white border border-line rounded-2xl p-12 text-center">
              <Globe className="w-10 h-10 text-ink-3 mx-auto mb-3" />
              <h3 className="font-ui font-semibold text-lg text-ink">No countries match your search</h3>
              <p className="text-ink-2 text-sm mt-1 max-w-md mx-auto">Try searching for a different term like &quot;Germany&quot;, &quot;Engineering&quot;, or reset your filters.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedRegion('all'); setSortBy('default'); }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold hover:bg-brand-100"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCountries.map(c => {
                const isExpanded = expandedCountryId === c.id;
                const isCompared = compareIds.includes(c.id);
                const hl = COUNTRY_HIGHLIGHTS[c.id];
                const annualINR = annualCostINR(c);
                const degree2YrINR = degreeCostINR(c, 2);
                const rate = FX[c.currency] || 83;
                const tuitionMid = (c.tuitionRange.min + c.tuitionRange.max) / 2;
                const tuitionINR = (tuitionMid * rate) / 100000;
                const livingMid = (c.monthlyLivingCost.min + c.monthlyLivingCost.max) / 2;
                const livingINR = (livingMid * rate) / 1000;
                const unis = UNIVERSITIES.filter(u => u.countryId === c.id);

                return (
                  <div
                    key={c.id}
                    id={`country-${c.id}`}
                    className={`bg-white border rounded-[1.4rem] p-6 sm:p-7 shadow-card transition-all ${
                      isCompared ? 'ring-1 ring-brand-300 border-brand-200' : 'border-line hover:border-brand-200'
                    }`}
                  >
                    {/* Country Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-line">
                      <div className="flex items-center gap-3.5">
                        <FlagLogo code={c.code} size={32} />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-ui font-bold text-2xl text-ink">
                              {c.name}
                            </h2>
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-paper border border-line text-ink-2">
                              {c.region}
                            </span>
                            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-paper border border-line text-ink-3">
                              {c.currency} (1 {c.currency} ≈ ₹{rate})
                            </span>
                          </div>
                          {hl && (
                            <p className={`mt-1.5 inline-block text-xs font-semibold px-2.5 py-0.5 rounded-md border ${hl.badgeClass}`}>
                              {hl.tag}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addCountry(c.id)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            isCompared
                              ? 'bg-brand-50 border-brand-300 text-brand-700'
                              : 'bg-white border-line text-ink-2 hover:border-brand-300'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          {isCompared ? `In Compare (${compareIds.length}/${countryLimit})` : '+ Add to Compare'}
                        </button>
                        <button
                          onClick={() => {
                            setForm(f => ({
                              ...f,
                              budgetId: f.budgetId || '25-40',
                              goal: c.careerStrengths[0] || 'Software Engineering',
                              preferences: c.region === 'Europe' ? 'Industry-focused' : 'Flexible',
                            }));
                            setView('quiz');
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-colors shadow-xs"
                        >
                          Plan for {c.name} <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Financial Matrix (3 columns) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-5">
                      <div className="bg-paper rounded-xl p-4 border border-line/70">
                        <span className="text-[0.7rem] uppercase tracking-wider font-semibold text-ink-3">Estimated Total Annual Cost</span>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="font-ui font-bold text-2xl text-ink">
                            ₹{(annualINR / 100000).toFixed(1)} Lakh
                          </span>
                          <span className="text-xs text-ink-3">/ year</span>
                        </div>
                        <p className="text-xs text-ink-2 mt-1">
                          Tuition + living combined · ≈ <b>₹{(degree2YrINR / 100000).toFixed(0)}L</b> 2-year degree
                        </p>
                      </div>

                      <div className="bg-paper rounded-xl p-4 border border-line/70">
                        <span className="text-[0.7rem] uppercase tracking-wider font-semibold text-ink-3">Tuition Fee Range</span>
                        <div className="mt-1">
                          <span className="font-ui font-bold text-lg text-ink">
                            {c.tuitionRange.min === 0 ? 'Free (Public)' : `${c.currency} ${c.tuitionRange.min.toLocaleString()} – ${c.tuitionRange.max.toLocaleString()}`}
                          </span>
                          <span className="text-xs text-ink-3"> / yr</span>
                        </div>
                        <p className="text-xs text-ink-2 mt-1">
                          {c.tuitionRange.min === 0 ? 'Public universities charge only nominal semester fees (~€200–600)' : `Averages ≈ ₹${tuitionINR.toFixed(1)} Lakh/year`}
                        </p>
                      </div>

                      <div className="bg-paper rounded-xl p-4 border border-line/70">
                        <span className="text-[0.7rem] uppercase tracking-wider font-semibold text-ink-3">Monthly Living Cost</span>
                        <div className="mt-1">
                          <span className="font-ui font-bold text-lg text-ink">
                            {c.currency} {c.monthlyLivingCost.min.toLocaleString()} – {c.monthlyLivingCost.max.toLocaleString()}
                          </span>
                          <span className="text-xs text-ink-3"> / mo</span>
                        </div>
                        <p className="text-xs text-ink-2 mt-1">
                          Includes rent, groceries & health insurance · ≈ <b>₹{livingINR.toFixed(0)}k/mo</b>
                        </p>
                      </div>
                    </div>

                    {/* Post Study & Work Rights Matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5 p-4 rounded-xl bg-paper/60 border border-line/60 text-xs">
                      <div>
                        <span className="text-[0.7rem] uppercase tracking-wider font-semibold text-brand-700 flex items-center gap-1.5 mb-1">
                          <Clock className="w-3.5 h-3.5" /> Post-Study Work Permit
                        </span>
                        <p className="text-sm font-semibold text-ink">{c.postStudyDuration} ({c.postStudyRoute})</p>
                        <p className="text-ink-3 text-[0.75rem] mt-0.5">{c.postStudyEligibility}</p>
                      </div>
                      <div>
                        <span className="text-[0.7rem] uppercase tracking-wider font-semibold text-brand-700 flex items-center gap-1.5 mb-1">
                          <Briefcase className="w-3.5 h-3.5" /> Work While Studying
                        </span>
                        <p className="text-sm font-semibold text-ink">{c.workWhileStudying}</p>
                        <p className="text-ink-3 text-[0.75rem] mt-0.5">{c.languageConsiderations}</p>
                      </div>
                    </div>

                    {/* Strengths & Specialties */}
                    <div className="space-y-2 mb-5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold text-ink-3 mr-1">In-Demand Careers:</span>
                        {c.careerStrengths.map(s => (
                          <span key={s} className="px-2.5 py-0.5 rounded-full bg-paper border border-line text-xs font-medium text-ink-2">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold text-ink-3 mr-1">Academic Strengths:</span>
                        <span className="text-xs text-ink-2">{c.studyStrengths.join(' · ')}</span>
                      </div>
                    </div>

                    {/* Expandable Comprehensive Dossier */}
                    {isExpanded && (
                      <div className="mt-5 pt-5 border-t border-line space-y-5 animate-in fade-in duration-200">
                        {/* Visa Proof of Funds Alert */}
                        <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-100 flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-brand-900">
                              Official Visa Proof of Funds / Financial Requirement
                            </p>
                            <p className="text-sm text-brand-950 font-semibold mt-1">
                              {c.visaFinancialRequirement}
                            </p>
                            <p className="text-xs text-brand-700/80 mt-1">
                              Notice: This is the official immigration bank balance / blocked account requirement required before visa granting. Actual living costs are shown separately.
                            </p>
                          </div>
                        </div>

                        {/* Living Expense Itemized Breakdown */}
                        <div>
                          <h4 className="font-ui font-semibold text-sm text-ink mb-3 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-brand-600" />
                            Monthly Living Cost Breakdown ({c.currency})
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                            {[
                              { label: 'Accommodation', val: c.breakdown.accommodation },
                              { label: 'Food & Groceries', val: c.breakdown.food },
                              { label: 'Public Transit', val: c.breakdown.transport },
                              { label: 'Health Insurance', val: c.breakdown.healthInsurance },
                              { label: 'Utilities / WiFi', val: c.breakdown.utilities },
                              { label: 'Personal / Misc', val: c.breakdown.misc },
                            ].map(item => (
                              <div key={item.label} className="bg-paper p-3 rounded-xl border border-line text-center">
                                <span className="text-[0.68rem] font-medium text-ink-3 block truncate">{item.label}</span>
                                <span className="text-xs font-bold text-ink mt-1 block">{c.currency} {item.val}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* City Differences & Scholarships */}
                        <div className="grid sm:grid-cols-2 gap-4 text-xs">
                          <div className="p-3.5 rounded-xl bg-paper border border-line">
                            <span className="font-semibold text-ink block mb-1">City Cost Variances:</span>
                            <p className="text-ink-2 leading-relaxed">{c.cityNote}</p>
                          </div>
                          <div className="p-3.5 rounded-xl bg-paper border border-line">
                            <span className="font-semibold text-ink block mb-1">Scholarships & Financial Aid:</span>
                            <p className="text-ink-2 leading-relaxed">{c.scholarshipAvailability}</p>
                          </div>
                        </div>

                        {/* Warnings & Candid Realities */}
                        {c.importantWarnings && c.importantWarnings.length > 0 && (
                          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
                            <p className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-amber-700" />
                              Candid Realities & Essential Warnings
                            </p>
                            <ul className="mt-2 space-y-1.5 list-disc pl-4 text-xs text-amber-950/90 leading-relaxed">
                              {c.importantWarnings.map((w, i) => (
                                <li key={i}>{w}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Universities in this Country */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-ui font-semibold text-sm text-ink flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-brand-600" />
                              Premier Institutions in {c.name} ({unis.length})
                            </h4>
                            <button
                              onClick={() => {
                                setForm(f => ({ ...f, goal: c.careerStrengths[0] || '' }));
                                setView('universities');
                              }}
                              className="text-xs font-medium text-brand-700 hover:text-brand-800"
                            >
                              Explore all university directories →
                            </button>
                          </div>
                          {unis.length === 0 ? (
                            <p className="text-xs text-ink-3 italic">University records for {c.name} being updated in the current directory release.</p>
                          ) : (
                            <div className="grid sm:grid-cols-2 gap-3">
                              {unis.map(u => (
                                <div key={u.id} className="bg-paper p-4 rounded-xl border border-line space-y-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="font-ui font-bold text-sm text-ink">{u.name}</p>
                                      <p className="text-xs text-ink-3">{u.city} · {u.type} · <span className="text-brand-700 font-medium">{u.reputation}</span></p>
                                    </div>
                                    <GatedOfficialLink
                                      url={u.website}
                                      linkLabel="Official University Website"
                                      section="study_abroad"
                                      className="text-ink-3 hover:text-brand-600 p-1"
                                      title="Official University Website"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </GatedOfficialLink>
                                  </div>
                                  <div className="text-xs text-ink-2 space-y-1">
                                    <p><strong className="text-ink font-medium">Key Programs:</strong> {u.programs.join(' · ')}</p>
                                    <p><strong className="text-ink font-medium">Tuition:</strong> {u.tuitionByProgram}</p>
                                    <p><strong className="text-ink font-medium">Admission:</strong> {u.entryRequirements}</p>
                                    <p><strong className="text-ink font-medium">Language:</strong> {u.languageRequirements}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Official Source & Verification */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-line text-[0.75rem] text-ink-3">
                          <span>
                            Verified official source: <GatedOfficialLink url={c.sourceUrl} linkLabel="Official Immigration Portal" section="study_abroad" className="underline font-medium hover:text-ink">{c.name} Official Immigration / Education Portal</GatedOfficialLink>
                          </span>
                          <span>Last verified by NAVORA: {c.lastVerified}</span>
                        </div>
                      </div>
                    )}

                    {/* Toggle and Footer Actions */}
                    <div className="mt-4 pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
                      <button
                        onClick={() => setExpandedCountryId(isExpanded ? null : c.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Hide Country Dossier & Universities
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            View Complete Dossier, Visa Proof & Universities ({unis.length})
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addCountry(c.id)}
                          className="text-xs text-ink-3 hover:text-ink font-medium px-2.5 py-1.5 rounded-lg border border-line bg-paper"
                        >
                          {isCompared ? 'Remove Compare' : 'Add to Compare'}
                        </button>
                        <button
                          onClick={() => {
                            setForm(f => ({
                              ...f,
                              budgetId: f.budgetId || '25-40',
                              goal: c.careerStrengths[0] || 'Software Engineering',
                            }));
                            setView('quiz');
                          }}
                          className="text-xs font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
                        >
                          Build Study Plan →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom callout */}
          <div className="mt-12 bg-white border border-line rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto shadow-sm">
            <h3 className="font-ui font-bold text-xl text-ink">Ready to find your personal best fit?</h3>
            <p className="mt-2 text-sm text-ink-2 max-w-xl mx-auto">
              Take our 7-question penalty-aware assessment. We match your exact budget, grades, stream, and career goals to the right country and degree.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setView('quiz')}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold px-6 py-3 shadow-brand transition-all"
              >
                <Compass className="w-4 h-4" />
                Build My Personalized Study Plan
              </button>
              {compareIds.length > 0 && (
                <button
                  onClick={() => setView('compare')}
                  className="inline-flex items-center gap-2 rounded-xl bg-white border border-line hover:border-brand-200 text-ink font-ui font-semibold px-6 py-3"
                >
                  <Scale className="w-4 h-4 text-brand-600" />
                  Compare {compareIds.length} Selected Countries
                </button>
              )}
            </div>
          </div>
          <UpgradeModal open={!!upgradeFeature} onClose={()=>setUpgradeFeature(null)} feature={upgradeFeature || 'country_compare'} />
        </div>
      </div>
    );
  }

  // ── Quiz ───────────────────────────────────────────────
  if(view==='quiz'){
    return (
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen bg-paper-gradient">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 lg:py-10">
            <div className="flex items-center justify-between mb-6">
              <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink"><ArrowLeft className="w-4 h-4"/>Back</button>
              <span className="text-xs font-medium text-ink-3 bg-white border border-line rounded-full px-3 py-1.5">{String(step+1).padStart(2,'0')} / {String(totalSteps).padStart(2,'0')} · {current.label}</span>
            </div>
            <div className="bg-white border border-line rounded-[1.5rem] shadow-card p-6 sm:p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="eyebrow text-ink-3">{current.label}</span>
                  <span className="text-xs text-ink-3">{Math.round(((step+1)/totalSteps)*100)}%</span>
                </div>
                <div className="h-1.5 bg-paper-deep rounded-full overflow-hidden"><div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{width:`${((step+1)/totalSteps)*100}%`}}/></div>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} initial={{opacity:0,x:dir==='right'?18:-18}} animate={{opacity:1,x:0}} exit={{opacity:0,x:dir==='right'?-18:18}} transition={{duration:0.28,ease:[0.22,1,0.36,1]}}>
                  <h1 ref={headingRef} tabIndex={-1} className="font-ui font-bold text-[1.6rem] sm:text-[1.9rem] text-ink tracking-[-0.02em] leading-tight outline-none">{current.title}</h1>
                  {current.id==='budget' && <p className="mt-2 text-sm text-ink-3">Total cost for the full degree (tuition + living). We distinguish this from visa financial requirements.</p>}
                  {current.id==='priority' && <p className="mt-2 text-sm text-ink-3">Choose 2–3. This shapes the penalty logic and ranking.</p>}
                  <div className="mt-6">{renderStep()}</div>
                  {errors[current.id] && <p className="mt-3 text-sm font-medium text-error flex gap-1.5"><AlertTriangle className="w-4 h-4 mt-0.5 shrink-0"/>{errors[current.id]}</p>}
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 pt-6 border-t border-line flex items-center justify-between gap-4">
                <span className="text-xs text-ink-3 hidden sm:inline">An expert is helping you make this decision — not an agent.</span>
                <Button onClick={next} size="lg" shine>{step===totalSteps-1?'See my matches':'Continue'}<ArrowRight className="w-4 h-4"/></Button>
              </div>
            </div>
          </div>
        </div>
      </MotionConfig>
    );
  }

  // ── Results ────────────────────────────────────────────
  const top = results.slice(0,5);
  const budgetINR = getBudgetMax(form.budgetId);

  // ── Scholarships for Indian students (country-wise) ──────
  if(view === 'scholarships'){
    const countryRows = getScholarshipCountriesWithData();
    const levelOptions = ['all','UG','PG','Doctoral'];
    const matches = (s) => {
      if (schCountry !== 'all' && s.country !== schCountry) return false;
      if (schLevel !== 'all' && !(s.education_levels || []).some(l => l.toUpperCase() === schLevel.toUpperCase())) return false;
      if (schFullOnly && s.funding_type !== 'Fully Funded') return false;
      return true;
    };
    const visibleCountries = countryRows
      .map(c => ({ ...c, records: getAbroadScholarshipsByCountry(c.name).filter(matches) }))
      .filter(c => c.records.length > 0);
    const shownRecords = visibleCountries.reduce((n,c) => n + c.records.length, 0);
    const grandTotal = countryRows.reduce((n,c) => n + c.count, 0);
    const grandFully = countryRows.reduce((n,c) => n + c.fullyFunded, 0);
    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : null;

    return (
      <div className="bg-paper min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink mb-6">
            <ArrowLeft className="w-4 h-4"/> Back to Global Study Overview
          </button>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="eyebrow text-brand-600">NAVORA Global Funding Directory</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">{grandTotal} scholarships · {countryRows.length} funder countries</span>
              </div>
              <h1 className="font-ui font-bold text-3xl sm:text-[2.2rem] text-ink tracking-[-0.03em]">
                Abroad scholarships you can actually apply for as an Indian student
              </h1>
              <p className="mt-2 text-ink-2 text-sm leading-relaxed max-w-3xl">
                Country by country: who funds it, what type of award it is, what it actually covers, the eligibility rules that eliminate most
                applicants, and the official page to verify. {grandFully} of these are fully funded. Records last reviewed 24 Sep 2026.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button onClick={()=>setView('quiz')} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 text-sm font-semibold shadow-brand transition-all">
                <Compass className="w-4 h-4"/> Match me to a country
              </button>
              <button onClick={()=>setView('explore')} className="inline-flex items-center gap-2 rounded-xl bg-white border border-line px-5 py-2.5 text-sm font-semibold hover:border-brand-200">
                <Globe className="w-4 h-4 text-brand-600"/> Country costs &amp; visas
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <div className="bg-white border border-line rounded-2xl p-5 shadow-card mb-6">
            <div className="space-y-4">
              <div>
                <p className="eyebrow text-ink-3 mb-2">Funder country</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={()=>setSchCountry('all')} className={`px-3.5 py-2 rounded-full border text-xs font-semibold ${schCountry==='all' ? 'bg-ink text-white border-ink' : 'bg-paper border-line hover:border-brand-200'}`}>
                    All countries ({grandTotal})
                  </button>
                  {countryRows.map(c => (
                    <button key={c.name} onClick={()=>setSchCountry(schCountry===c.name ? 'all' : c.name)} className={`px-3.5 py-2 rounded-full border text-xs font-semibold inline-flex items-center gap-1.5 ${schCountry===c.name ? 'bg-brand-500 text-white border-brand-500' : 'bg-paper border-line hover:border-brand-200'}`}>
                      <span aria-hidden="true" className="text-sm leading-none">{flagForCountry({ code: c.code })}</span> {c.name} ({c.count})
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-end gap-6 pt-3 border-t border-line/60">
                <div>
                  <p className="eyebrow text-ink-3 mb-2">Study level</p>
                  <div className="flex flex-wrap gap-2">
                    {levelOptions.map(l => (
                      <button key={l} onClick={()=>setSchLevel(l)} className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold ${schLevel===l ? 'bg-brand-500 text-white border-brand-500' : 'bg-paper border-line hover:border-brand-200'}`}>
                        {l === 'all' ? 'All levels' : l}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={()=>setSchFullOnly(v=>!v)} className={`px-3.5 py-2 rounded-full border text-xs font-semibold inline-flex items-center gap-1.5 ${schFullOnly ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-paper border-line hover:border-emerald-200'}`}>
                  <ShieldCheck className="w-3.5 h-3.5"/> Fully funded only
                </button>
                <span className="text-xs text-ink-3">Showing <b className="text-ink">{shownRecords}</b> of {grandTotal} records</span>
              </div>
            </div>
          </div>

          {/* How to read this section */}
          <div className="grid md:grid-cols-3 gap-3 mb-8">
            <div className="bg-white border border-line rounded-2xl p-4">
              <p className="text-sm font-semibold text-ink flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600"/> Verified vs needs-verification</p>
              <p className="text-xs text-ink-2 mt-1.5 leading-relaxed">“Verified” means the figures and dates were read off the provider’s own page when this data was reviewed. “Needs verification” means the scheme is real and well documented, but the current cycle’s amount or date must be re-checked before you rely on it.</p>
            </div>
            <div className="bg-white border border-line rounded-2xl p-4">
              <p className="text-sm font-semibold text-ink flex items-center gap-1.5"><Info className="w-4 h-4 text-brand-600"/> Fully funded ≠ easy to win</p>
              <p className="text-xs text-ink-2 mt-1.5 leading-relaxed">National scholarships such as Chevening, MEXT, Türkiye Bursları and GKS are extremely selective. Work-experience rules, age limits and nomination requirements eliminate most applicants before the essays are even read.</p>
            </div>
            <div className="bg-white border border-line rounded-2xl p-4">
              <p className="text-sm font-semibold text-ink flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-warning"/> Closed doors we keep visible</p>
              <p className="text-xs text-ink-2 mt-1.5 leading-relaxed">Some famous schemes no longer include India or no longer exist: Sweden’s SI scholarship (India is not on the 34-country list), Manaaki New Zealand (India not eligible) and Canada’s Vanier CGS (discontinued — replaced by CGRS-D). They stay listed and marked so you don’t plan around them.</p>
            </div>
          </div>

          {visibleCountries.length === 0 ? (
            <div className="bg-white border border-line rounded-2xl p-12 text-center">
              <Award className="w-10 h-10 text-ink-3 mx-auto mb-3" />
              <h3 className="font-ui font-semibold text-lg text-ink">No scholarships match these filters</h3>
              <p className="text-ink-2 text-sm mt-1">Try a different country or study level, or switch off “Fully funded only”.</p>
              <button onClick={()=>{ setSchCountry('all'); setSchLevel('all'); setSchFullOnly(false); }} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold hover:bg-brand-100">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {visibleCountries.map(c => (
                <section key={c.name}>
                  <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <FlagLogo code={c.code} size={26}/>
                      <div>
                        <h2 className="font-ui font-bold text-xl text-ink">{c.name}</h2>
                        <p className="text-xs text-ink-3">{c.region} · {c.records.length} of {c.count} {c.count === 1 ? 'record' : 'records'} shown · {c.fullyFunded} fully funded</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-3 items-start">
                    {c.records.map(s => {
                      const isOpen = schOpenId === s.id;
                      const isClosed = s.verification_status === 'EXPIRED' || s.status === 'expired';
                      return (
                        <article key={s.id} className={`bg-white border rounded-2xl p-5 ${isClosed ? 'border-red-200/70' : 'border-line'}`}>
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-ui font-semibold text-[0.98rem] leading-snug text-ink">{s.name}</h3>
                            {isClosed && <span className="shrink-0 text-[0.62rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">Closed</span>}
                          </div>
                          <p className="text-xs text-ink-3 mt-1">{s.provider_name}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            <span className={`px-2 py-0.5 rounded text-[0.68rem] font-bold text-white ${s.funding_type === 'Fully Funded' ? 'bg-emerald-600' : 'bg-ink'}`}>{s.funding_type}</span>
                            <span className="px-2 py-0.5 rounded text-[0.68rem] font-semibold bg-paper border border-line text-ink-2">{s.scholarship_type}</span>
                            <span className="px-2 py-0.5 rounded text-[0.68rem] font-semibold bg-paper border border-line text-ink-2">{(s.education_levels || []).join(' / ')}</span>
                            <span className={`px-2 py-0.5 rounded text-[0.68rem] font-semibold border ${s.verification_status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>{s.verification_status === 'VERIFIED' ? 'Verified' : 'Needs verification'}</span>
                          </div>
                          <p className="text-sm text-ink-2 mt-3 leading-relaxed">{s.description}</p>
                          <div className="grid sm:grid-cols-2 gap-2 mt-3 text-xs">
                            <div className="bg-paper border border-line/70 rounded-xl p-3">
                              <span className="text-ink-3 block text-[0.68rem] uppercase tracking-wide">Coverage</span>
                              <span className="font-semibold text-ink leading-snug">{s.award_amount ? `${s.award_currency} ${Number(s.award_amount).toLocaleString('en-IN')} (approx.)` : (s.tuition_coverage || s.funding_type)}</span>
                            </div>
                            <div className="bg-paper border border-line/70 rounded-xl p-3">
                              <span className="text-ink-3 text-[0.68rem] uppercase tracking-wide flex items-center gap-1"><Clock className="w-3 h-3"/> Deadline / window</span>
                              <span className="font-semibold text-ink leading-snug">{s.application_deadline ? fmtDate(s.application_deadline) : (s.application_window || 'See official source')}</span>
                            </div>
                          </div>
                          {isOpen && (
                            <div className="mt-3 border-t border-line/60 pt-3 space-y-2.5">
                              <p className="eyebrow text-ink-3">Eligibility that usually decides it</p>
                              <ul className="space-y-1.5">
                                {(s.eligibility_highlights || []).map((h,i)=>(
                                  <li key={i} className="text-xs text-ink-2 flex gap-1.5"><span className="text-brand-600 mt-0.5">•</span><span>{h}</span></li>
                                ))}
                                {(s.eligibility_highlights || []).length === 0 && <li className="text-xs text-ink-3">No eligibility caveats recorded — check the provider’s page.</li>}
                              </ul>
                              <div className="text-xs text-ink-2 space-y-1 pt-1">
                                {s.tuition_coverage && <p><b className="text-ink">Tuition:</b> {s.tuition_coverage}</p>}
                                {s.living_allowance && <p><b className="text-ink">Living / stipend:</b> {s.living_allowance}</p>}
                                {s.travel_allowance && <p><b className="text-ink">Travel:</b> {s.travel_allowance}</p>}
                                {s.insurance && <p><b className="text-ink">Insurance:</b> {s.insurance}</p>}
                                {s.academic_year && <p><b className="text-ink">Cycle:</b> {s.academic_year}</p>}
                              </div>
                              <p className="text-[0.7rem] text-ink-3">Source: {s.source_name} · last verified {s.last_verified_at} · <GatedOfficialLink url={s.official_source_url} linkLabel="Official source" section="scholarships" scholarshipId={s.id} scholarshipName={s.name} className="underline hover:text-ink">check source</GatedOfficialLink></p>
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-line/60">
                            <button onClick={()=>setSchOpenId(isOpen ? null : s.id)} className="px-3 py-1.5 rounded-xl border border-line bg-white text-xs font-semibold text-ink-2 hover:border-brand-200 inline-flex items-center gap-1">
                              {isOpen ? <><ChevronUp className="w-3.5 h-3.5"/> Hide eligibility</> : <><ChevronDown className="w-3.5 h-3.5"/> Eligibility &amp; coverage</>}
                            </button>
                            <GatedOfficialLink url={s.official_source_url} linkLabel="Official scholarship page" section="scholarships" scholarshipId={s.id} scholarshipName={s.name} className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold inline-flex items-center gap-1">
                              Official page <ExternalLink className="w-3 h-3"/>
                            </GatedOfficialLink>
                            <Link to={`/scholarships/${s.id}`} className="text-xs font-semibold text-brand-700 hover:underline ml-auto">Full details &amp; profile match →</Link>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}

          <p className="text-xs text-ink-3 leading-relaxed mt-8">Amounts, eligibility rules and deadlines change every cycle. NAVORA lists them from official provider sources for decision support only — always confirm on the provider’s official page before applying, and never pay a fee to a third party for a government scholarship.</p>
        </div>
      </div>
    );
  }

  if(view==='results'){
    return (
      <div className="bg-paper min-h-screen">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink mb-6"><ArrowLeft className="w-4 h-4"/>Back to questionnaire</button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <p className="eyebrow text-brand-600">Your Global Study Match</p>
              <h1 className="font-ui font-bold text-3xl sm:text-[2.2rem] text-ink tracking-[-0.03em] mt-2">Based on your profile, these deserve serious consideration.</h1>
              <p className="mt-3 text-ink-2 text-sm leading-relaxed max-w-2xl">Ranked by NAVORA Fit Score — transparent, penalty-aware, not hype. {form.goal && <>Goal: <b>{form.goal}</b> ·</>} {form.budgetId && <>Budget: <b>{BUDGET_RANGES.find(b=>b.id===form.budgetId)?.label}</b></>}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={()=>setView('explore')} className="inline-flex items-center gap-2 rounded-xl bg-white border border-line px-4 py-2.5 text-sm font-semibold hover:border-brand-200"><Globe className="w-4 h-4 text-brand-600"/>Explore All Countries</button>
              <button onClick={()=>setView('scholarships')} className="inline-flex items-center gap-2 rounded-xl bg-white border border-line px-4 py-2.5 text-sm font-semibold hover:border-brand-200"><Award className="w-4 h-4 text-amber-600"/>Scholarships for Indians</button>
              <button onClick={()=>setView('compare')} className="inline-flex items-center gap-2 rounded-xl bg-white border border-line px-4 py-2.5 text-sm font-semibold hover:border-brand-200"><Scale className="w-4 h-4"/>Compare</button>
              <button onClick={()=>setView('universities')} className="inline-flex items-center gap-2 rounded-xl bg-ink text-white px-4 py-2.5 text-sm font-semibold"><GraduationCap className="w-4 h-4"/> Universities</button>
              <button onClick={()=>setView('plan')} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 text-white px-4 py-2.5 text-sm font-semibold shadow-brand"><Compass className="w-4 h-4"/> My Study Plan</button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              {top.map((r, idx)=>(
                <div key={r.country.id} className={`bg-white border rounded-[1.4rem] p-6 sm:p-7 shadow-card ${idx===0?'ring-1 ring-brand-200 border-brand-200': 'border-line'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <span className="hidden sm:flex w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 items-center justify-center font-display italic text-brand-700">{String(idx+1).padStart(2,'0')}</span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-ui font-bold text-xl text-ink inline-flex items-center gap-2"><FlagLogo code={r.country.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(r.country)}</span>{r.country.name}</h3>
                          <span className="text-[0.68rem] font-bold tracking-wider uppercase bg-ink text-white rounded-full px-2.5 py-1">{r.category}</span>
                          <span className="inline-flex items-center gap-1 text-xs text-ink-3"><MapPin className="w-3 h-3"/>{r.country.region}</span>
                        </div>
                        <p className="mt-2 text-sm text-ink-2 leading-relaxed">{r.reasons.join(' · ') || 'Balanced match across your criteria.'}</p>
                      </div>
                    </div>
                    <div className="shrink-0 w-[4.5rem] h-[4.5rem] rounded-2xl bg-ink text-white flex flex-col items-center justify-center leading-none">
                      <span className="text-xl font-bold">{r.fit}</span><span className="text-[0.6rem] tracking-wider uppercase opacity-60">Fit Score</span>
                    </div>
                  </div>

                  <div className="mt-5 grid sm:grid-cols-3 gap-3">
                    <div className="bg-paper border border-line rounded-xl px-4 py-3">
                      <p className="eyebrow text-ink-3">Living</p>
                      <p className="text-sm font-semibold text-ink mt-1">{r.country.currency} {r.country.monthlyLivingCost.min.toLocaleString()}–{r.country.monthlyLivingCost.max.toLocaleString()}/mo</p>
                      <p className="text-xs text-ink-3">≈ ₹{(r.annualINR/12/1000).toFixed(0)}k/mo total with tuition</p>
                    </div>
                    <div className="bg-paper border border-line rounded-xl px-4 py-3">
                      <p className="eyebrow text-ink-3">Post-study</p>
                      <p className="text-sm font-semibold text-ink mt-1">{r.country.postStudyRoute}</p>
                      <p className="text-xs text-ink-3">{r.country.postStudyDuration}</p>
                    </div>
                    <div className="bg-paper border border-line rounded-xl px-4 py-3">
                      <p className="eyebrow text-ink-3">Best courses for you</p>
                      <p className="text-sm font-medium text-ink mt-1">{(r.country.careerStrengths.slice(0,2).join(' · '))}</p>
                      <p className="text-xs text-ink-3">{r.country.studyStrengths[0]}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-brand-50/70 border border-brand-100 px-4 py-3">
                      <p className="text-xs font-semibold text-brand-700 flex items-center gap-1.5"><Award className="w-3.5 h-3.5"/>Why it matches you</p>
                      <ul className="mt-1.5 space-y-1 text-xs text-ink-2 list-disc list-inside">{r.reasons.map(x=><li key={x}>{x}</li>)}{r.reasons.length===0 && <li>Balanced fit</li>}</ul>
                    </div>
                    {r.concerns.length>0 ? (
                      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                        <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/>Why this may NOT be right</p>
                        <ul className="mt-1.5 space-y-1 text-xs text-amber-900 list-disc list-inside">{r.concerns.map(x=><li key={x}>{x}</li>)}</ul>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                        <p className="text-xs font-semibold text-emerald-800">No major concerns for your profile</p>
                        <p className="text-xs text-emerald-900 mt-1">This option aligns well on cost, language and course fit.</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <SourceBadge url={r.country.sourceUrl} date={r.country.lastVerified}/>
                    <span className="text-ink-3">Visa requirement ≠ living cost — shown separately above.</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={()=> addCountry(r.country.id)} className={`text-xs font-semibold rounded-full px-3 py-1.5 border ${compareIds.includes(r.country.id)?'bg-ink text-white border-ink':'bg-white border-line hover:border-brand-200'}`}>{compareIds.includes(r.country.id)?'Selected for compare':'Add to compare'}</button>
                    <GatedOfficialLink url={r.country.sourceUrl} linkLabel="Official source" section="study_abroad" className="inline-flex items-center gap-1 text-xs font-medium text-ink-2 hover:text-ink">Official source <ExternalLink className="w-3 h-3"/></GatedOfficialLink>
                  </div>
                </div>
              ))}


            </div>

            {/* Right rail — cost sanity + next steps */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-line rounded-2xl p-5 shadow-card">
                <h4 className="font-ui font-semibold text-ink flex items-center gap-2"><Wallet className="w-4 h-4"/>Cost reality</h4>
                <p className="text-xs text-ink-3 mt-1">Tuition + living (mid-range). Degree total assumes 2-year Master.</p>
                <div className="mt-4 space-y-2">
                  {top.slice(0,4).map(r=>{
                    const ann = annualCostINR(r.country);
                    const deg = degreeCostINR(r.country,2);
                    const over = budgetINR && ann > budgetINR;
                    return (
                      <div key={r.country.id} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${over?'border-amber-200 bg-amber-50':'border-line bg-paper'}`}>
                        <span className="text-sm font-medium text-ink inline-flex items-center gap-1.5"><FlagLogo code={r.country.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(r.country)}</span>{r.country.name}</span>
                        <span className={`text-xs font-semibold ${over?'text-amber-800':'text-ink'}`}>₹{(ann/100000).toFixed(1)}L/yr · ₹{(deg/100000).toFixed(0)}L degree</span>
                      </div>
                    );
                  })}
                </div>
                {compareIds.length>0 && <button onClick={()=>setView('compare')} className="mt-4 w-full rounded-xl bg-ink text-white text-sm font-semibold py-2.5">Compare {compareIds.length} countries →</button>}
              </div>

              <div className="bg-ink text-white rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-600/25 blur-2xl"/>
                <h4 className="font-ui font-semibold flex items-center gap-2"><Building2 className="w-4 h-4"/>Next: universities</h4>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">We shortlist 3–6 per recommended country with tuition, entry, scholarships and post-study context.</p>
                <button onClick={()=>setView('universities')} className="mt-4 w-full rounded-xl bg-white text-ink font-semibold py-2.5">View universities</button>
              </div>

              <div className="bg-white border border-line rounded-2xl p-5">
                <p className="text-xs font-semibold text-ink flex items-center gap-2"><Info className="w-3.5 h-3.5"/>Rules can change</p>
                <p className="text-xs text-ink-3 mt-1.5 leading-relaxed">Verify current requirements with the relevant government authority before making an application. Figures are ranges for 2024–25.</p>
              </div>
            </div>
          </div>
          <UpgradeModal open={!!upgradeFeature} onClose={()=>setUpgradeFeature(null)} feature={upgradeFeature || 'country_compare'} />
        </div>
      </div>
    );
  }

  // ── Compare ────────────────────────────────────────────
  if(view==='compare'){
    const selected = compareIds.length ? results.filter(r=>compareIds.includes(r.country.id)) : results.slice(0,3);
    return (
      <div className="bg-paper min-h-screen">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink mb-6"><ArrowLeft className="w-4 h-4"/>Back to matches</button>
          <h1 className="font-ui font-bold text-2xl text-ink">Cost & opportunity comparison</h1>
          <p className="text-sm text-ink-3 mt-1">Tuition + living vs post-study vs fit. Living cost is estimated student spend, not the visa maintenance figure.</p>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[720px] w-full bg-white border border-line rounded-2xl overflow-hidden shadow-card">
              <thead className="bg-paper border-b border-line text-xs text-ink-3">
                <tr><th className="text-left px-4 py-3 font-semibold">Country</th><th className="text-left px-4 py-3">Tuition (range)</th><th className="text-left px-4 py-3">Living / mo</th><th className="text-left px-4 py-3">Annual total*</th><th className="text-left px-4 py-3">Degree (2yr)</th><th className="text-left px-4 py-3">Post-study</th><th className="text-left px-4 py-3">Fit</th></tr>
              </thead>
              <tbody className="text-sm">
                {selected.map(r=>{
                  const ann=annualCostINR(r.country);
                  return (
                    <tr key={r.country.id} className="border-t border-line hover:bg-paper/60">
                      <td className="px-4 py-3 font-semibold text-ink"><span className="inline-flex items-center gap-1.5"><FlagLogo code={r.country.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(r.country)}</span>{r.country.name}</span></td>
                      <td className="px-4 py-3 text-ink-2">{r.country.currency} {r.country.tuitionRange.min.toLocaleString()}–{r.country.tuitionRange.max.toLocaleString()}</td>
                      <td className="px-4 py-3 text-ink-2">{r.country.currency} {r.country.monthlyLivingCost.min}–{r.country.monthlyLivingCost.max}</td>
                      <td className="px-4 py-3 font-medium">₹{(ann/100000).toFixed(1)}L</td>
                      <td className="px-4 py-3">₹{(degreeCostINR(r.country)/100000).toFixed(0)}L</td>
                      <td className="px-4 py-3 text-xs leading-tight">{r.country.postStudyDuration}</td>
                      <td className="px-4 py-3"><span className="inline-flex w-9 h-9 rounded-xl bg-ink text-white items-center justify-center text-sm font-bold">{r.fit}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-3">*Annual total = mid tuition + mid living, converted at ~ {Object.entries(FX).slice(0,4).map(([k,v])=>`${k} ₹${v}`).join(' · ')}.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {COUNTRIES.slice(0,8).map(c=>(
              <button key={c.id} onClick={()=> addCountry(c.id)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${compareIds.includes(c.id)?'bg-ink text-white border-ink':'bg-white border-line'}`}><FlagLogo code={c.code} size={20} /><span aria-hidden="true" className="hidden">{flagFromCode(c.code)}</span>{c.name}</button>
            ))}
          </div>
          <UpgradeModal open={!!upgradeFeature} onClose={()=>setUpgradeFeature(null)} feature={upgradeFeature || 'country_compare'} />
        </div>
      </div>
    );
  }

  // ── Universities ───────────────────────────────────────
  if(view==='universities'){
    const topCountryIds = results.slice(0,3).map(r=>r.country.id);
    const list = UNIVERSITIES.filter(u=> topCountryIds.includes(u.countryId));
    return (
      <div className="bg-paper min-h-screen">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink mb-6"><ArrowLeft className="w-4 h-4"/>Back to matches</button>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-ui font-bold text-2xl text-ink">University shortlist</h1>
              <p className="text-sm text-ink-3 mt-1">3–6 per recommended country. Categories: BEST FIT · AMBITIOUS · VALUE · ALTERNATIVE. {uniLimit > 0 ? `Select up to ${uniLimit} to compare.` : 'University comparison is a Pro feature.'}</p>
            </div>
            {uniCompare.length>0 && <span className="text-xs bg-ink text-white rounded-full px-3 py-1.5">{uniCompare.length}/{Math.max(uniLimit, 1)} selected</span>}
          </div>
          {!isPro && (
            <div className="mt-4">
              <LockedFeature title="University comparison" desc="Free includes country discovery and up to 2 country comparisons. Compare up to 20 universities/month with NAVORA Pro." cta="Available with Pro" onUnlock={()=>setUpgradeFeature('university_compare')} />
            </div>
          )}

          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map(u=>{
              const c = COUNTRIES.find(x=>x.id===u.countryId);
              const sel = uniCompare.includes(u.id);
              return (
                <div key={u.id} className={`bg-white border rounded-2xl p-5 shadow-card flex flex-col ${sel?'ring-1 ring-brand-400 border-brand-300': 'border-line'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-ui font-semibold text-ink leading-tight flex items-center gap-2"><FlagLogo code={c?.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(c)}</span>{u.name}</h3>
                      <p className="text-xs text-ink-3 flex items-center gap-1.5 mt-1"><FlagLogo code={c?.code} size={16} /><span aria-hidden="true" className="hidden">{flagForCountry(c)}</span><MapPin className="w-3 h-3"/>{u.city}, {c?.name}</p>
                    </div>
                    <span className="text-[0.65rem] font-bold tracking-wider uppercase bg-paper border border-line rounded-full px-2 py-1 shrink-0">{u.type}</span>
                  </div>
                  <p className="mt-3 text-xs text-ink-2"><b>Relevant courses:</b> {u.programs.join(' · ')}</p>
                  <p className="mt-2 text-xs text-ink-2"><b>Tuition:</b> {u.tuitionByProgram}</p>
                  <p className="text-xs text-ink-2"><b>Entry:</b> {u.entryRequirements}</p>
                  <p className="text-xs text-ink-2"><b>English:</b> {u.languageRequirements}</p>
                  <p className="text-xs text-ink-3 mt-2"><b>Strengths:</b> {u.strengths.join(' · ')}</p>
                  {c && <p className="text-xs text-ink-3"><b>Est. living:</b> {c.currency} {c.monthlyLivingCost.min}–{c.monthlyLivingCost.max}/mo · <b>Post-study:</b> {c.postStudyDuration}</p>}
                  <div className="mt-3 flex flex-wrap gap-1.5">{u.scholarships.map(s=><Pill key={s}>{s}</Pill>)}<GatedOfficialLink url={u.website} linkLabel="Official University Website" section="study_abroad" className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline">Website <ExternalLink className="w-3 h-3"/></GatedOfficialLink></div>
                  <button onClick={()=> addUni(u.id)} className={`mt-4 w-full rounded-xl py-2.5 text-sm font-semibold border ${sel?'bg-ink text-white border-ink':'bg-white border-line hover:border-brand-200'}`}>{sel?'Remove from compare':'Add to compare'}</button>
                  <SourceBadge url={u.sourceUrls[0]} date={u.lastVerified} />
                </div>
              );
            })}
          </div>

          {uniCompare.length>=2 && (
            <div className="mt-8 bg-white border border-line rounded-2xl overflow-hidden shadow-card">
              <div className="px-5 py-3 bg-paper border-b border-line font-ui font-semibold text-ink">University comparison — {uniCompare.length} selected</div>
              <div className="overflow-x-auto">
                <table className="min-w-[640px] w-full text-sm">
                  <thead className="text-xs text-ink-3 border-b border-line"><tr><th className="text-left px-4 py-3">Field</th>{uniCompare.map(id=>{const u=UNIVERSITIES.find(x=>x.id===id); return <th key={id} className="text-left px-4 py-3 font-semibold text-ink">{u?.name}</th>})}</tr></thead>
                  <tbody className="divide-y divide-line">
                    <tr><td className="px-4 py-3 text-ink-3">City</td>{uniCompare.map(id=>{const u=UNIVERSITIES.find(x=>x.id===id); return <td key={id} className="px-4 py-3">{u?.city}</td>})}</tr>
                    <tr><td className="px-4 py-3 text-ink-3">Tuition</td>{uniCompare.map(id=>{const u=UNIVERSITIES.find(x=>x.id===id); return <td key={id} className="px-4 py-3">{u?.tuitionByProgram}</td>})}</tr>
                    <tr><td className="px-4 py-3 text-ink-3">Entry</td>{uniCompare.map(id=>{const u=UNIVERSITIES.find(x=>x.id===id); return <td key={id} className="px-4 py-3 text-xs">{u?.entryRequirements}</td>})}</tr>
                    <tr><td className="px-4 py-3 text-ink-3">English</td>{uniCompare.map(id=>{const u=UNIVERSITIES.find(x=>x.id===id); return <td key={id} className="px-4 py-3">{u?.languageRequirements}</td>})}</tr>
                    <tr><td className="px-4 py-3 text-ink-3">Strengths</td>{uniCompare.map(id=>{const u=UNIVERSITIES.find(x=>x.id===id); return <td key={id} className="px-4 py-3 text-xs">{u?.strengths.join(' · ')}</td>})}</tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={()=>setView('plan')} className="rounded-xl bg-brand-500 text-white font-semibold px-6 py-3 shadow-brand">Generate my study plan →</button>
            <button onClick={()=>setView('results')} className="rounded-xl bg-white border border-line font-semibold px-6 py-3">Back to countries</button>
          </div>
          <UpgradeModal open={!!upgradeFeature} onClose={()=>setUpgradeFeature(null)} feature={upgradeFeature || 'university_compare'} />
        </div>
      </div>
    );
  }

  // ── Final Plan ─────────────────────────────────────────
  if(view==='plan'){
    const top3 = results.slice(0,3);
    return (
      <div className="bg-surface min-h-screen">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
          <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink mb-6"><ArrowLeft className="w-4 h-4"/>Back</button>
          <div className="bg-white border border-line rounded-[1.6rem] shadow-card-lg overflow-hidden">
            <div className="bg-ink text-white px-6 sm:px-8 py-8 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-brand-600/20 blur-3xl"/>
              <p className="eyebrow text-brand-300">My NAVORA Global Study Plan</p>
              <h1 className="font-ui font-bold text-3xl mt-2 tracking-[-0.02em]">Your international education — planned.</h1>
              <p className="text-white/70 text-sm mt-2">Decision support, not a directory. Verify all figures with the university and government before applying.</p>
            </div>
            <div className="px-6 sm:px-8 py-8 space-y-8">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-paper border border-line rounded-xl p-4"><p className="eyebrow text-ink-3">Profile</p><p className="font-medium text-ink mt-1">{form.studyLevel || '—'} {form.stream?`· ${form.stream}`:''} {form.marks?`· ${form.marks}`:''}</p><p className="text-ink-2">Goal: {form.goal || '—'} · Lang: {form.language || '—'}</p></div>
                <div className="bg-paper border border-line rounded-xl p-4"><p className="eyebrow text-ink-3">Budget</p><p className="font-medium text-ink mt-1">{BUDGET_RANGES.find(b=>b.id===form.budgetId)?.label || '—'}</p><p className="text-ink-2">Priorities: {form.priorities.join(' · ') || '—'}</p></div>
              </div>

              <div>
                <h3 className="font-ui font-semibold text-ink">Recommended countries</h3>
                <div className="mt-3 space-y-2">{top3.map((r,i)=><div key={r.country.id} className="flex items-center justify-between border border-line rounded-xl px-4 py-3 bg-white"><span className="font-medium text-ink inline-flex items-center gap-2"><FlagLogo code={r.country.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(r.country)}</span>0{i+1} · {r.country.name} — <span className="text-xs font-bold tracking-wider uppercase text-brand-700">{r.category}</span></span><span className="w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center text-sm font-bold">{r.fit}</span></div>)}</div>
              </div>

              <div>
                <h3 className="font-ui font-semibold text-ink">Estimated total cost (2-yr Master, mid-range)</h3>
                <div className="mt-3 space-y-2">{top3.map(r=><div key={r.country.id} className="flex justify-between text-sm border border-line rounded-xl px-4 py-2.5 bg-paper"><span className="font-medium text-ink inline-flex items-center gap-1.5"><FlagLogo code={r.country.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(r.country)}</span>{r.country.name}</span><span className="font-semibold">₹{(degreeCostINR(r.country)/100000).toFixed(1)}L</span></div>)}</div>
                <p className="text-xs text-ink-3 mt-2">Ranges for 2024–25; city matters (London ≠ Manchester, Munich ≠ Leipzig). See country cards for breakdown.</p>
              </div>

              <div>
                <h3 className="font-ui font-semibold text-ink">Post-study work — at a glance</h3>
                <div className="mt-3 space-y-2">{top3.map(r=><div key={r.country.id} className="border border-line rounded-xl px-4 py-3 bg-white"><p className="text-sm font-medium text-ink inline-flex items-center gap-1.5"><FlagLogo code={r.country.code} size={20} /><span aria-hidden="true" className="hidden">{flagForCountry(r.country)}</span>{r.country.name}: {r.country.postStudyRoute} — {r.country.postStudyDuration}</p><p className="text-xs text-ink-3">{r.country.postStudyEligibility} · <GatedOfficialLink url={r.country.sourceUrl} linkLabel="Official source" section="study_abroad" className="underline">verify</GatedOfficialLink></p></div>)}</div>
                <p className="text-xs text-warning mt-2 flex gap-1.5"><AlertTriangle className="w-4 h-4 shrink-0"/>Rules can change. Verify current requirements with the relevant government authority before making an application.</p>
              </div>

              <div className="bg-paper border border-line rounded-xl p-5">
                <h3 className="font-ui font-semibold text-ink">Suggested timeline</h3>
                <ol className="mt-3 space-y-2 text-sm text-ink-2">
                  <li><b className="text-ink">Phase 01 · Confirm course</b> — lock {form.goal || 'target course'}; if “Not sure”, do course discovery first.</li>
                  <li><b className="text-ink">Phase 02 · Shortlist countries</b> — done ✓</li>
                  <li><b className="text-ink">Phase 03 · Shortlist universities</b> — pick 6–8, categorize Ambitious / Fit / Value.</li>
                  <li><b className="text-ink">Phase 04 · Scholarships</b> — DAAD / Chevening / etc. deadlines often precede admission.</li>
                  <li><b className="text-ink">Phase 05 · Verify visa</b> — blocked account, proof of funds, health cover per country.</li>
                  <li><b className="text-ink">Phase 06 · Prepare applications</b> — SOP, LORs, language tests, portfolio where needed.</li>
                  <li><b className="text-ink">Phase 07 · Apply</b> — intakes vary by country; start 10–12 months before intake.</li>
                </ol>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={()=>window.print()} className="rounded-xl bg-ink text-white font-semibold px-6 py-3">Print / Save PDF</button>
                <button onClick={()=>setView('results')} className="rounded-xl bg-white border border-line font-semibold px-6 py-3">Back to matches</button>
              </div>

              <p className="text-xs text-ink-3 leading-relaxed border-t border-line pt-4">Tuition fees, living costs, admission requirements and immigration rules can change. NAVORA provides decision-support information based on available sources and does not guarantee admission, employment, visa approval or immigration outcomes. Always verify final requirements with the university and relevant government authority.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
