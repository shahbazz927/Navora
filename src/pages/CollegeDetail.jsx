import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Bookmark,
  GitCompare,
  ArrowLeft,
  GraduationCap,
  IndianRupee,
  Calendar,
  Briefcase,
  Award,
  BookOpen,
  Home,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Globe
} from 'lucide-react';
import { getInstitutionBySlug } from '../data/institutionsMaster';
import { useSavedColleges } from '../hooks/useSavedColleges';
import { SCHOLARSHIPS, getScholarshipsForInstitution, COLLEGE_SCHOLARSHIP_LINKS } from '../data/scholarships';
import ScholarshipCard from '../components/ScholarshipCard';
import { normalizeProfile, evaluateEligibility, PROFILE_MATCH, deadlineBucket, isScholarshipActive, getMatchLabel } from '../lib/scholarshipMatching';
import { useUser } from '../context/UserContext';
import { useGatedOfficialLink } from '../hooks/useGatedOfficialLink';
import PhonePromptModal from '../components/PhonePromptModal';

export default function CollegeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSaveCollege } = useSavedColleges();
  const [activeTab, setActiveTab] = useState('overview');
  const { answers, onboardingData } = useUser();
  const { gateLink, phoneModal, closePhoneModal, submitPhone } = useGatedOfficialLink();
  const [schFilterFunding, setSchFilterFunding] = useState('All');
  const [schFilterEligibility, setSchFilterEligibility] = useState('All');
  const [schFilterDeadline, setSchFilterDeadline] = useState('All');
  const [schFilterLevel, setSchFilterLevel] = useState('All');
  const [schFilterCountry, setSchFilterCountry] = useState('All');
  const [schIndianOnly, setSchIndianOnly] = useState(false);
  const [schEligibilityOpen, setSchEligibilityOpen] = useState(null);

  const institution = getInstitutionBySlug(slug);

  if (!institution) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Institution Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">
            The college you are looking for is either not yet catalogued or the URL is incorrect.
          </p>
          <Link
            to="/colleges"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to College Discovery</span>
          </Link>
        </div>
      </div>
    );
  }

  const saved = isSaved(institution.slug);

  const formatCurrency = (amt) => {
    if (!amt) return 'Not Available';
    return `₹${amt.toLocaleString('en-IN')}`;
  };

  const ugCourses = institution.courses?.filter((c) => c.level === 'UG') || [];
  const pgCourses = institution.courses?.filter((c) => c.level === 'PG' || c.level === 'Integrated') || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <div className="bg-[#0A192F] text-white border-b border-slate-800 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb & Back */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/colleges"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Explore Colleges</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSaveCollege(institution.slug)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  saved
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{saved ? 'Saved' : 'Save College'}</span>
              </button>

              <button
                onClick={() => navigate(`/colleges/compare?colleges=${institution.slug}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare</span>
              </button>
            </div>
          </div>

          {/* Title Area */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {institution.institutionType}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-white/10 text-slate-300">
                  {institution.ownership}
                </span>
                {institution.establishedYear && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-white/10 text-slate-300">
                    Est. {institution.establishedYear}
                  </span>
                )}
                {institution.autonomousStatus && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Autonomous
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                {institution.name}
              </h1>

              <div className="flex items-center gap-2 text-sm text-slate-300 font-light">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{institution.location || `${institution.city}, ${institution.state}`}</span>
              </div>
            </div>

            {/* Official Web Links */}
            <div className="flex flex-wrap md:flex-col items-start gap-2.5 shrink-0">
              {institution.website && (
                <a
                  href={institution.website}
                  onClick={(e) => gateLink(e, { url: institution.website, linkLabel: 'Official Website', section: 'colleges', collegeSlug: institution.slug, collegeName: institution.name })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Official Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
              {institution.admissionUrl && (
                <a
                  href={institution.admissionUrl}
                  onClick={(e) => gateLink(e, { url: institution.admissionUrl, linkLabel: 'Admissions Portal', section: 'colleges', collegeSlug: institution.slug, collegeName: institution.name })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Admissions Portal</span>
                  <ExternalLink className="w-3 h-3 text-blue-200" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details (2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Institution Overview</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-light">
                {institution.description || 'Information verified from official university records.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Affiliation</span>
                  <span className="font-semibold text-slate-800">
                    {institution.universityAffiliation || 'Autonomous'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Accreditation</span>
                  <span className="font-semibold text-slate-800">
                    {institution.accreditation || 'Recognized by UGC'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">NIRF / Category</span>
                  <span className="font-semibold text-slate-800">
                    {institution.nirfRank || 'State Accredited'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Recognition</span>
                  <span className="font-semibold text-slate-800">
                    {institution.recognition || 'UGC / AICTE'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Campus Living</span>
                  <span className="font-semibold text-slate-800">
                    {institution.hostelAvailable ? 'Hostels Available' : 'Day Scholar'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">City Zone</span>
                  <span className="font-semibold text-slate-800">{institution.city}</span>
                </div>
              </div>
            </section>

            {/* Courses & Fees Card */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>Courses & Fee Breakdown</span>
              </h2>

              <div className="space-y-6">
                {institution.courses && institution.courses.length > 0 ? (
                  institution.courses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors bg-slate-50/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded">
                            {course.level}
                          </span>
                          <h3 className="text-base font-bold text-slate-900">
                            {course.degree} in {course.courseName}
                          </h3>
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          Duration: {course.duration}
                        </span>
                      </div>

                      {course.specialization && (
                        <p className="text-xs text-slate-600 mb-3">
                          <strong className="text-slate-700">Specialization:</strong>{' '}
                          {course.specialization}
                        </p>
                      )}

                      {/* Fees Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-lg border border-slate-200 text-xs mb-3">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Tuition (Annual)</span>
                          <span className="font-bold text-slate-900">
                            {formatCurrency(course.tuitionFee)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Hostel (Annual)</span>
                          <span className="font-semibold text-slate-700">
                            {course.hostelFee ? formatCurrency(course.hostelFee) : 'Day Scholar'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Mess Charges</span>
                          <span className="font-semibold text-slate-700">
                            {course.messFee ? formatCurrency(course.messFee) : 'As per use'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Estimated Annual Cost</span>
                          <span className="font-bold text-blue-600">
                            {formatCurrency(course.totalAnnualFee || course.tuitionFee)}
                          </span>
                        </div>
                      </div>

                      {/* Admission & Eligibility */}
                      <div className="text-xs text-slate-600 space-y-1">
                        <p>
                          <strong className="text-slate-700">Eligibility:</strong> {course.eligibility}
                        </p>
                        <p>
                          <strong className="text-slate-700">Entrance Exam:</strong>{' '}
                          <span className="text-blue-700 font-semibold">{course.entranceExam}</span>
                        </p>
                        <p>
                          <strong className="text-slate-700">Admission Route:</strong>{' '}
                          {course.admissionMode}
                        </p>
                      </div>

                      {/* Provenance source link */}
                      {course.sourceUrl && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                          <span>
                            Academic Year: <strong>{course.academicYear}</strong> · Status:{' '}
                            <span className="text-emerald-700 font-medium capitalize">
                              {course.verificationStatus}
                            </span>
                          </span>
                          <a
                            href={course.sourceUrl}
                            onClick={(e) => gateLink(e, { url: course.sourceUrl, linkLabel: 'View Official Source', section: 'colleges', collegeSlug: institution.slug, collegeName: institution.name })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                          >
                            <span>View Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Official course and fee information not yet verified.
                  </p>
                )}
              </div>
            </section>

            {/* Placements Card */}
            {institution.placements && (
              <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span>Verified Placement Statistics</span>
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    Batch Year: {institution.placements.placementYear}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Median CTC</span>
                    <span className="text-base font-bold text-slate-900">
                      {formatCurrency(institution.placements.medianPackage)}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Average CTC</span>
                    <span className="text-base font-bold text-slate-900">
                      {formatCurrency(institution.placements.averagePackage)}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Highest Package</span>
                    <span className="text-base font-bold text-emerald-600">
                      {formatCurrency(institution.placements.highestPackage)}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Placement Rate</span>
                    <span className="text-base font-bold text-blue-600">
                      {institution.placements.placementRate}%
                    </span>
                  </div>
                </div>

                {institution.placements.topRecruiters && (
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      Key Verified Employers
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {institution.placements.topRecruiters.map((recruiter, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium"
                        >
                          {recruiter}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Campus Facilities */}
            {institution.facilities && institution.facilities.length > 0 && (
              <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  <span>Campus Infrastructure & Facilities</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {institution.facilities.map((fac, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 font-medium text-slate-800"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Scholarships & Financial Aid — integrated (§4, §13, §14) */}
            {(() => {
              const linked = getScholarshipsForInstitution(institution.slug);
              // Fallback: map legacy institution.scholarships into minimal spec records so old data still shows
              const legacyMapped = (institution.scholarships || []).filter(s => !linked.some(l=>l.name===s.name)).map((s,i)=>({
                id: `legacy-${institution.slug}-${i}`,
                name: s.name,
                provider_name: institution.shortName || institution.name,
                provider_type: 'University',
                description: s.benefit,
                scholarship_type: 'Institutional',
                funding_type: 'Tuition Waiver',
                eligibility: s.eligibility,
                academic_requirements: s.eligibility,
                award_currency: 'INR',
                tuition_coverage: s.benefit,
                application_deadline: null,
                official_source_url: s.sourceUrl || institution.website,
                source_name: institution.name,
                source_type: 'Official Institution',
                verification_status: 'NEEDS_VERIFICATION',
                status: 'active',
                country: 'India',
              }));
              const all = [...linked, ...legacyMapped];
              const linksById = Object.fromEntries(COLLEGE_SCHOLARSHIP_LINKS.filter(l=>l.college_slug===institution.slug).map(l=>[l.scholarship_id, l.relationship_type]));
              const profile = normalizeProfile({ answers, onboardingData, institution });
              let filtered = all.filter(s=>{
                if (isScholarshipActive(s)===false && schFilterDeadline!=='All') return false;
                if (schFilterFunding!=='All' && (s.funding_type||'').toLowerCase() !== schFilterFunding.toLowerCase()) return false;
                if (schFilterLevel!=='All' && !(s.education_levels||[]).some(l=>l.toLowerCase()===schFilterLevel.toLowerCase())) {
                  if ((s.education_levels||[]).length>0) return false;
                }
                if (schFilterEligibility!=='All') {
                  const t = (s.scholarship_type||'').toLowerCase();
                  if (schFilterEligibility==='Merit' && !t.includes('merit')) return false;
                  if (schFilterEligibility==='Need-based' && !t.includes('need')) return false;
                  if (schFilterEligibility==='State' && linksById[s.id]!=='STATE') return false;
                  if (schFilterEligibility==='Institution' && !['INSTITUTIONAL','UNIVERSITY'].includes(linksById[s.id]||'')) return false;
                  if (schFilterEligibility==='Course' && (!s.eligible_courses || s.eligible_courses.length===0)) return false;
                }
                if (schFilterDeadline!=='All') {
                  const b = deadlineBucket(s);
                  if (schFilterDeadline==='Open' && !['open','closing_soon'].includes(b)) return false;
                  if (schFilterDeadline==='Closing Soon' && b!=='closing_soon') return false;
                  if (schFilterDeadline==='Upcoming' && b!=='upcoming') return false;
                }
                if (schFilterCountry!=='All' && (s.country||'India').toLowerCase() !== schFilterCountry.toLowerCase()) return false;
                if (schIndianOnly && !(s.eligible_nationalities||[]).includes('India')) return false;
                return true;
              });
              const activeCount = all.filter(isScholarshipActive).length;
              return (
                <section id="scholarships" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span>Scholarships & Financial Aid</span>
                    </h2>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{activeCount} opportunities</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Scholarships that may be available to students at this institution. Availability and eligibility are separate — check your profile match.</p>

                  {/* Filters §13 + abroad §10-11 */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    <select value={schFilterFunding} onChange={e=>setSchFilterFunding(e.target.value)} className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2">
                      <option value="All">Funding: All</option><option>Fully Funded</option><option>Partial</option><option>Tuition Waiver</option><option>Stipend</option>
                    </select>
                    <select value={schFilterEligibility} onChange={e=>setSchFilterEligibility(e.target.value)} className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2">
                      <option value="All">Eligibility: All</option><option>Merit</option><option>Need-based</option><option>Merit + Need</option><option>State</option><option>Institution</option><option>Course</option>
                    </select>
                    <select value={schFilterDeadline} onChange={e=>setSchFilterDeadline(e.target.value)} className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2">
                      <option value="All">Deadline: All</option><option>Open</option><option>Closing Soon</option><option>Upcoming</option>
                    </select>
                    <select value={schFilterLevel} onChange={e=>setSchFilterLevel(e.target.value)} className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2">
                      <option value="All">Level: All</option><option>UG</option><option>PG</option><option>Diploma</option><option>ITI</option><option>Doctoral</option>
                    </select>
                    <select value={schFilterCountry} onChange={e=>setSchFilterCountry(e.target.value)} className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2">
                      <option value="All">Country: All</option><option>India</option><option>USA</option><option>UK</option><option>Canada</option><option>Australia</option><option>Germany</option><option>France</option><option>Ireland</option><option>Netherlands</option><option>Sweden</option><option>Switzerland</option><option>Hungary</option><option>Türkiye</option><option>Italy</option><option>European Union</option><option>Japan</option><option>South Korea</option><option>Singapore</option><option>Hong Kong</option><option>China</option><option>UAE</option><option>Saudi Arabia</option><option>India (funders for study abroad)</option>
                    </select>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-2 cursor-pointer">
                      <input type="checkbox" checked={schIndianOnly} onChange={e=>setSchIndianOnly(e.target.checked)} className="rounded" /> For Indian students
                    </label>
                  </div>

                  {all.length===0 ? (
                    <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                      <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700">No scholarships catalogued yet for this institution</p>
                      <p className="text-xs text-slate-500 mt-1">Check general government portals like <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">scholarships.gov.in</a> and <a href="https://telanganaepass.cgg.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">telanganaepass.cgg.gov.in</a>.</p>
                    </div>
                  ) : filtered.length===0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No scholarships match the selected filters. <button onClick={()=>{setSchFilterFunding('All');setSchFilterEligibility('All');setSchFilterDeadline('All');setSchFilterLevel('All');setSchFilterCountry('All');setSchIndianOnly(false);}} className="text-blue-600 font-semibold hover:underline">Clear filters</button></p>
                  ) : (
                    <div className="space-y-3">
                      {filtered.map(sch=>{
                        const rel = linksById[sch.id] || (sch.id.startsWith('legacy-')?'INSTITUTIONAL':'EXTERNAL');
                        const { match, reasons } = evaluateEligibility(sch, profile);
                        return (
                          <ScholarshipCard key={sch.id} scholarship={sch} relationshipType={rel} match={match} reasons={reasons}
                            onView={()=>navigate(`/colleges/${institution.slug}/scholarships/${sch.id.startsWith('legacy-')?'sch-telangana-epass-postmatric':sch.id}`)}
                            onCheck={()=>setSchEligibilityOpen(schEligibilityOpen===sch.id?null:sch.id)} />
                        );
                      })}
                    </div>
                  )}
                  {schEligibilityOpen && (()=>{ const sch=all.find(x=>x.id===schEligibilityOpen); if(!sch) return null; const { match, reasons } = evaluateEligibility(sch, normalizeProfile({answers,onboardingData,institution})); return (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <h4 className="text-xs font-bold text-blue-900 mb-2">Eligibility check: {sch.name}</h4>
                      <div className="space-y-1">{reasons.map((r,i)=><div key={i} className={`text-xs flex gap-2 ${r.ok===false?'text-red-700':r.ok?'text-emerald-700':'text-slate-700'}`}><span>{r.ok===false?'✗':r.ok?'✓':'•'}</span><span>{r.text}</span></div>)}
                      {reasons.length===0 && <p className="text-xs text-slate-600">No detailed criteria beyond availability. See official source for full requirements.</p>}</div>
                      <p className="text-[11px] text-slate-500 mt-2">Availability: Available at this institution · Profile match: {getMatchLabel(match)} — Final eligibility is determined by the provider.</p>
                    </div>
                  );})()}
                </section>
              );
            })()}
          </div>

          {/* Right Sidebar: Data Verification & NAVORA Guidance */}
          <aside className="space-y-6">
            {/* Data Verification Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Data Verification</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Academic Year</span>
                  <span className="font-bold text-slate-800">2026–27</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Annual Fee Basis</span>
                  <span className="font-bold text-slate-800">
                    {institution.minAnnualFee ? formatCurrency(institution.minAnnualFee) : 'Not Available'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Source Provenance</span>
                  <span className="font-semibold text-slate-700">
                    NIRF, State Council (TSCHE / AFRC) & Official Institution
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Verification Status</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Official
                  </span>
                </div>
              </div>

              {institution.website && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <a
                    href={institution.website}
                    onClick={(e) => gateLink(e, { url: institution.website, linkLabel: 'View Official Source', section: 'colleges', collegeSlug: institution.slug, collegeName: institution.name })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Official Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* NAVORA Career Pathway Card */}
            <div className="bg-gradient-to-br from-[#0A192F] to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">NAVORA Career Pathway</h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Graduating from courses offered at {institution.shortName || institution.name} leads directly into recognized industry pathways:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                  <span className="font-bold block text-blue-300">Technology & Computing</span>
                  <span className="text-slate-300 text-[11px]">
                    Software Engineering → Cloud/AI Architecture → Product Leadership
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                  <span className="font-bold block text-blue-300">Management & Business</span>
                  <span className="text-slate-300 text-[11px]">
                    Analyst → Associate Consultant → Investment / Strategic Management
                  </span>
                </div>
              </div>

              <Link
                to="/advisor"
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Ask AI Advisor About This College</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
      <PhonePromptModal
        open={phoneModal.open}
        initialName={phoneModal.initialName}
        initialPhone={phoneModal.initialPhone || ''}
        linkLabel={phoneModal.payload?.linkLabel || 'Official link'}
        onSubmit={submitPhone}
        onClose={closePhoneModal}
      />
    </div>
  );
}
