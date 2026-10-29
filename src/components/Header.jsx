import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';

// Navigation aligned to NAVORA hero reference
const NAV_LINKS = [
  {
    to: '/get-started',
    label: 'Explore',
    isActive: (pathname) => pathname.startsWith('/get-started') || pathname.startsWith('/career-guidance'),
  },
  {
    to: '/colleges',
    label: 'Courses',
    isActive: (pathname) => pathname.startsWith('/colleges') && !pathname.startsWith('/colleges/compare'),
  },
  {
    to: '/career-guidance',
    label: 'Careers',
    isActive: (pathname) => pathname.startsWith('/career-guidance'),
  },
  {
    to: '/colleges',
    label: 'Institutes',
    isActive: (pathname) => pathname.startsWith('/colleges'),
  },
  {
    to: '/how-it-works',
    label: 'Resources',
    isActive: (pathname) => pathname.startsWith('/how-it-works') || pathname.startsWith('/about'),
  },
];

const CTA_TO = '/get-started';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, setUser } = useUser();
  const menuButtonRef = useRef(null);

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

  // Close the mobile menu on every successful navigation.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Allow Escape to close the mobile menu and return focus to the trigger.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  // Signed-out visitors never see the dashboard entry.
  const visibleNavLinks = NAV_LINKS.filter((link) => !link.requiresAuth || user);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mt-3 sm:mt-4">
          <div className="flex items-center justify-between h-[72px] px-4 sm:px-6 lg:px-8 rounded-2xl bg-white/95 backdrop-blur shadow-[0_1px_1px_rgba(15,23,42,0.02),0_10px_40px_rgba(15,23,42,0.08)] border border-white/60">
            <Link to="/" className="flex items-center shrink-0 gap-2" aria-label="NAVORA home">
              <Logo size="lg" />
            </Link>

            {/* ── Desktop nav ─────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10" aria-label="Primary">
              {visibleNavLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`text-sm font-semibold transition-colors ${
                    link.isActive(location.pathname)
                      ? 'text-[#0F1F4D]'
                      : 'text-[#1f2f4d]/80 hover:text-[#0F1F4D]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Desktop actions ─────────────────────────── */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                type="button"
                aria-label="Search"
                className="p-2 rounded-lg text-[#1f2f4d]/80 hover:text-[#0F1F4D] hover:bg-slate-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
              {user ? (
                <>
                  <Link to="/account" className="text-sm font-semibold text-[#1f2f4d]/90 hover:text-[#0F1F4D] px-2">Account</Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-semibold text-[#1f2f4d]/90 hover:text-[#0F1F4D] px-2"
                  >
                    Sign out
                  </button>
                  <Link to={CTA_TO} className="ml-2 inline-flex items-center justify-center rounded-full bg-[#0F1F4D] text-white text-sm font-semibold px-6 py-2.5 hover:bg-[#0b173a] transition-colors shadow-[0_10px_30px_rgba(15,31,77,0.18)]">
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-semibold text-[#1f2f4d]/90 hover:text-[#0F1F4D] px-2">Login</Link>
                  <Link to={CTA_TO} className="ml-2 inline-flex items-center justify-center rounded-full bg-[#0F1F4D] text-white text-sm font-semibold px-6 py-2.5 hover:bg-[#0b173a] transition-colors shadow-[0_10px_30px_rgba(15,31,77,0.18)]">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* ── Mobile toggle ───────────────────────────── */}
            <div className="flex items-center lg:hidden">
              <button
                ref={menuButtonRef}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 -mr-2 rounded-lg text-[#0F1F4D]"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ─────────────────────────────────── */}
        {mobileOpen && (
          <div
            id="mobile-nav"
            className="relative lg:hidden mt-2"
          >
            <div className="rounded-2xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] border border-slate-100 overflow-hidden">
              <nav className="flex flex-col">
                {visibleNavLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="px-5 py-3 text-sm font-semibold text-[#1f2f4d] border-b border-slate-50 last:border-b-0"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="px-5 py-4 flex flex-col gap-2 border-t border-slate-100">
                {user ? (
                  <>
                    <Link to="/account" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-[#1f2f4d]">Account</Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-left text-sm font-semibold text-[#1f2f4d]">Sign out</button>
                    <Link to={CTA_TO} onClick={() => setMobileOpen(false)} className="mt-2 inline-flex items-center justify-center rounded-full bg-[#0F1F4D] text-white text-sm font-semibold px-6 py-2.5">Get Started</Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-[#1f2f4d]">Login</Link>
                    <Link to={CTA_TO} onClick={() => setMobileOpen(false)} className="mt-2 inline-flex items-center justify-center rounded-full bg-[#0F1F4D] text-white text-sm font-semibold px-6 py-2.5">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
