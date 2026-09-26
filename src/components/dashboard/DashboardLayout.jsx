import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu, X, Home, Compass, BookOpen, Building2, MessageCircle, User,
  Settings, Sparkles, GitCompare, Map, FileText, Users,
} from 'lucide-react';
import Logo from '../Logo';
import { useUser } from '../../context/UserContext';

const FREE_NAV = [
  { to: '/dashboard', label: 'Home', icon: Home, end: true },
  { to: '/get-started', label: 'Career Explorer', icon: Compass },
  { to: '/compare', label: 'Courses', icon: BookOpen },
  { to: '/colleges', label: 'Colleges', icon: Building2 },
  { to: '/advisor', label: 'AI Advisor', icon: MessageCircle },
  { to: '/account', label: 'My Profile', icon: User },
];

const PRO_NAV = [
  { to: '/dashboard', label: 'Home', icon: Home, end: true },
  { to: '/account', label: 'My Profile', icon: User },
  { to: '/get-started', label: 'Career Explorer', icon: Compass },
  { to: '/compare', label: 'Courses', icon: BookOpen },
  { to: '/colleges', label: 'Colleges', icon: Building2 },
  { to: '/colleges/compare', label: 'Comparisons', icon: GitCompare },
  { to: '/dashboard?view=roadmap', label: 'Roadmap', icon: Map },
  { to: '/advisor', label: 'AI Advisor', icon: MessageCircle },
  { to: '/dashboard?view=reports', label: 'Reports', icon: FileText },
  { to: '/parents', label: 'Parent Summary', icon: Users },
];

function SidebarBody({ isPro, onNavigate }) {
  const nav = isPro ? PRO_NAV : FREE_NAV;
  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[0.88rem] font-medium transition-colors ${
      isActive ? 'bg-white/10 text-white' : 'text-white/65 hover:text-white hover:bg-white/5'
    }`;
  return (
    <div className="flex flex-col h-full">
      <Link to="/" className="flex items-center gap-2.5 px-4 pt-5 pb-6" onClick={onNavigate} aria-label="NAVORA home">
        <span className="inline-flex items-center rounded-xl bg-white px-3 py-1.5"><Logo size="sm" /></span>
        {isPro && (
          <span className="ml-auto inline-flex items-center gap-1 text-[0.65rem] font-bold tracking-[0.12em] uppercase bg-gradient-to-r from-violet-500 to-brand-500 text-white rounded-full px-2.5 py-1">
            <Sparkles className="w-3 h-3" /> Pro
          </span>
        )}
      </Link>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto" aria-label="Dashboard">
        {nav.map((l) => (
          <NavLink key={l.to + l.label} to={l.to} end={l.end} className={linkCls} onClick={onNavigate}>
            <l.icon className="w-[1.1rem] h-[1.1rem] shrink-0" aria-hidden="true" />
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 pt-4 border-t border-white/10 space-y-1">
        {!isPro && (
          <Link
            to="/pricing"
            onClick={onNavigate}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-brand-500 hover:from-violet-500 hover:to-brand-400 text-white font-semibold text-[0.85rem] px-4 py-2.5 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Upgrade to Pro
          </Link>
        )}
        <NavLink
          to="/account"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[0.88rem] font-medium text-white/65 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Settings className="w-[1.1rem] h-[1.1rem] shrink-0" aria-hidden="true" />
          Settings
        </NavLink>
      </div>
    </div>
  );
}

export default function DashboardLayout({ isPro, user, children }) {
  const [drawer, setDrawer] = useState(false);
  const location = useLocation();
  const initial = (user?.user_metadata?.full_name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-paper lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[250px] shrink-0">
        <div className="fixed inset-y-0 w-[250px] bg-[#0A192F] text-white">
          <SidebarBody isPro={isPro} />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-[#0A192F] text-white">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" aria-label="NAVORA home">
            <span className="inline-flex items-center rounded-xl bg-white px-3 py-1.5"><Logo size="sm" /></span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/account"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm font-semibold"
              aria-label="Your profile"
            >
              {initial}
            </Link>
            <button
              onClick={() => setDrawer(true)}
              className="p-2 -mr-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Dashboard menu">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-[270px] max-w-[85vw] bg-[#0A192F] text-white flex flex-col">
            <div className="flex items-center justify-end p-3">
              <button
                onClick={() => setDrawer(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <SidebarBody isPro={isPro} onNavigate={() => setDrawer(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main key={location.search} className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-16">{children}</div>
      </main>
    </div>
  );
}
