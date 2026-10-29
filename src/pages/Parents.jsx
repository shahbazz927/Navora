import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  Check,
  Backpack,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { useScrollTop } from '../hooks/useLocalStorage';
import { useUser } from '../context/UserContext';
import { personas } from '../data/personas';

const pillars = [
  {
    title: 'Education pathways',
    copy: 'Streams after Class 10, courses and colleges after Class 12, and career moves after graduation. The structure of the system, explained without jargon.',
  },
  {
    title: 'Honest comparisons',
    copy: 'Compare colleges on fees, accreditation, courses, and location, so you can weigh value rather than chase a single ranking.',
  },
  {
    title: 'Clear on cost',
    copy: 'Tuition, hostel costs, scholarships, and education loans laid out plainly, so financial decisions are made with open eyes.',
  },
  {
    title: 'Verifiable guidance',
    copy: 'No sponsored lists. Information sources are shown with the data, and you can confirm the details directly with each institution.',
  },
];

const questionsParentsAsk = [
  { q: 'What should my child do after Class 10?', a: 'We map interests and strengths to MPC, BiPC, Commerce, Arts, or vocational paths, with the trade-offs for each.' },
  { q: 'Which college is the better value?', a: 'Compare fees, courses, accreditation, and location side by side, instead of relying on one ranking.' },
  { q: 'What does this course lead to?', a: 'See the degrees, entrance routes, and typical roles connected to a path, and what still needs checking.' },
  { q: 'What will it really cost?', a: 'Tuition, living costs, scholarships, and loan options, laid out as a plan you can discuss together.' },
];

const stageGrid = [
  { icon: Backpack, label: 'After Class 10', text: 'The stream decision, and why it rarely locks you in forever.' },
  { icon: GraduationCap, label: 'After Class 12', text: 'Courses, entrance exams, and colleges matched to your child\'s stream.' },
  { icon: Briefcase, label: 'After graduation', text: 'Higher study, certifications, work, or a considered change of direction.' },
];

const parentPaths = [
  {
    id: 'class10',
    title: 'Class 10',
    copy: 'Explore streams, subjects, and future career options after Class 10.',
    cta: 'Explore Class 10',
    icon: Backpack,
  },
  {
    id: 'class12',
    title: 'Class 12',
    copy: 'Compare courses, entrance exams, colleges, and career options after Class 12.',
    cta: 'Explore Class 12',
    icon: GraduationCap,
  },
  {
    id: 'graduate',
    title: 'Graduation',
    copy: 'Plan higher study, career options, skills, and the next practical step.',
    cta: 'Explore graduation',
    icon: Briefcase,
  },
];

