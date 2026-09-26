import { Link } from 'react-router-dom';
import { Check, X, Sparkles, ArrowRight } from 'lucide-react';
import { PLANS, track } from '../lib/entitlements';
import { useSubscription } from '../hooks/useSubscription';

function Pill({children}){ return <span className="inline-flex items-center rounded-full bg-paper border border-line px-2.5 py-1 text-xs font-medium text-ink-2">{children}</span>; }

export default function Pricing(){
  const { isPro, sub } = useSubscription();
  return (
    <div className="bg-paper-gradient min-h-screen">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16 text-center">
        <p className="eyebrow text-brand-600">Pricing — Simple & Transparent</p>
        <h1 className="font-ui font-bold text-3xl sm:text-5xl text-ink tracking-[-0.03em] mt-3">Your future deserves a clearer path.</h1>
        <p className="mt-4 text-lg text-ink-2 max-w-2xl mx-auto">Explore your possibilities for free. Upgrade when you are ready for deeper, personalized guidance.</p>
        <p className="mt-2 text-sm text-ink-3 max-w-2xl mx-auto">Start with NAVORA Free and explore careers, courses, colleges and pathways. Upgrade to NAVORA Pro when you want deeper personalization, comparisons and a clear education roadmap.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/get-started" onClick={()=>track('pricing_plan_view',{plan:'free'})} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3">Start Free <ArrowRight className="w-4 h-4" /></Link>
          <a href="#pro" onClick={()=>track('pricing_plan_view',{plan:'pro'})} className="inline-flex items-center gap-2 rounded-xl bg-white border border-line font-semibold px-6 py-3 hover:border-brand-200"><Sparkles className="w-4 h-4 text-brand-600" /> Explore Pro</a>
        </div>
        {isPro && <p className="mt-4 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 inline-block rounded-full px-4 py-1.5">You are currently using NAVORA Pro {sub.expires_at ? `· Active until ${new Date(sub.expires_at).toLocaleDateString()}` : ''}</p>}
      </section>

      {/* Cards */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-12 grid md:grid-cols-2 gap-6">
        {/* Free */}
        <div className="bg-white border border-line rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col">
          <p className="eyebrow text-ink-3">NAVORA Free — Explore</p>
          <p className="text-3xl font-bold text-ink mt-2">₹0 <span className="text-sm font-medium text-ink-3">Forever</span></p>
          <p className="text-sm text-ink-2 mt-2">For students beginning their education and career journey.</p>
          <ul className="mt-5 space-y-2 text-sm">
            {['Basic profile & onboarding','Career assessment','Career exploration','Basic career recommendations (top 3)','Basic career pathways','Basic college discovery','Basic Global Study exploration','AI Advisor (5/day)','Basic dashboard','Limited saved items (5)'].map(f=>(
              <li key={f} className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 mt-0.5" />{f}</li>
            ))}
            {['Personalized roadmap — Locked','Detailed reports — Locked','Advanced college info — Locked','Course comparison — Locked','Detailed Global Study — Locked'].map(f=>(
              <li key={f} className="flex gap-2 text-ink-3"><X className="w-4 h-4 mt-0.5" />{f}</li>
            ))}
          </ul>
          <Link to="/get-started" className="mt-6 inline-flex justify-center rounded-xl bg-ink text-white font-semibold px-5 py-3 hover:bg-brand-950">Start Free</Link>
        </div>
        {/* Pro */}
        <div id="pro" className="bg-brand-950 text-white rounded-2xl p-6 sm:p-7 shadow-card-lg border border-brand-800 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-dark opacity-40" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase bg-white text-brand-950 rounded-full px-3 py-1">Recommended for deeper guidance</span>
            <p className="eyebrow text-white/60 mt-3">NAVORA Pro — Navigate</p>
            <p className="text-3xl font-bold mt-2">₹999<span className="text-base font-medium text-white/70">/year</span> <span className="text-xs font-normal text-white/50">≈ ₹83/month</span></p>
            <p className="text-sm text-white/70 mt-1">Your complete NAVORA guidance experience.</p>
            <p className="text-sm text-white/60">For students ready to make informed education decisions.</p>
            <ul className="mt-5 space-y-2 text-sm text-white/90">
              {['Everything in Free','Full career recommendations','Detailed & alternative pathways','Course-to-career connections','Skills analysis','Personalized education roadmap','Profile-aware AI Advisor (30/day + history)','Full college database & detailed info','College comparison up to 10 & course comparison','Scholarship & entrance-exam info','Full Global Study + country (10) & university (20/mo) comparison','Course-country matching','Personalized & parent reports + downloadable PDF','Unlimited saved recommendations'].map(f=>(
                <li key={f} className="flex gap-2"><Check className="w-4 h-4 text-cyan-300 mt-0.5" />{f}</li>
              ))}
            </ul>
            {!isPro ? (
              <button onClick={()=>{
                track('pro_checkout_started');
                // provider-ready: if configured, redirect to real checkout; else show modal/info
                const url = import.meta.env.VITE_CHECKOUT_URL;
                if(url) window.location.href = url;
                else alert('Checkout will be available once payment provider is configured. Your plan config is ready (₹999/year). Please set VITE_CHECKOUT_URL.');
              }} className="mt-6 w-full inline-flex justify-center rounded-xl bg-white text-brand-950 font-bold px-5 py-3 hover:bg-brand-50">Start Pro — ₹999/year</button>
            ) : (
              <p className="mt-6 text-center text-sm font-semibold bg-white/10 border border-white/20 rounded-xl py-3">You are on NAVORA Pro</p>
            )}
            <p className="text-xs text-white/50 mt-3 text-center">Annual billing · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Value */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <div className="bg-white border border-line rounded-2xl p-6 sm:p-8">
          <h2 className="font-ui font-bold text-2xl text-ink">Free helps you explore. Pro helps you connect the dots.</h2>
          <p className="text-sm text-ink-2 mt-2">With NAVORA Free, you can explore careers, courses, colleges and possibilities. With Pro, NAVORA connects those possibilities to your profile, your goals and your next steps.</p>
          <div className="grid sm:grid-cols-4 gap-4 mt-6">
            {[
              {k:'Explore',d:"Understand what's possible."},
              {k:'Compare',d:'Put careers, courses and colleges side by side.'},
              {k:'Personalize',d:'See what aligns with your interests, strengths and goals.'},
              {k:'Plan',d:'Turn information into a practical education roadmap.'},
            ].map(s=>(
              <div key={s.k} className="bg-paper rounded-xl p-4 border border-line/60">
                <p className="font-semibold text-ink text-sm">{s.k}</p>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
          <Link to="/pricing" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600">Go deeper with NAVORA Pro <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-10">
        <h2 className="font-ui font-bold text-xl text-ink">Free vs Pro — at a glance</h2>
        {/* Desktop table, mobile cards */}
        <div className="hidden sm:block mt-4 bg-white border border-line rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-wider bg-paper border-b border-line">
            <div className="px-4 py-3">Feature</div><div className="px-4 py-3 text-center">Free</div><div className="px-4 py-3 text-center bg-brand-950 text-white">Pro</div>
          </div>
          {[
            ['Guidance','—','—'],
            ['Career recommendations','Top 3','Full'],
            ['Career pathways','Basic / Preview','Full + alternatives'],
            ['Personalized roadmap','—','Yes'],
            ['AI Advisor','5/day · Limited','30/day · Profile-aware + history'],
            ['College discovery','Limited preview','Full'],
            ['College comparison','2','10'],
            ['Global Study detailed','Preview','Full'],
            ['Country comparison','2','10'],
            ['University comparison','Limited','20/month'],
            ['Reports / PDF','—','Yes'],
            ['Parent summary','Preview','Full'],
            ['Saved recommendations','5','Unlimited'],
          ].map(([f,fr,pr])=>(
            <div key={f} className="grid grid-cols-3 text-sm border-b border-line/60 last:border-0">
              <div className="px-4 py-3 font-medium text-ink">{f}</div>
              <div className="px-4 py-3 text-center text-ink-2">{fr}</div>
              <div className="px-4 py-3 text-center bg-brand-50/50 font-semibold text-ink">{pr}</div>
            </div>
          ))}
        </div>
        <div className="sm:hidden mt-4 space-y-3">
          {[
            {cat:'Guidance',free:'Top 3, basic pathways',pro:'Full + roadmap'},
            {cat:'AI Advisor',free:'5/day limited',pro:'30/day + history'},
            {cat:'College Intelligence',free:'Preview, compare 2',pro:'Full, compare 10, exams & scholarships'},
            {cat:'Global Study',free:'Preview, compare 2',pro:'Full, compare 10, course match + scholarships'},
            {cat:'Reports',free:'Basic results',pro:'Personalized + PDF + parent summary'},
            {cat:'Saved Content',free:'5 recommendations',pro:'Unlimited'},
          ].map(r=>(
            <div key={r.cat} className="bg-white border border-line rounded-xl p-4">
              <p className="font-semibold text-ink">{r.cat}</p>
              <p className="text-xs text-ink-3 mt-1">Free: {r.free}</p>
              <p className="text-xs font-semibold text-brand-700 mt-0.5">Pro: {r.pro}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-12">
        <h2 className="font-ui font-bold text-xl text-ink">Frequently asked questions</h2>
        <div className="mt-4 bg-white border border-line rounded-2xl divide-y divide-line">
          {[
            ['Is NAVORA Free?','Yes. NAVORA\'s core exploration experience is available for free. You can explore careers, courses, pathways and colleges without paying.'],
            ['What does NAVORA Pro unlock?','Pro provides deeper personalization, expanded AI Advisor access, detailed career pathways, college comparisons, personalized roadmaps, Global Study tools and downloadable reports.'],
            ['Do I need Pro to use the AI Advisor?','No. Free users can use the AI Advisor with a daily usage limit. Pro provides a higher usage allowance and deeper profile-aware guidance.'],
            ['Can I use NAVORA without a subscription?','Yes. You can use NAVORA Free indefinitely.'],
            ['Can parents use NAVORA?','Yes. Parents can access parent-focused guidance and information. Pro provides a deeper parent experience and personalized summaries.'],
            ['Does NAVORA guarantee that a career or college is right for me?','No. NAVORA provides structured information and personalized guidance to help you evaluate options. Education and career decisions should also consider your circumstances, goals, academic performance, finances and other relevant factors.'],
            ['Can I cancel Pro?','Yes. You can cancel according to the applicable billing terms. Your account remains accessible after cancellation, with paid features becoming unavailable when the subscription period ends.'],
            ['Are college fees and admission information guaranteed to be current?','NAVORA aims to provide sourced and regularly updated information, but fees, eligibility, admissions, deadlines and other institutional details can change. Users should verify important information with the relevant institution before making decisions.'],
          ].map(([q,a])=>(
            <details key={q} className="px-5 py-4 group">
              <summary className="font-semibold text-ink text-sm list-none flex justify-between cursor-pointer">{q}<span className="text-ink-3 group-open:rotate-45 transition">+</span></summary>
              <p className="text-sm text-ink-2 mt-2 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-16">
        <div className="bg-brand-950 text-white rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-dark opacity-40" />
          <div className="relative">
            <h2 className="font-ui font-bold text-2xl">Your future deserves more than a guess.</h2>
            <p className="text-sm text-white/70 mt-2">Explore your options. Understand the pathways. Compare your choices. Build a direction that makes sense for you.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/get-started" className="inline-flex items-center gap-2 rounded-xl bg-white text-ink font-semibold px-6 py-3">Start with NAVORA Free</Link>
              <a href="#pro" className="inline-flex items-center gap-2 rounded-xl border border-white/20 text-white font-semibold px-6 py-3">Explore Pro</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
