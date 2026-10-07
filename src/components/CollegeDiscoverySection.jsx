import { useState } from 'react';
import {
  Building2,
  MapPin,
  Award,
  ShieldCheck,
  ExternalLink,
  GraduationCap,
  Wallet,
  CheckCircle2,
  Search,
  Filter,
  Info,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';
import { FEATURED_COLLEGES, COLLEGE_STATUS } from '../data/collegeData';
import GatedOfficialLink from './GatedOfficialLink';

export default function CollegeDiscoverySection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalCollege, setActiveModalCollege] = useState(null);

  const categories = ['All', 'Engineering & Technology', 'Medical & Healthcare', 'Commerce & Finance', 'Law & Governance', 'Management & Business', 'Design & Creative'];

  const filteredColleges = FEATURED_COLLEGES.filter((col) => {
    const matchesCat = selectedCategory === 'All' || col.category === selectedCategory;
    const matchesSearch =
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.degreePrograms.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section className="py-20 sm:py-24 bg-paper border-t border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-3.5 py-1 text-xs font-semibold text-brand-700 uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            Accredited Institution Discovery
          </span>
          <h2 className="font-ui font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight">
            Institutional clarity. <br className="hidden sm:inline" />
            <span className="text-brand-500">Official cutoffs & verified data.</span>
          </h2>
          <p className="mt-3 text-base text-ink-2 leading-relaxed">
            Discover premier universities and colleges with transparent fee ranges, genuine entrance routes, and clear distinctions between verified NIRF submissions and indicative estimates.
          </p>
        </div>

        {/* Data Authenticity Notice Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-white border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-ink">
                NAVORA Data Authenticity Standard
              </p>
              <p className="text-xs text-ink-3">
                Institutions are labeled with explicit verification stamps. We do not display speculative marketing cutoffs.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <BadgeCheck className="w-3.5 h-3.5" /> Verified Official Data
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
              <Info className="w-3.5 h-3.5" /> Indicative / Estimated
            </span>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-500 text-white shadow-brand'
                    : 'bg-white border border-line text-ink-2 hover:border-brand-200 hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
            <input
              type="text"
              placeholder="Search colleges, cities or degrees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-line text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        {/* College Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college) => {
            const isVerified = college.status === COLLEGE_STATUS.VERIFIED;
            return (
              <div
                key={college.id}
                className="bg-white border border-line rounded-2xl p-6 flex flex-col justify-between hover:shadow-card-lg hover:border-brand-200 transition-all duration-200"
              >
                <div>
                  {/* Top Bar: Verification Badge & NIRF */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold ${
                        isVerified
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {isVerified ? (
                        <>
                          <BadgeCheck className="w-3 h-3" /> Verified NIRF Submission
                        </>
                      ) : (
                        <>
                          <Info className="w-3 h-3" /> Indicative Range
                        </>
                      )}
                    </span>
                    <span className="text-[0.72rem] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                      {college.category}
                    </span>
                  </div>

                  <h3 className="font-ui font-bold text-lg text-ink leading-snug">
                    {college.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-ink-3 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-ink-4 shrink-0" />
                    <span className="truncate">{college.location}</span>
                  </div>

                  {/* Highlights Grid */}
                  <div className="mt-4 p-3.5 rounded-xl bg-paper border border-line space-y-2 text-xs">
                    <div>
                      <span className="text-ink-3 block text-[0.68rem] font-bold uppercase tracking-wider">
                        Accreditation & Ranking
                      </span>
                      <span className="font-semibold text-ink">
                        {college.accreditationRanking}
                      </span>
                    </div>
                    <div>
                      <span className="text-ink-3 block text-[0.68rem] font-bold uppercase tracking-wider">
                        Admission Route & Entrance
                      </span>
                      <span className="font-medium text-ink truncate block">
                        {college.admissionRoute}
                      </span>
                    </div>
                    <div>
                      <span className="text-ink-3 block text-[0.68rem] font-bold uppercase tracking-wider">
                        Approximate Fee Range
                      </span>
                      <span className="font-medium text-ink">
                        {college.approxFeeRange}
                      </span>
                    </div>
                  </div>

                  {/* Program Tags */}
                  <div className="mt-4">
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-ink-3 block mb-1.5">
                      Programs Offered
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {college.degreePrograms.slice(0, 2).map((prog) => (
                        <span
                          key={prog}
                          className="px-2 py-0.5 rounded-md bg-white border border-line text-[0.72rem] text-ink-2"
                        >
                          {prog}
                        </span>
                      ))}
                      {college.degreePrograms.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-paper text-[0.72rem] text-ink-3">
                          +{college.degreePrograms.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                  <button
                    onClick={() => setActiveModalCollege(college)}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer"
                  >
                    View verified details →
                  </button>
                  <GatedOfficialLink
                    url={college.officialWebsite}
                    linkLabel="Official Portal"
                    section="colleges"
                    collegeName={college.name}
                    className="inline-flex items-center gap-1 text-[0.72rem] text-ink-3 hover:text-ink transition-colors"
                  >
                    Official Portal <ExternalLink className="w-3 h-3" />
                  </GatedOfficialLink>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for full verified data */}
        {activeModalCollege && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-line">
              <div className="flex items-start justify-between gap-4 border-b border-line pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ Verified NIRF Data
                    </span>
                    <span className="text-xs text-ink-3">
                      {activeModalCollege.lastVerifiedDate}
                    </span>
                  </div>
                  <h3 className="font-ui font-bold text-2xl text-ink">
                    {activeModalCollege.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-3 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {activeModalCollege.location} · {activeModalCollege.universityAffiliation}
                  </p>
                </div>
                <button
                  onClick={() => setActiveModalCollege(null)}
                  className="w-8 h-8 rounded-full bg-paper flex items-center justify-center text-ink-3 hover:text-ink cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-paper border border-line">
                  <p className="font-bold text-ink mb-1">Campus Type & Infrastructure</p>
                  <p className="text-ink-2">{activeModalCollege.campusType}</p>
                  <p className="text-ink-2 mt-2 font-medium">Hostel Facilities:</p>
                  <p className="text-ink-3">{activeModalCollege.hostelAvailability}</p>
                </div>

                <div className="p-4 rounded-xl bg-paper border border-line">
                  <p className="font-bold text-ink mb-1">Entrance & Admission Route</p>
                  <p className="text-ink-2 font-medium">{activeModalCollege.admissionRoute}</p>
                  <p className="text-ink-3 mt-1">{activeModalCollege.entranceRequirements}</p>
                </div>

                <div className="p-4 rounded-xl bg-paper border border-line">
                  <p className="font-bold text-ink mb-1">Fees & Financial Aid / Scholarships</p>
                  <p className="text-ink-2"><strong>Fee Structure:</strong> {activeModalCollege.approxFeeRange}</p>
                  <p className="text-ink-3 mt-1"><strong>Scholarship Support:</strong> {activeModalCollege.scholarships}</p>
                </div>

                <div className="p-4 rounded-xl bg-paper border border-line">
                  <p className="font-bold text-ink mb-1">Placement Outcomes</p>
                  <p className="text-ink-2">{activeModalCollege.placementInformation}</p>
                </div>

                <div className="p-4 rounded-xl bg-paper border border-line">
                  <p className="font-bold text-ink mb-1">Key Research & Campus Facilities</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {activeModalCollege.keyFacilities.map((f) => (
                      <span key={f} className="px-2.5 py-1 rounded-md bg-white border border-line text-xs text-ink-2">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-line flex items-center justify-between">
                <GatedOfficialLink
                  url={activeModalCollege.officialWebsite}
                  linkLabel="Official Institutional Portal"
                  section="colleges"
                  collegeName={activeModalCollege.name}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Visit Official Institutional Portal <ExternalLink className="w-4 h-4" />
                </GatedOfficialLink>
                <button
                  onClick={() => setActiveModalCollege(null)}
                  className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