export default function Parents() {
  useScrollTop();
  const navigate = useNavigate();
  const { setUserType } = useUser();

  const startFlow = (stage = null) => {
    setUserType('parent');
    if (stage) {
      navigate(`/assessment?stage=${stage}`, { state: { parentStage: stage } });
    } else {
      navigate('/assessment');
    }
  };

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="bg-paper border-b border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-16 lg:pt-20 lg:pb-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-7">
              <p className="eyebrow text-brand-700">For parents and guardians</p>

              <h1 className="mt-3 font-display font-bold text-[2.5rem] leading-[1.05] sm:text-5xl lg:text-[3.4rem] text-ink text-balance tracking-[-0.028em]">
                You want the best for them. Let&rsquo;s make it clear.
              </h1>

              <p className="mt-6 text-lg text-ink-2 leading-relaxed max-w-xl">
                Your child doesn&rsquo;t need another list of careers. They need help
                understanding which choices fit them, and why. NAVORA asks the right
                questions first, then lays the options out with the costs and
                trade-offs visible.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link to="/assessment" onClick={() => setUserType('parent')}>
                  <Button size="lg">
                    Start the parent assessment
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link to="/advisor">
                  <Button size="lg" variant="secondary">
                    Ask a question
                  </Button>
                </Link>
              </div>

              <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                {['Transparent costs', 'No sponsored lists', 'Private by design'].map((label) => (
                  <li key={label} className="inline-flex items-center gap-1.5 text-sm text-ink-2">
                    <span className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" strokeWidth={3.5} aria-hidden="true" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white rounded-panel border border-line p-6 sm:p-7">
                <div className="flex items-center gap-3 pb-4 border-b border-line">
                  <span className="w-10 h-10 rounded-control bg-brand-50 text-brand-700 flex items-center justify-center">
                    <Users className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-ui font-semibold text-ink">A parent&rsquo;s guide</p>
                    <p className="text-xs text-ink-3">The decisions ahead, in order</p>
                  </div>
                </div>
                <ol className="mt-5 space-y-4">
                  {questionsParentsAsk.map((item, i) => (
                    <li key={item.q} className="flex gap-3.5">
                      <span className="w-6 h-6 rounded-control bg-paper text-brand-700 flex items-center justify-center shrink-0 font-ui font-semibold text-xs">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-ui font-semibold text-sm text-ink">{item.q}</p>
                        <p className="mt-0.5 text-[0.83rem] text-ink-2 leading-relaxed">{item.a}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose a path */}
      <section className="bg-paper border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-20">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow text-brand-700">Choose a starting point</p>
            <h2 className="mt-2 font-display font-bold text-3xl sm:text-4xl text-ink tracking-[-0.024em] text-balance">
              Where is your child right now?
            </h2>
            <p className="mt-3 text-ink-2 leading-relaxed">
              Pick the stage that fits. The questions, comparisons, and recommendations change for each.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {parentPaths.map((item) => {
              const Icon = item.icon;
              const persona = personas[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => startFlow(item.id)}
                  className="group text-left w-full h-full bg-white border border-line rounded-panel p-6 hover:border-brand-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className="w-10 h-10 rounded-control flex items-center justify-center"
                      style={{ backgroundColor: persona.accentSoft, color: persona.accentColor }}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-semibold"
                      style={{ color: persona.accentColor }}
                    >
                      {item.cta}
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-6 font-ui font-bold text-2xl text-ink leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.95rem] text-ink-2 leading-relaxed">
                    {item.copy}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* What parents get */}
      <section className="bg-surface border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-20">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow text-brand-700">What parents get</p>
            <h2 className="mt-2 font-display font-bold text-3xl sm:text-4xl text-ink tracking-[-0.024em] text-balance">
              Decision support for the whole family.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {pillars.map((p, index) => (
              <div key={p.title} className="border-t border-line pt-5">
                <p className="font-ui text-xs font-semibold text-ink-3">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-1.5 font-ui font-semibold text-lg text-ink">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-2 leading-relaxed">{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stage context */}
      <section className="bg-paper border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5">
              <p className="eyebrow text-brand-700">Where your child is</p>
              <h2 className="mt-2 font-display font-bold text-3xl sm:text-4xl text-ink tracking-[-0.024em] text-balance">
                Guidance changes with each stage.
              </h2>
              <p className="mt-4 text-ink-2 leading-relaxed">
                NAVORA tailors the questions and recommendations to your child&rsquo;s
                current stage, interests, and your family&rsquo;s priorities.
              </p>
              <div className="mt-7">
                <Link to="/assessment" onClick={() => setUserType('parent')}>
                  <Button variant="navy" size="lg">
                    Start for your child
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 border-t border-line">
              {stageGrid.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex gap-5 py-5 border-b border-line">
                    <span className="w-10 h-10 rounded-control bg-white border border-line text-brand-700 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-ui font-semibold text-sm text-brand-700">{item.label}</p>
                      <p className="mt-1 text-ink-2 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-950 text-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 text-center">
          <Logo size="md" tone="light" className="mb-6 inline-flex" />
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-[-0.024em] text-balance">
            Help them choose with confidence.
          </h2>
          <p className="mt-4 text-white/75 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            A few honest questions about your child&rsquo;s stage and your priorities,
            and you&rsquo;ll have a clearer view of the decisions ahead.
          </p>
          <div className="mt-8">
            <Link to="/assessment" onClick={() => setUserType('parent')}>
              <Button size="xl">
                Start the parent assessment
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
