import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  GraduationCap,
  Building2,
  Sparkles,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Mail,
  ArrowRight
} from 'lucide-react';
import { useScrollTop } from '../hooks/useLocalStorage';
import { CONTACT } from '../config/contact';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'colleges', label: 'Colleges & Admissions', icon: Building2 },
  { id: 'assessment', label: 'Career Assessment', icon: GraduationCap },
  { id: 'ai', label: 'AI Advisor', icon: Sparkles },
  { id: 'global', label: 'Global Study Abroad', icon: Globe2 },
  { id: 'account', label: 'Account & Security', icon: ShieldCheck }
];

const FAQS = [
  {
    category: 'colleges',
    q: 'How does NAVORA source and verify college data?',
    a: 'Every institution in our directory is verified against official records from the National Institutional Ranking Framework (NIRF 2026), the Telangana State Council of Higher Education (TSCHE), Osmania University / JNTUH affiliation listings, and the All India Survey on Higher Education (AISHE). We verify accreditation status (NAAC grade and NBA approvals), annual tuition fee ranges, seat intake quotas, and campus facilities.'
  },
  {
    category: 'colleges',
    q: 'How do I search and filter colleges by degree, budget, or institution type?',
    a: 'In the Explore Colleges directory, use the interactive sidebar filters to select your academic level (UG or PG), specific degree (e.g., B.Tech/B.E., MBBS, MBA, BCA, B.Sc, Law), Metro location (Hyderabad, Secunderabad, Medchal, Ranga Reddy), institution type (Autonomous, Government, University, Affiliated), hostel requirement, and annual tuition budget. The directory updates dynamically with matching institutions.'
  },
  {
    category: 'colleges',
    q: 'Can I compare multiple colleges side by side?',
    a: 'Yes! Click the "Compare" button on any college card to add it to your comparison tray. You can compare up to 4 colleges side by side across key metrics: annual tuition fees, NAAC grade, median placement packages, highest campus offers, hostel availability, major recruiters, and student-faculty ratios.'
  },
  {
    category: 'colleges',
    q: 'How do Saved Colleges work and where can I view them?',
    a: 'Click the bookmark icon on any college card to add it to your shortlist. You can access all your saved institutions at any time by clicking "Saved Colleges" in the Explore Colleges menu or navigating to /colleges/saved. Shortlists are saved locally and synced across devices when signed in.'
  },
  {
    category: 'assessment',
    q: 'What is the NAVORA Career & Stream Assessment?',
    a: 'NAVORA provides guided self-assessments tailored for Class 10 students (choosing streams like MPC, BiPC, CEC, MEC), Class 12 students (choosing undergraduate degrees and competitive entrance exams), and graduates (exploring PG degrees or direct career pathways). The assessment evaluates your strengths, subjects of interest, and career goals to recommend matched programs.'
  },
  {
    category: 'assessment',
    q: 'How are colleges matched to my assessment profile?',
    a: 'When you complete an assessment, NAVORA maps your selected stream, degree aspirations, and budget preferences against accredited colleges in our database. A highlighted recommendation callout appears in the directory showing institutions offering verified programs matching your profile.'
  },
  {
    category: 'assessment',
    q: 'Are my assessment answers saved if I close or refresh the page?',
    a: 'Yes. Your answers and assessment progress are saved automatically in your browser’s local storage. When you sign in to your free account, your assessment responses and recommendations sync permanently to your dashboard.'
  },
  {
    category: 'ai',
    q: 'How does the AI Advisor help me choose the right path?',
    a: 'The NAVORA AI Advisor provides interactive, personalized guidance based on your academic interests. You can ask free-form questions about entrance exams (such as TS EAMCET, JEE Main, NEET, CAT, TS ICET), course curricula, college selection strategies, eligibility cutoffs, and emerging career opportunities in India and abroad.'
  },
  {
    category: 'ai',
    q: 'Is the AI guidance official or advisory?',
    a: 'The AI Advisor provides personalized advisory guidance to help you understand options, compare paths, and prepare for admissions. For official seat allocations, counselling schedules, and reservation policies, you should always consult official state counselling portals (e.g. tseamcet.nic.in) and official university bulletins.'
  },
  {
    category: 'global',
    q: 'What information does the Global Study section provide?',
    a: 'Our Global Study Abroad guide covers premier overseas destinations including the United States, United Kingdom, Canada, Australia, Germany, and Ireland. It outlines standardized testing requirements (IELTS, TOEFL, GRE), estimated annual tuition and living expenses, post-study work visa policies, and application deadlines.'
  },
  {
    category: 'account',
    q: 'Do I need an account to search colleges and view fees?',
    a: 'No. Searching colleges, filtering by UG/PG courses, comparing institutions, and reading college admission guides is 100% free and open without requiring an account or credit card.'
  },
  {
    category: 'account',
    q: 'Why should I create a free student account?',
    a: 'Creating a free account enables your personalized Student Dashboard, saves your assessment report across multiple devices (phone, tablet, laptop), lets you chat with the AI Advisor, and preserves your shortlisted colleges permanently.'
  },
  {
    category: 'account',
    q: 'How is my personal data protected?',
    a: 'NAVORA uses secure session authentication (Supabase Auth). We do not sell user data or share student contact numbers with unverified marketing agencies. You can export or clear your saved data at any time in your Account Settings.'
  },
  {
    category: 'account',
    q: 'How do I contact the NAVORA student support team?',
    a: 'You can email our student support desk at contact@navora.app or call us directly at +91 40 2345 6789 (Mon–Sat, 9:00 AM – 6:00 PM IST). You can also visit our Support page to submit an inquiry.'
  }
];

