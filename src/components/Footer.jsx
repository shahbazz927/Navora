import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Lock, Compass, Mail, Phone } from 'lucide-react';
import Logo from './Logo';
import { CONTACT } from '../config/contact';

const columns = [
  {
    heading: 'Explore',
    links: [
      { label: 'Explore Colleges', to: '/colleges' },
      { label: 'Compare Colleges', to: '/colleges/compare' },
      { label: 'Saved Colleges', to: '/colleges/saved' },
      { label: 'Scholarships', to: '/scholarships' },
      { label: 'Global Study', to: '/study-abroad' },
      { label: 'Get Started', to: '/get-started' },
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'AI Advisor', to: '/advisor' },
    ],
  },
  {
    heading: 'Guidance',
    links: [
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Career Guidance', to: '/career-guidance' },
      { label: 'Class 12 Stream Guidance', to: '/get-started' },
      { label: 'Graduation Pathways', to: '/get-started' },
      { label: 'For Parents Hub', to: '/parents' },
      { label: 'Admin Directory', to: '/admin/colleges' },
      { label: 'Help & FAQ', to: '/help' },
      { label: 'Support Desk', to: '/support' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
      { label: 'Cookies', to: '/cookies' },
      { label: 'Disclaimer', to: '/disclaimer' },
      { label: 'Accessibility', to: '/accessibility' },
      { label: 'Security', to: '/security' },
    ],
  },
];

const trustItems = [
  { icon: Lock, label: 'Private by design' },
  { icon: ShieldCheck, label: 'No account needed' },
];

export default function Footer() {
  return (
    <footer className="relative bg-brand-950 text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Logo size="md" tone="light" className="mb-5" />
            <p className="text-sm text-white/75 leading-relaxed max-w-sm">
              NAVORA helps students and parents move from confusion to confidence,
              with clear and honest guidance on the decisions that shape their future.
            </p>
            <p className="mt-5 font-ui text-sm font-semibold tracking-[0.14em] uppercase text-brand-200">
              Navigate your future.
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs text-white/70">
              <Compass className="w-3.5 h-3.5 text-brand-300" aria-hidden="true" />
              <span>Personalized education and career guidance</span>
            </div>
            <div className="flex items-center gap-2 mt-5 text-[0.7rem] font-ui font-semibold tracking-[0.18em] text-white/70">
              <span>LEARN</span><span className="text-white/35">·</span>
              <span>EXPLORE</span><span className="text-white/35">·</span>
              <span>DECIDE</span><span className="text-white/35">·</span>
              <span>GROW</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-7">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-white/85 bg-white/10 border border-white/15 rounded-control px-3 py-1.5"
                  >
                    <Icon className="w-3.5 h-3.5 text-brand-300" aria-hidden="true" />
                    {item.label}
                  </span>
                );
              })}
            </div>
            <div className="mt-6 space-y-1.5 text-sm">
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-white/75 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-brand-300" aria-hidden="true" /> {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phones[0].replace(/\s/g,'')}`} className="flex items-center gap-2 text-white/75 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-brand-300" aria-hidden="true" /> {CONTACT.phones[0]}
              </a>
              <a href={`tel:${CONTACT.phones[1].replace(/\s/g,'')}`} className="flex items-center gap-2 text-white/75 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-brand-300" aria-hidden="true" /> {CONTACT.phones[1]}
              </a>
            </div>
            <p className="mt-3 text-xs text-white/60">Prototype / pre-incorporation — no registered entity.</p>
          </div>

          {columns.map((col) => (
            <div key={col.heading} className="md:col-span-2">
              <h4 className="font-ui text-xs font-semibold uppercase tracking-[0.14em] text-brand-300 mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/75 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-3">
            <h4 className="font-ui text-xs font-semibold uppercase tracking-[0.14em] text-brand-300 mb-4">Not sure where to begin?</h4>
            <Link
              to="/get-started"
              className="btn btn-primary btn-md"
            >
              Take the 2-minute assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-4 text-xs text-white/70 leading-relaxed">
              Free to start. Private by design. No account needed.
            </p>
          </div>
        </div>

        <div className="mt-14 pt-7 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/70">
            &copy; {new Date().getFullYear()} NAVORA. All rights reserved. · <a href={`mailto:${CONTACT.email}`} className="underline hover:text-white">{CONTACT.email}</a>
          </p>
          <p className="text-xs text-white/70 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            Navigate your future.
          </p>
        </div>
      </div>
    </footer>
  );
}
