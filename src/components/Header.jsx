import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, LogOut, ChevronDown, Building2, Scale, Bookmark, GraduationCap, Globe } from 'lucide-react';
import Logo from './Logo';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';

const exploreLinks = [
  { to: '/colleges', icon: Building2, label: 'All Colleges', desc: 'Browse the full directory' },
  { to: '/colleges?level=UG', icon: GraduationCap, label: 'UG Colleges', desc: 'Pathways after Class 12' },
  { to: '/colleges?level=PG', icon: GraduationCap, label: 'PG Colleges', desc: 'Pathways after graduation' },
  { to: '/study-abroad', icon: Globe, label: 'Global Study', desc: 'Countries & universities abroad' },
  { to: '/colleges/compare', icon: Scale, label: 'Compare Colleges', desc: 'Decide side by side' },
  { to: '/colleges/saved', icon: Bookmark, label: 'Saved', desc: 'Your shortlist' },
];

const primaryLinks = [
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/parents', label: 'For Parents' },
];

const appLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/advisor', label: 'AI Advisor' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setExploreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExploreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (to) => {
    const [path] = to.split('?');
    return path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  };
  const isExploreActive =
    location.pathname.startsWith('/colleges') || location.pathname.startsWith('/study-abroad');

  const linkCls = (active) =>
    `relative px-1 py-2 text-[0.9rem] font-medium tracking-[-0.01em] transition-colors ${
      active ? 'text-ink' : 'text-ink-2 hover:text-ink'
    }`;

  const ActiveBar = () => (
    <motion.span
      layoutId="nav-active"
      className="absolute -bottom-[1px] left-0 right-0 h-[2px] rounded-full bg-brand-500"
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    />
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl shadow-[0_1px_0_0_var(--color-line),0_10px_30px_-18px_rgba(11,30,61,0.25)]'
          : 'bg-white/60 backdrop-blur-md border-b border-line/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center shrink-0" aria-label="NAVORA home">
            <Logo size="md" />
          </Link>

          {/* ── Desktop nav ─────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Primary">
            {/* Explore dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setExploreOpen(!exploreOpen)}
                aria-expanded={exploreOpen}
                className={`inline-flex items-center gap-1 py-2 text-[0.9rem] font-medium tracking-[-0.01em] transition-colors cursor-pointer ${
                  isExploreActive ? 'text-ink' : 'text-ink-2 hover:text-ink'
                }`}
              >
                Explore
                <ChevronDown
                  className={`w-3.5 h-3.5 text-ink-3 transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isExploreActive && (
                <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] rounded-full bg-brand-500" />
              )}

              <AnimatePresence>
                {exploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-1/2 -translate-x-1/2 mt-3 w-[26rem] bg-white rounded-2xl border border-line shadow-card-lg p-2.5 z-50"
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {exploreLinks.map((l) => (
                        <Link
                          key={l.to + l.label}
                          to={l.to}
                          className="group flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50/70 transition-colors"
                        >
                          <span className="mt-0.5 w-8 h-8 rounded-lg bg-paper border border-line flex items-center justify-center shrink-0 group-hover:border-brand-200 group-hover:bg-white transition-colors">
                            <l.icon className="w-4 h-4 text-brand-600" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[0.85rem] font-semibold text-ink leading-tight">
                              {l.label}
                            </span>
                            <span className="block text-xs text-ink-3 leading-snug mt-0.5">{l.desc}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {primaryLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link key={link.to} to={link.to} aria-current={active ? 'page' : undefined} className={linkCls(active)}>
                  {link.label}
                  {active && <ActiveBar />}
                </Link>
              );
            })}

            {user && (
              <>
                <span className="w-px h-5 bg-line" aria-hidden="true" />
                {appLinks.map((link) => {
                  const active = isActive(link.to);
                  return (
                    <Link key={link.to} to={link.to} aria-current={active ? 'page' : undefined} className={linkCls(active)}>
                      {link.label}
                      {active && <ActiveBar />}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* ── Desktop actions ─────────────────────────── */}
          <div className="hidden lg:flex items-center gap-2.5">
            {user ? (
              <>
                <Link
                  to="/get-started"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ink text-white font-ui font-semibold text-[0.83rem] px-4 py-2 hover:bg-brand-950 transition-all hover:-translate-y-px"
                >
                  Start Your Path
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/account"
                  className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-paper-deep transition-colors"
                  aria-label="View account"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-950 text-white font-ui font-semibold text-[0.8rem]">
                    {(user.name || user.email || '?').charAt(0).toUpperCase()}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  aria-label="Sign out"
                  title="Sign out"
                  className="p-2 rounded-full text-ink-3 hover:text-error hover:bg-paper-deep transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-[0.88rem] font-semibold text-ink-2 hover:text-ink transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/get-started"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold text-[0.85rem] px-5 py-2.5 shadow-brand transition-all hover:-translate-y-px"
                >
                  Start Your Path
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile toggle ───────────────────────────── */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 -mr-2 rounded-lg text-ink hover:bg-paper-deep transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-line bg-white overflow-hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="px-5 py-4 space-y-5">
              <div>
                <p className="px-3 text-[0.7rem] font-semibold text-ink-3 uppercase tracking-[0.12em] mb-1">
                  Explore
                </p>
                {exploreLinks.map((l) => (
                  <Link
                    key={l.to + l.label}
                    to={l.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.92rem] font-medium text-ink-2 hover:bg-paper hover:text-ink transition-colors"
                  >
                    <l.icon className="w-4 h-4 text-brand-600 shrink-0" />
                    {l.label}
                  </Link>
                ))}
              </div>

              <div>
                <p className="px-3 text-[0.7rem] font-semibold text-ink-3 uppercase tracking-[0.12em] mb-1">
                  Company
                </p>
                {primaryLinks.map((link) => {
                  const active = isActive(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`block px-3 py-2.5 rounded-xl text-[0.92rem] font-medium transition-colors ${
                        active ? 'text-brand-700 bg-brand-50' : 'text-ink-2 hover:bg-paper hover:text-ink'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {user && (
                <div>
                  <p className="px-3 text-[0.7rem] font-semibold text-ink-3 uppercase tracking-[0.12em] mb-1">
                    Your Space
                  </p>
                  {appLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block px-3 py-2.5 rounded-xl text-[0.92rem] font-medium text-ink-2 hover:bg-paper hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              <div className="pt-1 space-y-2 border-t border-line/60">
                {user ? (
                  <div className="pt-3">
                    <Link
                      to="/account"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-paper transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-950 text-white font-ui font-semibold text-sm">
                        {(user.name || user.email || '?').charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink truncate">{user.name || user.email}</p>
                        <p className="text-xs text-ink-3">View account</p>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="mt-1.5 text-xs text-ink-3 hover:text-error flex items-center gap-1.5 px-3 py-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign out
                    </button>
                    <Link
                      to="/get-started"
                      className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-ink text-white font-ui font-semibold text-sm px-5 py-3"
                    >
                      Start Your Path
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="pt-3 space-y-2">
                    <Link
                      to="/get-started"
                      className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-ui font-semibold text-sm px-5 py-3 shadow-brand transition-colors"
                    >
                      Start Your Path
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-xl text-sm font-semibold text-ink-2 hover:text-ink px-5 py-2.5 transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
