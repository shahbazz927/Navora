import { ShieldCheck, Lock } from 'lucide-react';
import studentLaptopImage from '../assets/images/indian_student_laptop_1789576926360.jpg';

const POINTS = [
  {
    title: 'Explore without pressure',
    copy: 'Compare MPC, BiPC, Commerce, Arts, or polytechnic routes quietly. See what each path requires before making a commitment.',
  },
  {
    title: 'Use real directory figures',
    copy: 'See fee ranges, hostel availability, and entrance requirements, with the source noted on each college page.',
  },
  {
    title: 'Keep alternatives open',
    copy: 'Most careers have more than one route. We map the related degrees and lateral options alongside the direct path.',
  },
];

export default function StudentExplorationSection() {
  return (
    <section className="py-16 sm:py-20 bg-surface border-t border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <figure className="max-w-lg mx-auto lg:mx-0">
              <div className="rounded-panel overflow-hidden border border-line bg-paper">
                <img
                  src={studentLaptopImage}
                  alt="Student exploring courses and colleges on a laptop"
                  className="w-full h-[360px] sm:h-[420px] object-cover object-center"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 flex items-start gap-2 text-xs text-ink-3 leading-relaxed">
                <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Private by default. No coaching ads or sales calls.</span>
              </figcaption>
            </figure>
          </div>

          <div className="lg:col-span-6">
            <p className="eyebrow text-brand-700">For students</p>
            <h2 className="mt-2 font-display font-bold text-3xl sm:text-4xl text-ink tracking-[-0.024em] text-balance">
              Explore at your own pace.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-ink-2 leading-relaxed">
              Choosing what to study next is a large decision. NAVORA gives you
              clear figures, realistic requirements, and calm guidance without
              sponsored rankings.
            </p>

            <ol className="mt-7 divide-y divide-line border-y border-line">
              {POINTS.map((point, index) => (
                <li key={point.title} className="grid grid-cols-[2rem_1fr] gap-4 py-4">
                  <span className="font-ui text-sm font-semibold text-brand-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-ui font-semibold text-sm text-ink">{point.title}</p>
                    <p className="mt-1 text-sm text-ink-2 leading-relaxed">{point.copy}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-5 flex items-start gap-2 text-xs text-ink-3 leading-relaxed">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-success" aria-hidden="true" />
              Directory figures are illustrative. Verify fees, deadlines, and eligibility with the institution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
