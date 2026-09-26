import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  Wallet,
  Building2,
  Scale,
} from 'lucide-react';
import { COUNTRIES } from '../data/studyAbroad.js';

const COUNTRY_SHOWCASE = [
  {
    id: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    tuition: '₹22L – ₹45L / yr',
    livingCost: '₹10L – ₹14L / yr',
    postStudyWork: 'Up to 36 Months (STEM OPT extension)',
    popularAreas: 'Computer Science, AI, Business Analytics, Data Engineering',
    context: 'World’s deepest venture ecosystem; high tuition compensated by immense tech and biotech internship pay.',
    code: 'US',
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    tuition: '₹16L – ₹30L / yr',
    livingCost: '₹9L – ₹13L / yr',
    postStudyWork: '2-Year Graduate Visa Route',
    popularAreas: '1-Year Master’s, Finance, Law, Artificial Intelligence',
    context: 'Accelerated 1-year master’s degree saves living expenses; historic global financial and research hub.',
    code: 'GB',
  },
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    tuition: '₹0 – ₹3L / yr (Public Tuition Free)',
    livingCost: '₹8L – ₹10.5L / yr (Blocked Account)',
    postStudyWork: '18-Month Jobseeker Visa + EU Blue Card',
    popularAreas: 'Automotive, Mechanical, Robotics, Data Engineering',
    context: 'World-renowned engineering tuition subsidized by federal state; B1/B2 German language opens career doors.',
    code: 'DE',
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    tuition: '₹14L – ₹28L / yr',
    livingCost: '₹8.5L – ₹12L / yr',
    postStudyWork: 'Up to 3-Year PGWP (Post-Graduation Work Permit)',
    popularAreas: 'Software, Health Informatics, Supply Chain, AI',
    context: 'Clear point-based immigration pathway; mandatory co-op degrees offer direct Canadian work experience.',
    code: 'CA',
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    tuition: '₹18L – ₹32L / yr',
    livingCost: '₹10L – ₹14L / yr',
    postStudyWork: '2 to 4-Year Temporary Graduate Visa (Subclass 485)',
    popularAreas: 'Mining & Resources, IT, Nursing, Civil & Construction',
    context: 'High minimum wage allowing 48 hours per fortnight student work; strong regional migration incentives.',
    code: 'AU',
  },
  {
    id: 'ireland',
    name: 'Ireland',
    flag: '🇮🇪',
    tuition: '₹14L – ₹24L / yr',
    livingCost: '₹9L – ₹12.5L / yr',
    postStudyWork: '2-Year Third Level Graduate Scheme (1G)',
    popularAreas: 'Cloud Computing, Cybersecurity, Bio-Pharma, FinTech',
    context: 'European headquarters of Apple, Google, Meta, and Pfizer; English-speaking EU gateway.',
    code: 'IE',
  },
  {
    id: 'france',
    name: 'France',
    flag: '🇫🇷',
    tuition: '₹2.5L – ₹15L / yr (Grandes Écoles vary)',
    livingCost: '₹7.5L – ₹10.5L / yr (CAF Housing Subsidy)',
    postStudyWork: '12-Month APS / Job Search Visa',
    popularAreas: 'Luxury Management, Aerospace Engineering, Applied Mathematics',
    context: 'Generous CAF student housing subsidies; prestigious Grandes Écoles with embedded enterprise apprenticeships.',
    code: 'FR',
  },
  {
    id: 'netherlands',
    name: 'Netherlands',
    flag: '🇳🇱',
    tuition: '₹8L – ₹18L / yr',
    livingCost: '₹9.5L – ₹13L / yr',
    postStudyWork: '1-Year Zoekjaar (Orientation Year Visa)',
    popularAreas: 'Semiconductors (ASML), Water Tech, Logistics, Econometrics',
    context: 'Over 2,100 programs taught 100% in English; dominant European tech and maritime logistics gateway.',
    code: 'NL',
  },
  {
    id: 'italy',
    name: 'Italy',
    flag: '🇮🇹',
    tuition: '₹1L – ₹4L / yr (Public Universities)',
    livingCost: '₹6.5L – ₹9L / yr',
    postStudyWork: '12-Month Permesso di Soggiorno (Job Search)',
    popularAreas: 'Industrial Design, Automotive Engineering, Architecture, Economics',
    context: 'Exceptional value public universities (Politecnico di Milano, Bologna) with low income-linked tuition fees.',
    code: 'IT',
  },
  {
    id: 'sweden',
    name: 'Sweden',
    flag: '🇸🇪',
    tuition: '₹9L – ₹16L / yr',
    livingCost: '₹8L – ₹11L / yr',
    postStudyWork: '12-Month Post-Study Job Search',
    popularAreas: 'Sustainability Engineering, Telecom, Industrial Innovation',
    context: 'Home of Ericsson, Spotify, and Volvo; no legal limit on student part-time working hours.',
    code: 'SE',
  },
  {
    id: 'norway',
    name: 'Norway',
    flag: '🇳🇴',
    tuition: '₹10L – ₹18L / yr (Moderate non-EU fees)',
    livingCost: '₹11L – ₹15L / yr',
    postStudyWork: '1-Year Residence Permit for Job Seeking',
    popularAreas: 'Renewable Energy, Marine Technology, Geoscience',
    context: 'Global leader in offshore engineering and environmental policy with unparalleled standard of living.',
    code: 'NO',
  },
  {
    id: 'spain',
    name: 'Spain',
    flag: '🇪🇸',
    tuition: '₹2.5L – ₹9L / yr',
    livingCost: '₹6.5L – ₹9.5L / yr',
    postStudyWork: '12-Month Job Search Visa',
    popularAreas: 'Top Global MBA (IE, IESE, ESADE), Renewable Energy, Tourism',
    context: 'Affordable Mediterranean living with top 3 world-ranked business schools.',
    code: 'ES',
  },
  {
    id: 'belgium',
    name: 'Belgium',
    flag: '🇧🇪',
    tuition: '₹3L – ₹9L / yr',
    livingCost: '₹7.5L – ₹10L / yr',
    postStudyWork: '12-Month Search Year Visa',
    popularAreas: 'Biotechnology, European Law, Microelectronics (IMEC)',
    context: 'Heart of the European Union; KU Leuven ranked top 50 globally with accessible tuition.',
    code: 'BE',
  },
  {
    id: 'poland',
    name: 'Poland',
    flag: '🇵🇱',
    tuition: '₹2.5L – ₹6L / yr',
    livingCost: '₹4.5L – ₹6.5L / yr',
    postStudyWork: '9-Month Post-Graduation Extension',
    popularAreas: 'General Medicine (English MD), Computer Science, Logistics',
    context: 'Lowest entry cost in Central Europe; recognized European degrees with rapid tech sector growth.',
    code: 'PL',
  },
];

