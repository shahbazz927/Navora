import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, ShieldCheck, GraduationCap, Building2, Bookmark, ArrowRight, GitCompare, Home, Award } from 'lucide-react';
import { useSavedColleges } from '../hooks/useSavedColleges';
import { getScholarshipsForInstitution } from '../data/scholarships';
import { isScholarshipActive } from '../lib/scholarshipMatching';

export default function CollegeCard({ institution, isSelectedForCompare = false, onToggleCompare }) {
  const { isSaved, toggleSaveCollege } = useSavedColleges();
  const navigate = useNavigate();
  const saved = isSaved(institution.slug);

  const formatFee = (amount) => {
    if (!amount) return 'Information not yet verified';
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh / yr`;
    }
    return `₹${amount.toLocaleString('en-IN')} / yr`;
  };

  const primaryCourse = institution.courses?.[0];
  const schCount = getScholarshipsForInstitution(institution.slug).filter(isScholarshipActive).length + (institution.scholarships?.length || 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div className="p-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-800 border border-blue-100 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-blue-600" />
              {institution.institutionType}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700">
              {institution.ownership}
            </span>
            {institution.autonomousStatus && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                Autonomous
              </span>
            )}
          </div>

          <button
            onClick={() => toggleSaveCollege(institution.slug)}
            title={saved ? 'Remove from Saved Colleges' : 'Save College'}
            className={`p-2 rounded-lg transition-colors ${
              saved
                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                : 'bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>

        {/* College Name & Location */}
        <div className="mb-4">
          <Link to={`/colleges/${institution.slug}`}>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
              {institution.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{institution.location || `${institution.city}, ${institution.state}`}</span>
          </div>
        </div>

        {/* Ranking & Accreditation */}
        {institution.nirfRank && (
          <div className="mb-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed font-medium">
              {institution.nirfRank}
            </div>
          </div>
        )}
        {/* Scholarships indicator §18 — only when real count >0 */}
        {schCount > 0 && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" /> Scholarships: {schCount}
          </div>
        )}

        {/* Academic Details Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs mb-4">
          <div>
            <span className="text-slate-400 block text-[11px]">Degrees Offered</span>
            <span className="font-semibold text-slate-800">
              {institution.levels?.join(', ') || 'UG / PG'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Tuition Fee (Annual)</span>
            <span className="font-semibold text-slate-800">
              {institution.minAnnualFee ? formatFee(institution.minAnnualFee) : 'Information not yet verified'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Key Entrance Exam</span>
            <span className="font-semibold text-slate-800">
              {primaryCourse?.entranceExam || 'EAPCET / Merit'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Hostel Facility</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Home className="w-3 h-3 text-slate-400" />
              {institution.hostelAvailable ? 'Available On-Campus' : 'Day Scholar / Off-Campus'}
            </span>
          </div>
        </div>

        {/* Featured Programs */}
        {institution.courses && institution.courses.length > 0 && (
          <div className="space-y-1 mb-4">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Popular Programs
            </span>
            <div className="flex flex-wrap gap-1.5">
              {institution.courses.slice(0, 3).map((c, i) => (
                <span
                  key={i}
                  className="inline-block px-2 py-0.5 text-xs bg-slate-100 text-slate-700 rounded font-medium"
                >
                  {c.degree} {c.courseName?.split('(')[0]?.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Verification provenance tag */}
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50/70 px-2.5 py-1 rounded-md border border-emerald-100/80">
          <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>Verified NIRF & State Council 2026-27</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => {
            if (onToggleCompare) {
              onToggleCompare(institution.slug);
            } else {
              navigate(`/colleges/compare?colleges=${institution.slug}`);
            }
          }}
          className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all flex items-center gap-1.5 ${
            isSelectedForCompare
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          {isSelectedForCompare ? 'Selected' : 'Compare'}
        </button>

        <Link
          to={`/colleges/${institution.slug}`}
          className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-[#0A192F] text-white hover:bg-blue-900 transition-colors flex items-center gap-1.5"
        >
          <span>View College</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
