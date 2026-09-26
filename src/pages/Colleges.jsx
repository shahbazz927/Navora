import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  CheckCircle2,
  Building,
  Sparkles,
  X,
  ArrowRight,
  GitCompare,
  Bookmark,
  Check,
  RotateCcw
} from 'lucide-react';
import CollegeCard from '../components/CollegeCard';
import { ALL_INSTITUTIONS, getCollegesMatchingProfile, filterInstitutions } from '../data/institutionsMaster';
import { useUser } from '../context/UserContext';
import { useSavedColleges } from '../hooks/useSavedColleges';
import campusHeroBg from '../assets/images/campus_hero_bright_1790171606486.jpg';
import { useSubscription } from '../hooks/useSubscription';
import UpgradeModal from '../components/UpgradeModal';

export default function Colleges() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { answers } = useUser();
  const { savedSlugs } = useSavedColleges();

  // Active filters derived directly from URL searchParams
  const level = searchParams.get('level') || 'All';
  const course = searchParams.get('course') || 'All';
  const city = searchParams.get('city') || 'All';
  const institutionType = searchParams.get('type') || 'All';
  const budget = searchParams.get('budget') || 'All';
  const hostel = searchParams.get('hostel') || 'Either';
  const sortBy = searchParams.get('sort') || 'relevance';
  const paramSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(paramSearch);
  const [compareList, setCompareList] = useState([]);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const { plan, isPro } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const compareLimit = plan.college_compare_limit;

  // Sync searchQuery local state if param changes externally
  useEffect(() => {
    setSearchQuery(paramSearch);
  }, [paramSearch]);

  // Unified filter updater that keeps state and URL 100% in sync
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'Either' || value === 'relevance' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams, { replace: true });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSearchParams({}, { replace: true });
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    updateFilter('search', searchQuery);
  };

  const toggleCompare = (slug) => {
    setCompareList((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= compareLimit) {
        setShowUpgrade(true);
        return prev;
      }
      return [...prev, slug];
    });
  };

  // Filtered colleges
  const filteredColleges = useMemo(() => {
    return filterInstitutions({
      level,
      course,
      city,
      institutionType,
      budget,
      hostel,
      searchQuery,
      sortBy
    });
  }, [level, course, city, institutionType, budget, hostel, searchQuery, sortBy]);

  // Profile matched colleges count
  const matchedColleges = useMemo(() => {
    if (!answers || Object.keys(answers).length === 0) return [];
    return getCollegesMatchingProfile(answers);
  }, [answers]);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    level !== 'All' ||
    course !== 'All' ||
    city !== 'All' ||
    institutionType !== 'All' ||
    budget !== 'All' ||
    hostel !== 'Either';

  // Count active filters for badge
  const activeFilterCount = [
    Boolean(searchQuery),
    level !== 'All',
    course !== 'All',
    city !== 'All',
    institutionType !== 'All',
    budget !== 'All',
    hostel !== 'Either'
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Hero Header with College Campus Background Image */}
      <section className="relative overflow-hidden text-white pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-md">
        {/* College Campus Background Image with Balanced Scrim */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={campusHeroBg}
            alt="Premier University and College Campuses"
            className="w-full h-full object-cover object-[center_35%] scale-100"
            referrerPolicy="no-referrer"
          />
          {/* Balanced dual scrim: keeps architectural buildings, trees, and sky vibrantly visible while ensuring 100% readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-900/35 to-slate-950/75" />
          <div className="absolute inset-0 bg-slate-950/15" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/20 text-blue-300 text-xs font-semibold backdrop-blur-md mb-4 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            Official NIRF & State Council Verified Data (2026-27)
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] text-balance">
            Find the Right College for Your Future
          </h1>
          <p className="text-base sm:text-lg text-slate-100 max-w-2xl mx-auto mb-8 font-normal drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] leading-relaxed">
            Explore colleges, courses, fees, eligibility, admissions and career opportunities — all in one place with complete factual verification.
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto relative mb-6">
            <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-1.5 border border-white/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search college, course (B.Tech, MBA, MBBS), university or city..."
                className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Campus Highlights / Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/20 shadow-xs font-medium">
              <Building className="w-3.5 h-3.5 text-blue-400" />
              Central & State Universities
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/20 shadow-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              IITs, NITs & IIITs
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/20 shadow-xs font-medium">
              <Building className="w-3.5 h-3.5 text-emerald-400" />
              Top Medical Campuses
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/20 shadow-xs font-medium">
              <Building className="w-3.5 h-3.5 text-purple-400" />
              Management & Commerce Colleges
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Profile Recommendation Callout */}
        {matchedColleges.length > 0 && !hasActiveFilters && (
          <div className="mb-8 p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-500/20 border border-blue-400/30 rounded-xl shrink-0">
                <Sparkles className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h4 className="text-base font-bold">Colleges Matching Your NAVORA Assessment</h4>
                <p className="text-xs text-blue-200 mt-0.5">
                  Filtered based on your stream, career goals, and eligibility criteria.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white/10 px-3 py-1.5 rounded-lg font-medium text-white border border-white/10">
                {matchedColleges.length} Matching Institutions
              </span>
            </div>
          </div>
        )}

        {/* Mobile Filter Toggle & Sort */}
        <div className="lg:hidden flex items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="flex-1 py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>
              Filters {activeFilterCount > 0 ? `(${activeFilterCount} Active)` : ''}
            </span>
          </button>
          <select
            value={sortBy}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm focus:outline-none cursor-pointer"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="fee-low">Fee: Low to High</option>
            <option value="fee-high">Fee: High to Low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside
            className={`lg:block ${
              showFiltersMobile ? 'block mb-6' : 'hidden'
            } bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-5 h-fit sticky top-20 z-10`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Study Level */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">Program Level</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
                {[
                  { id: 'All', label: 'All' },
                  { id: 'UG', label: 'UG' },
                  { id: 'PG', label: 'PG' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => updateFilter('level', lvl.id)}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-colors font-semibold cursor-pointer ${
                      level === lvl.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Degree / Course */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">Degree / Course</label>
              <select
                value={course}
                onChange={(e) => updateFilter('course', e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer text-slate-800"
              >
                <option value="All">All Degrees & Courses</option>
                <optgroup label="Undergraduate (UG)">
                  <option value="B.Tech">B.Tech / B.E. (Engineering)</option>
                  <option value="B.Com">B.Com (Commerce & Comp App)</option>
                  <option value="B.Sc">B.Sc (Sciences & Computing)</option>
                  <option value="BBA">BBA (Management)</option>
                  <option value="BCA">BCA (Computer Applications)</option>
                  <option value="BA">B.A. (Humanities & Social Sciences)</option>
                  <option value="MBBS">MBBS (Medicine)</option>
                  <option value="B.Pharm">B.Pharm (Pharmacy)</option>
                </optgroup>
                <optgroup label="Postgraduate (PG)">
                  <option value="MBA">MBA / PGDM (Management)</option>
                  <option value="MCA">MCA (Computer Applications)</option>
                  <option value="M.Tech">M.Tech / M.E. (Engineering)</option>
                  <option value="LLB">Law (LLB / Integrated Law / LLM)</option>
                </optgroup>
              </select>
            </div>

            {/* Location (Hyderabad, Secunderabad, Metro Districts) */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">Location / Metro District</label>
              <select
                value={city}
                onChange={(e) => updateFilter('city', e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer text-slate-800"
              >
                <option value="All">All Greater Hyderabad & Metro</option>
                <option value="Hyderabad">Hyderabad District</option>
                <option value="Secunderabad">Secunderabad & North Zone</option>
                <option value="Medchal-Malkajgiri">Medchal-Malkajgiri (Alwal, Medchal)</option>
                <option value="Ranga Reddy">Ranga Reddy (Shamshabad, Gachibowli)</option>
                <option value="Sangareddy">Sangareddy Metro (IIT Hyd, Woxsen)</option>
              </select>
            </div>

            {/* Institution Type */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">Institution Type</label>
              <select
                value={institutionType}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer text-slate-800"
              >
                <option value="All">All Types</option>
                <option value="Autonomous">Autonomous Colleges & Institutes</option>
                <option value="Government">Government & Government-Aided</option>
                <option value="Affiliated">University Affiliated Colleges</option>
                <option value="Constituent">Constituent Colleges of University</option>
                <option value="University">Universities (Central/State/Deemed)</option>
                <option value="Private">Private / Society Managed</option>
              </select>
            </div>

            {/* Budget (Annual Fee Range) */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">Annual Tuition Budget</label>
              <select
                value={budget}
                onChange={(e) => updateFilter('budget', e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer text-slate-800"
              >
                <option value="All">Any Budget</option>
                <option value="under-50k">Under ₹50,000 / year (Govt / Subsidized)</option>
                <option value="50k-1lakh">₹50,000 – ₹1 Lakh / year</option>
                <option value="1lakh-2lakh">₹1 Lakh – ₹2 Lakh / year</option>
                <option value="2lakh-5lakh">₹2 Lakh – ₹5 Lakh / year</option>
                <option value="5lakh-plus">₹5 Lakh+ / year</option>
              </select>
            </div>

            {/* Hostel */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">Hostel Facility</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
                {['Either', 'Required', 'Not Required'].map((h) => {
                  const isActive =
                    hostel === h ||
                    (hostel === 'Not required' && h === 'Not Required');
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => updateFilter('hostel', h === 'Not Required' ? 'Not required' : h)}
                      className={`py-1.5 px-1 rounded-lg border text-center transition-colors text-[11px] font-semibold cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Drawer Apply & Close Button */}
            {showFiltersMobile && (
              <div className="pt-3 border-t border-slate-200 lg:hidden flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="py-2.5 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowFiltersMobile(false)}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Show {filteredColleges.length} Colleges
                </button>
              </div>
            )}
          </aside>

          {/* Results Grid */}
          <main className="lg:col-span-3">
            {/* Quick Level Pills on Top of Grid */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {[
                { id: 'All', label: 'All Colleges', count: 88 },
                { id: 'UG', label: 'UG Degrees', count: 68 },
                { id: 'PG', label: 'PG Degrees', count: 65 }
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => updateFilter('level', pill.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    level === pill.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {pill.label} ({pill.count})
                </button>
              ))}
            </div>

            {/* Active Filter Chips Bar */}
            {hasActiveFilters && (
              <div className="mb-5 p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5 text-blue-600" />
                  Active Filters:
                </span>

                {Boolean(searchQuery) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-900 rounded-lg text-xs font-medium border border-blue-200 shadow-2xs">
                    Search: "{searchQuery}"
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        updateFilter('search', '');
                      }}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {level !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-900 rounded-lg text-xs font-medium border border-blue-200 shadow-2xs">
                    Level: {level}
                    <button
                      type="button"
                      onClick={() => updateFilter('level', 'All')}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {course !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-900 rounded-lg text-xs font-medium border border-blue-200 shadow-2xs">
                    Course: {course}
                    <button
                      type="button"
                      onClick={() => updateFilter('course', 'All')}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {city !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-900 rounded-lg text-xs font-medium border border-blue-200 shadow-2xs">
                    Location: {city}
                    <button
                      type="button"
                      onClick={() => updateFilter('city', 'All')}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {institutionType !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-900 rounded-lg text-xs font-medium border border-blue-200 shadow-2xs">
                    Type: {institutionType}
                    <button
                      type="button"
                      onClick={() => updateFilter('type', 'All')}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {budget !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-900 rounded-lg text-xs font-medium border border-blue-200 shadow-2xs">
                    Budget: {budget}
                    <button
                      type="button"
                      onClick={() => updateFilter('budget', 'All')}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {hostel !== 'Either' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-900 rounded-lg text-xs font-medium border border-blue-200 shadow-2xs">
                    Hostel: {hostel}
                    <button
                      type="button"
                      onClick={() => updateFilter('hostel', 'Either')}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear All
                </button>
              </div>
            )}

            {/* Header info row */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-slate-600 font-medium">
                Showing <span className="font-bold text-slate-900">{filteredColleges.length}</span> verified institutions
                {hasActiveFilters && ' (filtered)'}
              </div>

              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="text-slate-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="relevance">Relevance</option>
                  <option value="fee-low">Annual Fee: Low to High</option>
                  <option value="fee-high">Annual Fee: High to Low</option>
                  <option value="name">Name (A to Z)</option>
                </select>
              </div>
            </div>

            {/* Cards Grid */}
            {filteredColleges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredColleges.map((inst) => (
                  <CollegeCard
                    key={inst.id || inst.slug}
                    institution={inst}
                    isSelectedForCompare={compareList.includes(inst.slug)}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200">
                <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">No institutions match your filters</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Try adjusting your budget, course selection, or location filters to see available institutions.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <UpgradeModal open={showUpgrade} onClose={()=>setShowUpgrade(false)} feature="college_compare" />
      {/* Floating Compare Drawer */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 max-w-lg bg-[#0A192F] text-white p-4 rounded-2xl shadow-2xl border border-slate-700 z-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-xs font-bold block">
                {compareList.length} of {compareLimit} Colleges Selected
              </span>
              <span className="text-[11px] text-slate-300">Ready for factual side-by-side comparison</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            <button
              onClick={() => navigate(`/colleges/compare?colleges=${compareList.join(',')}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors flex items-center gap-1.5"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
