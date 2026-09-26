import {
  ShieldCheck,
  Compass,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react';
import studentLaptopImage from '../assets/images/indian_student_laptop_1789576926360.jpg';

export default function StudentExplorationSection() {
  return (
    <section className="py-20 sm:py-24 bg-surface border-t border-line overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Photo Column: Indian student with laptop */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative max-w-lg mx-auto lg:mx-0">
              {/* Subtle ambient blur */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-100/60 via-paper to-brand-200/40 rounded-[2.5rem] blur-xl pointer-events-none" />

              {/* Main Photo Card */}
              <div className="relative rounded-[2rem] overflow-hidden border border-line bg-white shadow-card-lg group">
                <img
                  src={studentLaptopImage}
                  alt="Indian student exploring career options and colleges on laptop"
                  className="w-full h-[400px] sm:h-[460px] object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />

                {/* Bottom caption overlay */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-1.5">
                    <Sparkles className="w-3 h-3 text-brand-300" />
                    Independent Discovery
                  </div>
                  <p className="font-ui font-semibold text-base sm:text-lg leading-snug">
                    Explore streams, degrees, and college realities at your own pace.
                  </p>
                </div>
              </div>

              {/* Floating Badge: Privacy */}
              <div className="absolute -top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-sm border border-line rounded-2xl shadow-card-lg p-3.5 flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-ui font-bold text-xs text-ink leading-tight">
                    100% Private & Free
                  </p>
                  <p className="text-[0.7rem] text-ink-3">No coaching ads or sales calls</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy Column */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-3.5 py-1 text-xs font-semibold text-brand-700 uppercase tracking-wider mb-4">
              <Compass className="w-3.5 h-3.5" />
              Student-First Guidance
            </span>

            <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight text-balance">
              Find clarity on your own terms,{' '}
              <span className="text-brand-500">right on your screen.</span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-ink-2 leading-relaxed">
              Choosing what to study next is one of the most important decisions you’ll make. NAVORA gives you honest numbers, realistic cutoffs, and calm guidance — without the noise, pressure, or sponsored rankings.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-paper border border-line">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-ui font-semibold text-ink text-sm">
                    Explore without anyone judging
                  </p>
                  <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                    Compare MPC, BiPC, Commerce, Arts, or Polytechnic options quietly. See what each path really requires before making any commitment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-paper border border-line">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-ui font-semibold text-ink text-sm">
                    Real numbers and verified cutoffs
                  </p>
                  <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                    See realistic college fee ranges, hostel realities, and actual entrance exam criteria instead of inflated marketing promises.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-paper border border-line">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-ui font-semibold text-ink text-sm">
                    Sensible backup plans from day one
                  </p>
                  <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                    Great careers don’t depend on a single exam. We map high-value alternative routes so you always have a secure, rewarding path forward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
