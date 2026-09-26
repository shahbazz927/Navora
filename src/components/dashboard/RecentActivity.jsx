import { Link } from 'react-router-dom';
import { ClipboardList, MessageCircle, Building2, Award, Scale, Clock } from 'lucide-react';
import { SectionTitle } from './DashboardHeader';
import { relativeTime } from '../../lib/dashboard';

const ICONS = {
  assessment: ClipboardList,
  chat: MessageCircle,
  college: Building2,
  scholarship: Award,
  compare: Scale,
};

export default function RecentActivity({ items = [] }) {
  return (
    <section aria-labelledby="recent-activity">
      <SectionTitle title="Recent Activity" />
      {items.length === 0 ? (
        <div className="bg-white border border-line rounded-2xl p-6 text-center">
          <p className="font-semibold text-ink text-sm">No activity yet</p>
          <p className="text-sm text-ink-2 mt-1">Start exploring careers, courses and colleges to build your NAVORA journey.</p>
          <Link to="/get-started" className="mt-4 inline-flex items-center rounded-xl bg-ink text-white text-sm font-semibold px-5 py-2.5 hover:bg-brand-950 transition-colors">
            Start Exploring
          </Link>
        </div>
      ) : (
        <ul className="bg-white border border-line rounded-2xl divide-y divide-line/70">
          {items.map((a) => {
            const Icon = ICONS[a.icon] || Clock;
            return (
              <li key={a.id} className="flex items-center gap-3 px-4 sm:px-5 py-3.5">
                <span className="w-9 h-9 rounded-xl bg-paper border border-line flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-brand-600" />
                </span>
                <span className="min-w-0 flex-1 text-sm text-ink">{a.text}</span>
                <span className="text-xs text-ink-3 shrink-0">{relativeTime(a.at)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