export default function Help() {
  useScrollTop();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // By default, all answers are visible. Users can toggle individual ones or use Collapse/Expand All.
  const [collapsedIndices, setCollapsedIndices] = useState(new Set());

  // Filtered list based on category and search
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return FAQS.filter((faq) => {
      const matchCat = activeCategory === 'all' || faq.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        faq.q.toLowerCase().includes(q) ||
        faq.a.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeCategory]);

  const toggleQuestion = (index) => {
    setCollapsedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setCollapsedIndices(new Set());
  };

  const handleCollapseAll = () => {
    const allIndices = new Set(filteredFaqs.map((_, i) => i));
    setCollapsedIndices(allIndices);
  };

  const isAllExpanded = collapsedIndices.size === 0;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20 pt-24 sm:pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>NAVORA Help Center & Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How can we help?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Find clear, verified answers to common questions about finding colleges, taking career assessments, comparing campuses, and using the AI Advisor.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-6 relative max-w-xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all p-1">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. fees, compare colleges, assessment, AI)..."
                className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  aria-label="Clear search"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Row: Results Count & Expand/Collapse Toggle */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="text-xs font-medium text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredFaqs.length}</span> questions & answers
            {searchQuery && ` for "${searchQuery}"`}
          </div>

          {filteredFaqs.length > 0 && (
            <button
              type="button"
              onClick={isAllExpanded ? handleCollapseAll : handleExpandAll}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              {isAllExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Collapse All</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Expand All</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Questions and Answers List - Visible by Default */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800">No matching questions found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try searching with different keywords or switch categories to explore all topics.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isCollapsed = collapsedIndices.has(index);
              const isVisible = !isCollapsed;

              return (
                <div
                  key={faq.q}
                  className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all duration-200 hover:border-slate-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleQuestion(index)}
                    className="w-full flex items-start justify-between p-4 sm:p-5 text-left cursor-pointer focus:outline-none"
                    aria-expanded={isVisible}
                  >
                    <div className="flex items-start gap-3 pr-3">
                      <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                        Q
                      </div>
                      <span className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                        {faq.q}
                      </span>
                    </div>
                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700 shrink-0">
                      {isVisible ? (
                        <ChevronUp className="w-4 h-4 text-blue-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Answer section - visible by default */}
                  {isVisible && (
                    <div className="px-4 sm:px-5 pb-5 pt-0 border-t border-slate-100 mt-1">
                      <div className="flex items-start gap-3 pt-3">
                        <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200">
                          A
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Support CTA Box */}
        <div className="mt-10 p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-300" />
              Still have questions?
            </h3>
            <p className="text-xs text-blue-200 mt-1">
              Our academic advisory team is available to help with admissions, career decisions, or technical issues.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/support"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs shadow-sm hover:bg-blue-50 transition-colors"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