export default function GlobalStudyShowcase() {
  const [selectedRegion, setSelectedRegion] = useState('All');

  const regions = ['All', 'North America', 'Western Europe', 'Nordic & Central EU', 'Oceania'];

  const filtered = COUNTRY_SHOWCASE.filter((c) => {
    if (selectedRegion === 'North America') return c.id === 'usa' || c.id === 'canada';
    if (selectedRegion === 'Oceania') return c.id === 'australia';
    if (selectedRegion === 'Western Europe') return ['uk', 'germany', 'france', 'netherlands', 'ireland', 'spain', 'italy', 'belgium'].includes(c.id);
    if (selectedRegion === 'Nordic & Central EU') return ['sweden', 'norway', 'poland'].includes(c.id);
    return true;
  });

  return (
    <section className="py-20 sm:py-24 bg-surface border-t border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-3.5 py-1 text-xs font-semibold text-brand-700 uppercase tracking-wider mb-3">
              <Globe className="w-3.5 h-3.5" />
              14 International Study Destinations
            </span>
            <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight">
              Global study guidance, <br className="hidden sm:inline" />
              <span className="text-brand-500">grounded in real economic facts.</span>
            </h2>
            <p className="mt-3 text-base text-ink-2 leading-relaxed">
              Compare actual tuition costs, living expenses, post-study work permits, and job market realities across 14 top international destinations.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/study-abroad"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-200 text-brand-700 text-xs sm:text-sm font-semibold hover:bg-brand-50 transition-colors"
            >
              <Scale className="w-4 h-4" /> Compare Countries →
            </Link>
            <Link
              to="/study-abroad"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold shadow-brand transition-all"
            >
              Explore Global Study →
            </Link>
          </div>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-brand-500 text-white shadow-brand'
                  : 'bg-paper border border-line text-ink-2 hover:border-brand-200 hover:text-ink'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* Countries Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((country) => (
            <div
              key={country.id}
              className="bg-paper border border-line rounded-2xl p-5 flex flex-col justify-between hover:border-brand-200 hover:shadow-card-lg transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl" role="img" aria-label={country.name}>
                      {country.flag}
                    </span>
                    <h3 className="font-ui font-bold text-base text-ink">
                      {country.name}
                    </h3>
                  </div>
                  <span className="text-[0.7rem] font-bold px-2 py-0.5 rounded bg-white border border-line text-ink-3">
                    {country.code}
                  </span>
                </div>

                <p className="text-xs text-ink-2 mb-4 leading-relaxed line-clamp-2">
                  {country.context}
                </p>

                {/* Metrics */}
                <div className="space-y-2 text-xs bg-white p-3 rounded-xl border border-line">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-3 text-[0.7rem] font-medium flex items-center gap-1">
                      <Wallet className="w-3 h-3 text-brand-500" /> Approx. Tuition:
                    </span>
                    <span className="font-semibold text-ink text-[0.75rem]">
                      {country.tuition}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-3 text-[0.7rem] font-medium flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-ink-4" /> Living Cost:
                    </span>
                    <span className="font-medium text-ink-2 text-[0.75rem]">
                      {country.livingCost}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-line/60">
                    <span className="text-ink-3 text-[0.7rem] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" /> Work Visa:
                    </span>
                    <span className="font-semibold text-emerald-700 text-[0.72rem] truncate max-w-[9.5rem] text-right">
                      {country.postStudyWork}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[0.68rem] font-bold uppercase tracking-wider text-ink-3 block mb-1">
                    Popular Areas:
                  </span>
                  <p className="text-[0.72rem] text-ink-2 truncate">
                    {country.popularAreas}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-line">
                <Link
                  to={`/study-abroad?country=${country.id}`}
                  className="inline-flex items-center justify-between w-full text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  <span>Explore universities</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
