import { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight,
  MessageCircle, Compass, Scale, RotateCcw, CheckCircle2, Clock, Sparkles,
  GraduationCap, Wrench, ClipboardList, AlertCircle, Camera, Pencil, Download,
  Share2, LogOut, Mail, BadgeCheck, User, Calendar, Building2, Award,
  Globe, BookOpen, Layers, Target, ChevronRight, ExternalLink, Lightbulb, MapPin, Bookmark
} from 'lucide-react';
import Button from '../components/Button';
import Swoosh from '../components/Swoosh';
import { FadeIn } from '../components/AnimatedPage';
import { useUser } from '../context/UserContext';
import { useScrollTop } from '../hooks/useLocalStorage';
import { personas } from '../data/personas';
import { getStudentContext } from '../data/streamConfig';
import AICareerAdvisor from '../components/ai/AICareerAdvisor';
import { fetchLatestResult } from '../lib/assessmentResults';
import { unifiedFromCareerEngine } from '../data/resultsAdapters';
import { supabase } from '../lib/supabase';
import { useSubscription } from '../hooks/useSubscription';
import UpgradeModal from '../components/UpgradeModal';
import { getCollegesMatchingProfile } from '../data/institutionsMaster';
import { SCHOLARSHIPS } from '../data/scholarships';
import { COUNTRIES } from '../data/studyAbroad';

