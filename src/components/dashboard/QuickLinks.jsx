import { Link } from 'react-router-dom';
import { BookOpen, Building2, Scale, Compass } from 'lucide-react';
import { SectionTitle } from './DashboardHeader';

const LINKS = [
  { to: '/compare', icon: BookOpen, label: 'Explore Courses', desc: 'Find the right courses for you' },
  { to: '/colleges', icon: Building2, label: 'Find Colleges', desc: 'Discover colleges and programs' },
  { to: '/colleges/compare', icon: Scale, label: 'Compare Colleges', desc: 'Compare colleges easily' },
  { to: '/study-abroad', icon: Compass, label: 'Career Resources', desc: 'Guides, pathways & more' },
];

export default function QuickLinks() {
  return (
    <section aria-labelledby="quick-links">
      <SectionTitle title="Quick Links" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {LINKS.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            className="group bg-white border border-line rounded-2xl p-4 hover:border-brand-200 hover:shadow-sm transition-all"
          >
            <span className="w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center group-hover:bg-brand-600 transition-colors">
              <l.icon className="w-4 h-4" />
            </span>
            <span className="block text-sm font-semibold text-ink mt-3">{l.label}</span>
            <span className="block text-xs text-ink-3 mt-0.5">{l.desc}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
