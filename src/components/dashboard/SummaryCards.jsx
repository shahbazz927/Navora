import { Link } from 'react-router-dom';
import { Trophy, BookOpen, Building2, ListChecks } from 'lucide-react';

export default function SummaryCards({ careerCount, courseCount, collegeCount, userType }) {
  const recPath = userType ? `/recommendations/${userType}` : '/get-started';
  const cards = [
    { icon: Trophy, label: 'Top Career Matches', value: careerCount > 0 ? `${careerCount} personalized option${careerCount === 1 ? '' : 's'}` : 'Complete your profile', to: recPath },
    { icon: BookOpen, label: 'Recommended Courses', value: courseCount > 0 ? `${courseCount} best match${courseCount === 1 ? '' : 'es'}` : 'Get recommendations', to: '/compare' },
    { icon: Building2, label: 'College Shortlist', value: collegeCount > 0 ? `${collegeCount} college${collegeCount === 1 ? '' : 's'}` : 'Explore colleges', to: '/colleges' },
    { icon: ListChecks, label: 'Next Steps', value: '30-day action plan', to: '#action-plan' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="list" aria-label="Summary">
      {cards.map((c) => (
        <Link key={c.label} to={c.to} role="listitem" className="bg-white border border-line rounded-2xl p-4 hover:border-brand-200 hover:shadow-sm transition-all">
          <c.icon className="w-5 h-5 text-brand-600" />
          <p className="text-xs text-ink-3 mt-3">{c.label}</p>
          <p className="text-sm font-semibold text-ink mt-0.5 leading-snug">{c.value}</p>
        </Link>
      ))}
    </div>
  );
}