export default function Dashboard() {
  useScrollTop();
  const navigate = useNavigate();
  const { userType: localUserType, answers: localAnswers, onboardingData, comparisonItems, user, setOnboardingData, setUser } = useUser();

  const [remote, setRemote] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(true);
  const [remoteError, setRemoteError] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('navora-avatar') || user?.user_metadata?.avatar_url || '');
  const [editingName, setEditingName] = useState(false);
  const { isPro, sub } = useSubscription();
  const [showProModal, setShowProModal] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.user_metadata?.avatar_url) setAvatarUrl(user.user_metadata.avatar_url);
    const stored = localStorage.getItem('navora-avatar');
    if (stored) setAvatarUrl(stored);
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Please choose an image under 2MB.'); return; }
    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);
    localStorage.setItem('navora-avatar', preview);
    try {
      if (user?.id) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${user.id}/avatar.${ext}`;
        const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
        if (!error) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(path);
          if (data?.publicUrl) {
            setAvatarUrl(data.publicUrl);
            localStorage.setItem('navora-avatar', data.publicUrl);
            await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } }).catch(()=>{});
          }
        }
      }
    } catch {}
  };

  const handleSaveName = async () => {
    const n = draftName.trim().slice(0, 40);
    if (n.length < 2) return;
    setOnboardingData({ ...onboardingData, name: n });
    setEditingName(false);
    try { await supabase.auth.updateUser({ data: { full_name: n } }).catch(()=>{}); } catch {}
  };
  const handleShare = async () => {
    const url = window.location.href;
    try { await navigator.clipboard.writeText(url); setShareCopied(true); setTimeout(()=>setShareCopied(false), 2000); } catch { window.prompt('Copy this link:', url); }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut().catch(()=>{});
    setUser(null);
    navigate('/login');
  };
  const handleDownloadPdf = async (topData, unifiedData) => {
    if (!topData) return;
    if (!isPro) { setShowProModal(true); return; }
    setPdfDownloading(true);
    try {
        const w = window.open('', '_blank');
        if (!w) throw new Error('Popup blocked');
        const html = `<!doctype html><html><head><title>NAVORA Result</title><style>body{font-family:Inter,system-ui;padding:32px;color:#0B1E3D}h1{font-size:22px;margin:0}h2{font-size:16px;margin:16px 0 8px}.pill{display:inline-block;background:#0B1E3D;color:#fff;padding:6px 12px;border-radius:999px;font-size:12px}.card{border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin:12px 0}.muted{color:#64748b;font-size:12px}</style></head><body>
          <h1>NAVORA — Your Career Result</h1><p class="muted">Generated ${new Date().toLocaleString()} • NAVORA Guidance</p>
          <h2>${(topData.title||'').replace(/</g,'&lt;')} <span style="font-weight:400;font-size:12px;color:#0ea5e9">${(topData.career?.category||'').replace(/</g,'&lt;')}</span></h2>
          ${topData.score!=null?`<div class="pill">${topData.score} Fit Score · ${topData.band||''}</div>`:''}
          <p>${(topData.career?.description||'').replace(/</g,'&lt;')}</p>
          <div class="card"><b>Recommended degree / course</b><br/>${(topData.degree?.full||topData.degree?.short||'-').replace(/</g,'&lt;')}<br/><span class="muted">${(topData.exams||[]).map(e=>e.name).join(' · ')}</span></div>
          <div class="card"><b>Why it fits</b><ul>${(topData.whyMatches||[]).map(w=>`<li>${w.replace(/</g,'&lt;')}</li>`).join('')}</ul></div>
          <div class="card"><b>Skills to develop</b><br/>${(topData.foundations?.length?topData.foundations:(topData.career?.skillsToDevelop||[])).join(' · ')}</div>
          <div class="card"><b>Alternative paths</b><ul>${(unifiedData||[]).slice(1,4).map(a=>`<li>${a.title} · ${a.band}</li>`).join('')}</ul></div>
          <p class="muted">NAVORA — Guidance, not a prediction. Verify with official sources.</p></body></html>`;
        w.document.write(html); w.document.close(); w.focus(); setTimeout(()=>w.print(), 300);
    } catch{ alert('Could not generate PDF. Please try again.'); }
    finally { setPdfDownloading(false); }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingRemote(true);
      setRemoteError(null);
      const res = await fetchLatestResult();
      if (cancelled) return;
      if (res?.error) setRemoteError(res.error);
      else if (res?.data) setRemote(res.data);
      setLoadingRemote(false);
    })();
    return () => { cancelled = true; };
  }, [user?.email]);

  const effective = useMemo(() => {
    if (remote?.assessment_data && remote?.result_data) {
      const a = remote.assessment_data || {};
      const flow = a.flow || remote.assessment_type || localUserType;
      let ut = localUserType;
      if (flow) {
        if (String(flow).includes('graduation')) ut = flow.includes('parent') ? 'parent' : 'graduate';
        else if (String(flow).includes('class12')) ut = flow.includes('parent') ? 'parent' : 'class12';
        else if (String(flow).includes('class10')) ut = 'parent';
      }
      return {
        userType: ut || localUserType,
        answers: a, flow,
        remoteUnified: remote.result_data?.unified || null,
        remoteHeader: remote.result_data?.header || null,
        remoteContext: remote.result_data?.context || null,
        remoteResult: remote.result_data?.result || null,
        source: 'supabase', createdAt: remote.created_at,
      };
    }
    return { userType: localUserType, answers: localAnswers, source: 'local', createdAt: localAnswers?.lastSavedAt || null };
  }, [remote, localUserType, localAnswers]);

  const stageUserType = effective.userType === 'graduation' ? 'graduate' : effective.userType;
  const persona = personas[stageUserType];
  const hasProfile = !!effective.userType;
  const answersCount = Object.keys(effective.answers || {}).length;
  const name = onboardingData?.name?.trim();
  const displayName = name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';
  const Icon = persona?.icon || Compass;
  const context = hasProfile ? getStudentContext(stageUserType, effective.answers) : null;
  const hasContext = !!(context && (context.stream || context.field || context.selections.length > 0));

  const unified = useMemo(() => {
    if (effective.remoteUnified && Array.isArray(effective.remoteUnified) && effective.remoteUnified.length) return effective.remoteUnified;
    if (!hasProfile || answersCount === 0) return [];
    try {
      const flowKeyForEngine = effective.answers?.flow || (effective.userType === 'class12' ? 'student_class12' : effective.userType === 'graduate' ? 'student_graduation' : effective.userType);
      return unifiedFromCareerEngine(flowKeyForEngine, effective.answers);
    } catch { return []; }
  }, [effective, hasProfile, answersCount]);

  const top = unified[0] || null;
  const alternatives = unified.slice(1, 4);

  // derived dynamic data for sections — reuse existing sources, hide if empty
  const matchedColleges = useMemo(() => {
    try { return getCollegesMatchingProfile(effective.answers || {}).slice(0, 3); } catch { return []; }
  }, [effective.answers]);
  const matchedScholarships = useMemo(() => {
    // pick first 3 active scholarships that match level if possible
    const active = SCHOLARSHIPS.filter(s => s.status === 'active').slice(0, 3);
    return active;
  }, []);
  const globalPreview = useMemo(() => COUNTRIES.slice(0, 3), []);

  const greetingWord = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const lastAssessmentLabel = (effective.answers?.lastSavedAt || effective.createdAt)
    ? new Date(effective.answers?.lastSavedAt || effective.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  // skills derived
  const skills = useMemo(() => {
    if (!top) return [];
    const raw = top.foundations?.length ? top.foundations : (top.career?.skillsToDevelop || []);
    // map to name + short explanation (dynamic where possible)
    const explanations = {
      // fallback generic based on category
    };
    return raw.slice(0, 6).map((s, i) => ({
      name: s,
      desc: top.career?.category ? `${top.career.category} — core capability` : 'Recommended for this path',
      idx: i,
    }));
  }, [top]);

  return (
    <div className="min-h-screen bg-paper">
      {/* full-width premium workspace: wider than before, editorial spacing */}
      <div className="max-w-[76rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* ── 1. PREMIUM PROFILE HEADER (compact, below nav) ── */}
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative shrink-0 hidden sm:block">
                <div className="w-[52px] h-[52px] rounded-full overflow-hidden bg-white border border-line flex items-center justify-center">
                  {avatarUrl ? <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-ink-3" />}
                </div>
                <button onClick={()=>fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-ink text-white flex items-center justify-center border-2 border-paper shadow-sm" aria-label="Change photo">
                  <Camera className="w-3 h-3" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <div className="min-w-0">
                <p className="eyebrow text-ink-3 tracking-[0.14em]">{greetingWord}, {displayName}</p>
                <h1 className="font-ui font-bold text-[1.35rem] sm:text-[1.55rem] tracking-[-0.02em] text-ink leading-none mt-1">Your personalized NAVORA journey</h1>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {persona && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 border" style={{ backgroundColor: persona.accentSoft, color: persona.accentColor, borderColor: 'var(--color-line)' }}>
                      <Icon className="w-3.5 h-3.5" /> {persona.title}
                    </span>
                  )}
                  {hasContext ? (
                    <>
                      <span className="text-xs bg-white border border-line rounded-full px-2.5 py-1 text-ink-2">{context.stageLabel}</span>
                      {context.stream && <span className="text-xs bg-white border border-line rounded-full px-2.5 py-1 text-ink-2">{context.stream.emoji} {context.stream.label}</span>}
                      {context.field && <span className="text-xs bg-white border border-line rounded-full px-2.5 py-1 text-ink-2">{context.field.label}</span>}
                    </>
                  ) : (
                    <span className="text-xs text-ink-3">Complete assessment to personalize this workspace</span>
                  )}
                  {lastAssessmentLabel && (
                    <span className="inline-flex items-center gap-1 text-xs text-ink-3"><Calendar className="w-3 h-3" /> Last assessment {lastAssessmentLabel}</span>
                  )}
                  {effective.source === 'supabase' && <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">Synced</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link to="/account" className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border border-line bg-white hover:border-brand-200 hover:text-brand-700 transition-colors">
                View profile <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link to={hasProfile ? `/questions/${effective.userType}` : '/get-started'} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-ink text-white hover:bg-brand-950 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Retake assessment
              </Link>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 border font-semibold ${isPro ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-line text-ink-3'}`}>
              <BadgeCheck className="w-3.5 h-3.5" /> {isPro ? `NAVORA Pro · Active${sub?.expires_at ? ' until ' + new Date(sub.expires_at).toLocaleDateString() : ''}` : 'NAVORA Free'}
            </span>
            {!isPro && <Link to="/pricing" className="text-brand-600 font-semibold hover:text-brand-700">Explore Pro →</Link>}
            {user?.email && <span className="inline-flex items-center gap-1 text-ink-3"><Mail className="w-3 h-3" /> {user.email}</span>}
            <div className="ml-auto flex gap-1.5">
              <button onClick={()=>handleDownloadPdf(top, unified)} disabled={!top} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border bg-white border-line hover:border-brand-200 disabled:opacity-40">
                <Download className="w-3.5 h-3.5" /> {pdfDownloading ? '...' : 'Download PDF'}
              </button>
              <button onClick={handleShare} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border bg-white border-line hover:border-brand-200">
                <Share2 className="w-3.5 h-3.5" /> {shareCopied ? 'Copied' : 'Share'}
              </button>
              {user?.email && <button onClick={handleLogout} className="inline-flex items-center gap-1 text-xs text-ink-3 hover:text-ink"><LogOut className="w-3 h-3" /> Log out</button>}
            </div>
          </div>
        </FadeIn>

        {loadingRemote && hasProfile && (
          <FadeIn delay={0.05} className="mt-6">
            <div className="bg-white border border-line rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-paper w-32 rounded mb-3" />
              <div className="h-3 bg-paper w-full rounded mb-2" />
              <div className="h-3 bg-paper w-2/3 rounded" />
            </div>
          </FadeIn>
        )}
        {remoteError && (
          <FadeIn delay={0.05} className="mt-6">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div><p className="text-sm font-semibold text-amber-900">We couldn't load your saved result</p><p className="text-sm text-amber-800/80">Showing local data. Refresh to sync.</p></div>
            </div>
          </FadeIn>
        )}

        {/* ── 2. MAIN RESULT HERO — dominant 2-col ── */}
        {hasProfile && top ? (
          <FadeIn delay={0.06} className="mt-6">
            <div className="bg-brand-950 text-white rounded-[1.6rem] overflow-hidden relative shadow-card-lg border border-white/10">
              <div className="absolute inset-0 bg-mesh-dark opacity-90" />
              <Swoosh variant="dark" />
              <div className="absolute -top-14 -right-16 w-80 h-80 rounded-full bg-brand-600/25 blur-3xl" />
              <div className="absolute -bottom-20 -left-12 w-72 h-72 rounded-full bg-indigo-600/15 blur-3xl" />
              <div className="relative grid lg:grid-cols-[1.35fr_0.85fr] gap-0">
                {/* Left: career */}
                <div className="p-7 sm:p-8 lg:p-9 lg:pr-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 glow-dot" />
                    <p className="eyebrow text-white/60">Your NAVORA Result</p>
                    {top.score != null && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-ink rounded-full px-3 py-1">
                        <Sparkles className="w-3 h-3 text-brand-600" /> {top.score} Fit · {top.band || top.level}
                      </span>
                    )}
                    <span className="text-xs text-white/50">Best-fit direction</span>
                  </div>
                  <h2 className="font-ui font-bold text-[2rem] sm:text-[2.4rem] leading-none tracking-[-0.03em]">{top.title}</h2>
                  <p className="mt-2 text-sm font-semibold tracking-wide text-cyan-200 uppercase">{top.career?.category || ''}</p>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-white/75 max-w-xl">
                    {top.career?.description || 'Your responses indicate alignment with this direction — built from your stream, interests and strengths.'}
                  </p>
                  {/* personalized line */}
                  <p className="mt-4 text-sm text-white/60 italic border-l-2 border-white/20 pl-3">
                    Your responses indicate alignment with {top.career?.category?.toLowerCase() || 'this field'} — a blend of your interests and strengths.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Link to="/advisor" className="inline-flex items-center gap-2 bg-white text-ink font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-paper transition-colors">
                      <MessageCircle className="w-4 h-4" /> Talk to Advisor <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link to={`/recommendations/${effective.userType}`} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/15 transition-colors">
                      View full report
                    </Link>
                  </div>
                </div>
                {/* Right: academic path — distinct panel */}
                <div className="p-5 sm:p-6 lg:p-6 bg-white/[0.04] lg:bg-white/[0.06] border-t lg:border-t-0 lg:border-l border-white/10 backdrop-blur-sm flex flex-col">
                  <p className="eyebrow text-cyan-200 flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Recommended path</p>
                  <p className="mt-2 font-ui font-bold text-[1.15rem] leading-tight text-white">{top.degree?.full || top.degree?.short || 'See full recommendation'}</p>
                  {top.degree?.full && top.degree?.short && top.degree.full !== top.degree.short && (
                    <p className="text-sm text-white/60 mt-1">{top.degree.short}</p>
                  )}
                  {top.exams?.length > 0 && (
                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Relevant exams</p>
                      <div className="flex flex-wrap gap-1.5">
                        {top.exams.slice(0, 3).map(e => (
                          <span key={e.name} className="text-xs font-medium bg-white text-ink rounded-full px-2.5 py-1">{e.name}</span>
                        ))}
                      </div>
                      <p className="text-xs text-white/40 mt-2">Timings vary — verify with official notifications.</p>
                    </div>
                  )}
                  <div className="mt-auto pt-6 flex items-center gap-2 text-xs text-white/50">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Guidance, not a prediction — verify with official sources
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        ) : hasProfile && !loadingRemote ? (
          <FadeIn delay={0.06} className="mt-6">
            <div className="bg-white border border-line rounded-[1.6rem] p-8 sm:p-10 text-center">
              <span className="inline-flex w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 items-center justify-center mb-4"><Compass className="w-6 h-6" /></span>
              <h2 className="font-ui font-bold text-2xl text-ink tracking-[-0.03em]">Your career direction starts here.</h2>
              <p className="mt-2 text-ink-2 text-sm max-w-xl mx-auto">Complete your assessment to see your Fit Score and personalized workspace.</p>
              <Link to="/get-started" className="inline-block mt-5"><Button size="lg" shine>Start Your Assessment <ArrowRight className="w-4 h-4" /></Button></Link>
            </div>
          </FadeIn>
        ) : null}

        {/* Only render premium sections when has result */}
        {top && (
          <>
            {/* ── 3. WHY THIS PATH FITS — editorial, not 4 equal cards ── */}
            <FadeIn delay={0.08} className="mt-8">
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="font-ui font-bold text-xl tracking-[-0.02em] text-ink">Why this path fits you</h3>
                <span className="eyebrow text-ink-3 hidden sm:block">Derived from your answers</span>
              </div>
              <div className="grid lg:grid-cols-12 gap-4">
                {/* Primary reason — larger editorial */}
                <div className="lg:col-span-5 bg-white border border-line rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center"><Target className="w-4 h-4" /></span>
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Interest alignment</p>
                  </div>
                  <p className="font-ui font-semibold text-lg leading-snug text-ink">{top.whyMatches?.[0] || 'Your interests connect to this field.'}</p>
                  <p className="text-sm text-ink-2 mt-2 leading-relaxed">Built from the interests and stream you shared — not a generic label.</p>
                  {top.factors && (
                    <div className="mt-4 flex gap-2">
                      {top.factors.slice(0, 2).map(f => (
                        <span key={f.key} className="text-xs font-semibold bg-paper border border-line rounded-full px-2.5 py-1 text-ink-2">{f.key}: {f.value}%</span>
                      ))}
                    </div>
                  )}
                </div>
                {/* Secondary stack */}
                <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
                  <div className="bg-paper border border-line rounded-2xl p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-3 flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5" /> Strengths</p>
                    <p className="text-sm font-medium text-ink mt-2 leading-relaxed">{top.whyMatches?.[1] || `Strengths overlap with ${(top.career?.strengthsAligned||[]).slice(0,2).join(', ') || 'this direction'}.`}</p>
                    {(top.career?.strengthsAligned||[]).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">{top.career.strengthsAligned.slice(0,3).map(s=> <span key={s} className="text-xs bg-white border border-line rounded-full px-2 py-1">{s}</span>)}</div>
                    )}
                  </div>
                  <div className="bg-ink text-white rounded-2xl p-5 relative overflow-hidden">
                    <Swoosh variant="dark" />
                    <p className="text-xs font-bold uppercase tracking-widest text-white/60">Learning direction</p>
                    <p className="text-sm font-medium mt-2 leading-relaxed text-white/90">{top.whyMatches?.[2] || top.considerations?.[0] || 'Direct education route from your current background.'}</p>
                    <p className="text-xs text-white/50 mt-3">Check the roadmap below for the exact next step.</p>
                  </div>
                  <div className="sm:col-span-2 bg-white border border-line rounded-2xl p-5 flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0"><BookOpen className="w-4 h-4" /></span>
                    <div>
                      <p className="text-sm font-semibold text-ink">What to try next</p>
                      <p className="text-sm text-ink-2 leading-relaxed mt-1">{top.activity || 'Talk to someone doing this work — one conversation clarifies more than a brochure.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ── 4. CAREER ROADMAP — horizontal desktop / vertical mobile ── */}
            <FadeIn delay={0.1} className="mt-8">
              <h3 className="font-ui font-bold text-xl tracking-[-0.02em] text-ink mb-3">Your career roadmap</h3>
              <div className="bg-white border border-line rounded-2xl p-6 sm:p-7 overflow-hidden">
                {/* Desktop: horizontal */}
                <div className="hidden lg:flex items-start gap-0">
                  {[
                    { label: 'Current stage', value: context?.stageLabel || effective.userType || 'Your stage', sub: context?.stream?.label || '' },
                    { label: 'Course / Degree', value: top.degree?.short || 'Recommended course', sub: top.degree?.full || '' },
                    { label: 'Specialization', value: top.career?.category || 'Field focus', sub: '' },
                    { label: 'Skills', value: (skills[0]?.name || 'Core skills'), sub: `+${Math.max(0, skills.length - 1)} more` },
                    { label: 'Career', value: top.title, sub: 'Opportunities ahead' },
                  ].map((step, i, arr) => (
                    <div key={step.label} className="flex-1 flex items-start gap-0">
                      <div className="flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${i===arr.length-1 ? 'bg-brand-600 text-white border-brand-600' : i===0 ? 'bg-ink text-white border-ink' : 'bg-white border-line text-ink'}`}>{i+1}</div>
                        <p className="text-xs font-bold uppercase tracking-widest text-ink-3 mt-3">{step.label}</p>
                        <p className="text-sm font-semibold text-ink leading-tight mt-1 truncate pr-2">{step.value}</p>
                        {step.sub && <p className="text-xs text-ink-3 truncate pr-2">{step.sub}</p>}
                      </div>
                      {i < arr.length - 1 && <div className="w-8 h-px bg-line mt-4 mx-1 shrink-0 hidden xl:block" style={{marginTop:16}}><div className="w-full h-px bg-gradient-to-r from-line to-brand-200" /></div>}
                      {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-line mt-3 shrink-0 hidden xl:block" />}
                    </div>
                  ))}
                </div>
                {/* Mobile: vertical */}
                <div className="lg:hidden relative pl-6">
                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-line" />
                  {[
                    { label: 'Current stage', value: context?.stageLabel || 'Your stage' },
                    { label: 'Course / Degree', value: top.degree?.full || top.degree?.short || 'Recommended course' },
                    { label: 'Skills', value: skills.slice(0,2).map(s=>s.name).join(' · ') || 'Core skills' },
                    { label: 'Career', value: top.title },
                  ].map((step, i) => (
                    <div key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
                      <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold -translate-x-1/2 ${i===3 ? 'bg-brand-600 text-white' : 'bg-white border border-line text-ink'}`}>{i+1}</div>
                      <div className="ml-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-ink-3">{step.label}</p>
                        <p className="text-sm font-semibold text-ink">{step.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* ── 5. SKILLS TO DEVELOP — avoid large repetitive cards ── */}
            <FadeIn delay={0.12} className="mt-8">
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="font-ui font-bold text-xl tracking-[-0.02em] text-ink">Skills to develop</h3>
                <span className="text-xs text-ink-3">From your recommended path</span>
              </div>
              {skills.length > 0 ? (
                <div className="bg-white border border-line rounded-2xl p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.map(s => (
                      <div key={s.name} className="flex gap-3 p-4 rounded-xl bg-paper border border-line/70">
                        <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0"><Wrench className="w-4 h-4" /></span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink">{s.name}</p>
                          <p className="text-xs text-ink-3 leading-relaxed mt-0.5">Build through projects and coursework.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {top.considerations?.[0] && <p className="text-xs text-ink-3 mt-4 border-t border-line pt-3">{top.considerations[0]}</p>}
                </div>
              ) : (
                <div className="bg-white border border-line rounded-2xl p-6 text-sm text-ink-3">Explore after you start — your advisor can suggest a skill plan.</div>
              )}
            </FadeIn>

            {/* ── 6. ALTERNATIVE PATHS ── */}
            {alternatives.length > 0 && (
              <FadeIn delay={0.14} className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-ui font-bold text-xl tracking-[-0.02em] text-ink">Other paths to explore</h3>
                  <Link to={`/recommendations/${effective.userType}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {alternatives.map(a => (
                    <Link key={a.career.id} to={`/recommendations/${effective.userType}`} className="group bg-white border border-line rounded-2xl p-5 hover:border-brand-200 hover:shadow-sm transition-all">
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">{a.band}</p>
                      <p className="font-ui font-semibold text-ink mt-1 leading-tight group-hover:text-brand-700">{a.title}</p>
                      <p className="text-xs text-ink-3 mt-1 line-clamp-2">{a.career?.description || a.career?.category || ''}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink mt-3 group-hover:text-brand-700">Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" /></span>
                    </Link>
                  ))}
                </div>
              </FadeIn>
            )}

            {/* ── Quick Actions — compact premium row, not 5 huge cards ── */}
            <FadeIn delay={0.15} className="mt-8">
              <div className="bg-white border border-line rounded-2xl p-4 sm:p-5">
                <p className="eyebrow text-ink-3 mb-3">Quick actions</p>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    { label: 'Explore Colleges', desc: 'Verified fees & cutoffs', icon: Building2, to: '/colleges' },
                    { label: 'Compare Courses', desc: sideBySideLabel(comparisonItems), icon: Scale, to: '/compare' },
                    { label: 'Scholarships', desc: 'Check eligibility', icon: Award, to: '/colleges' },
                    { label: 'Global Study', desc: '15 destinations', icon: Globe, to: '/study-abroad' },
                    { label: 'Career Advisor', desc: 'Personal guidance', icon: MessageCircle, to: '/advisor' },
                  ].map(item => (
                    <Link key={item.label} to={item.to} className="group flex items-center gap-3 p-3 rounded-xl border border-line hover:border-brand-200 hover:bg-brand-50/50 transition-colors">
                      <span className="w-9 h-9 rounded-lg bg-ink text-white flex items-center justify-center shrink-0 group-hover:bg-brand-600 transition-colors"><item.icon className="w-4 h-4" /></span>
                      <span className="min-w-0">
                        <span className="text-sm font-semibold text-ink leading-none block">{item.label}</span>
                        <span className="text-xs text-ink-3">{item.desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* ── 7. CAREER ADVISOR — personal consultant, not chat box ── */}
            <FadeIn delay={0.16} className="mt-8">
              <div className="bg-ink text-white rounded-2xl p-6 sm:p-7 relative overflow-hidden">
                <div className="absolute inset-0 bg-mesh-dark opacity-60" />
                <Swoosh variant="dark" />
                <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <p className="eyebrow text-white/60 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-cyan-300" /> Your Career Advisor</p>
                    <h3 className="font-ui font-bold text-xl sm:text-2xl tracking-[-0.02em] mt-2">Have questions about your result?</h3>
                    <p className="text-sm text-white/70 mt-2 leading-relaxed max-w-xl">Explore your options with your personalized advisor — it already knows your profile and result, so you won't repeat yourself.</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {['What should I study next?', 'Which colleges offer this?', 'What skills should I build?', 'Can I study this abroad?'].map(q => (
                        <Link key={q} to="/advisor" className="text-xs font-medium bg-white/10 border border-white/15 text-white rounded-full px-3 py-1.5 hover:bg-white/15 transition-colors">{q}</Link>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col gap-3 lg:items-end">
                    <Link to="/advisor" className="inline-flex items-center justify-center gap-2 bg-white text-ink font-semibold px-6 py-3 rounded-xl hover:bg-paper transition-colors">
                      Talk to my Career Advisor <ArrowRight className="w-4 h-4" />
                    </Link>
                    <span className="text-xs text-white/50 text-center lg:text-right">Grounded in your answers · No generic advice</span>
                  </div>
                </div>
              </div>
              {/* Keep existing interactive advisor below for continuity */}
              <div className="mt-6">
                <AICareerAdvisor userType={stageUserType} answersOverride={effective.answers} />
              </div>
            </FadeIn>

            {/* ── 8. COLLEGE DISCOVERY ── */}
            {matchedColleges.length > 0 && (
              <FadeIn delay={0.18} className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-ui font-bold text-xl tracking-[-0.02em] text-ink">Colleges that match your path</h3>
                  <Link to="/colleges" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">Explore all colleges <ArrowRight className="w-3.5 h-3.5" /></Link>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {matchedColleges.map(inst => (
                    <Link key={inst.slug} to={`/colleges/${inst.slug}`} className="group bg-white border border-line rounded-2xl p-5 hover:border-brand-200 hover:shadow-sm transition-all flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">{inst.institutionType || 'Verified'}</span>
                        <Bookmark className="w-3.5 h-3.5 text-ink-3" />
                      </div>
                      <h4 className="font-ui font-semibold text-ink mt-3 leading-tight group-hover:text-brand-700 line-clamp-2">{inst.name}</h4>
                      <p className="text-xs text-ink-3 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {inst.location || inst.city}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(inst.courses||[]).slice(0,2).map((c,i)=><span key={i} className="text-xs bg-paper border border-line rounded-full px-2 py-1">{c.degree}</span>)}
                      </div>
                      <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:text-brand-700">View College <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></span>
                    </Link>
                  ))}
                </div>
                <Link to="/colleges" className="sm:hidden mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">Explore all colleges <ArrowRight className="w-3.5 h-3.5" /></Link>
              </FadeIn>
            )}

            {/* ── 9. SCHOLARSHIPS ── */}
            {matchedScholarships.length > 0 && (
              <FadeIn delay={0.2} className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-ui font-bold text-xl tracking-[-0.02em] text-ink">Scholarships you may be eligible for</h3>
                  <Link to="/colleges" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">Explore scholarships <ArrowRight className="w-3.5 h-3.5" /></Link>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {matchedScholarships.map(s => (
                    <div key={s.id} className="bg-white border border-line rounded-2xl p-5 flex flex-col">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 w-fit"><Award className="w-3 h-3" /> Potential Match</span>
                      <h4 className="font-semibold text-sm text-ink mt-3 leading-tight line-clamp-2">{s.name}</h4>
                      <p className="text-xs text-ink-3 mt-1">{s.provider_name}</p>
                      <p className="text-xs font-medium text-ink mt-2">{s.tuition_coverage || s.funding_type}</p>
                      <div className="mt-3 flex gap-2">
                        <Link to={`/scholarships/${s.id}`} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-ink text-white hover:bg-brand-950">View details</Link>
                        <span className="text-xs text-ink-3 self-center">Check eligibility</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink-3 mt-3">Final eligibility is determined by the provider — verify on the official website.</p>
              </FadeIn>
            )}

            {/* ── 10. GLOBAL STUDY ── */}
            <FadeIn delay={0.22} className="mt-8">
              <div className="bg-white border border-line rounded-2xl p-6 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <p className="eyebrow text-brand-600">Thinking beyond India?</p>
                    <h3 className="font-ui font-bold text-xl tracking-[-0.02em] text-ink mt-1">Explore global study</h3>
                    <p className="text-sm text-ink-2 mt-1">Countries that align with your direction — costs, post-study work and course compatibility.</p>
                  </div>
                  <Link to="/study-abroad" className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-ink text-white hover:bg-brand-950">Explore Global Study <Globe className="w-4 h-4" /></Link>
                </div>
                <div className="mt-6 grid sm:grid-cols-3 gap-4">
                  {globalPreview.map(c => (
                    <Link key={c.id} to="/study-abroad" className="group border border-line rounded-xl p-4 hover:border-brand-200 hover:bg-brand-50/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{c.code ? String.fromCodePoint(...[...c.code.toUpperCase()].map(ch=>0x1F1E6+ch.charCodeAt(0)-65)) : '🌍'}</span>
                        <span className="font-semibold text-sm text-ink group-hover:text-brand-700">{c.name}</span>
                        <span className="text-xs text-ink-3 ml-auto">{c.region}</span>
                      </div>
                      <p className="text-xs text-ink-2 mt-2 line-clamp-2">{c.studyStrengths?.slice(0,2).join(' · ')}</p>
                      <p className="text-xs text-ink-3 mt-2">{c.tuitionRange.min===0 ? 'Low tuition' : `${c.currency} ${c.tuitionRange.min.toLocaleString()}–${c.tuitionRange.max.toLocaleString()}/yr`}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Reset */}
            <FadeIn delay={0.24} className="mt-8 text-center">
              <Link to="/get-started" className="inline-flex items-center gap-1.5 text-sm text-ink-3 hover:text-ink">
                <RotateCcw className="w-3.5 h-3.5" /> Start over with a fresh assessment
              </Link>
            </FadeIn>
          </>
        )}

        {/* No-profile nudge */}
        {!hasProfile && (
          <FadeIn delay={0.2} className="mt-8">
            <div className="bg-brand-950 text-white rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-mesh-dark opacity-80" />
              <Swoosh variant="dark" />
              <span className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0"><Clock className="w-5 h-5" /></span>
              <div className="relative flex-1">
                <h3 className="font-ui font-semibold">About two minutes to a clear path</h3>
                <p className="text-sm text-white/70 mt-1">Answer a few honest questions and see your options compared and explained.</p>
              </div>
              <Link to="/get-started" className="relative shrink-0"><Button className="bg-white text-ink hover:bg-brand-50">Start <ArrowRight className="w-4 h-4" /></Button></Link>
            </div>
          </FadeIn>
        )}

        <UpgradeModal open={showProModal} onClose={()=>setShowProModal(false)} feature="pdf_reports" />
      </div>
    </div>
  );
}

function sideBySideLabel(items) {
  if (!items || items.length === 0) return 'Side-by-side compare';
  return `${items.length} saved`;
}
