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
    <div className="bg-surface rounded-card border border-line card-interactive flex flex-col justify-between overflow-hidden group">
      <div className="p-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="badge badge-info">
              <Building2 className="w-3 h-3" />
              {institution.institutionType}
            </span>
            <span className="badge badge-neutral">
              {institution.ownership}
            </span>
            {institution.autonomousStatus && (
              <span className="badge badge-success">
                Autonomous
              </span>
            )}
          </div>

          <button
            onClick={() => toggleSaveCollege(institution.slug)}
            title={saved ? 'Remove from Saved Colleges' : 'Save College'}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from Saved Colleges' : 'Save College'}
            className={`p-2 rounded-control border transition-colors ${
              saved
                ? 'bg-warning-soft border-warning/30 text-warning'
                : 'bg-paper border-line text-ink-3 hover:text-ink'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-warning text-warning' : ''}`} />
          </button>
        </div>

        {/* College Name & Location */}
        <div className="mb-4">
          <Link to={`/colleges/${institution.slug}`}>
            <h3 className="type-card-title text-lg text-ink group-hover:text-primary transition-colors leading-snug">
              {institution.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 type-meta mt-1">
            <MapPin className="w-3.5 h-3.5 text-ink-4 shrink-0" />
            <span>{institution.location || `${institution.city}, ${institution.state}`}</span>
          </div>
        </div>

        {/* Ranking & Accreditation */}
        {institution.nirfRank && (
          <div className="mb-4 p-2.5 rounded-control bg-paper border border-line flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-ink-2 leading-relaxed font-medium">
              {institution.nirfRank}
            </div>
          </div>
        )}
        {/* Scholarships indicator §18 — only when real count >0 */}
        {schCount > 0 && (
          <div className="mb-3 badge badge-info">
            <Award className="w-3.5 h-3.5" /> Scholarships: {schCount}
          </div>
        )}

        {/* Academic Details Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-line text-xs mb-4">
          <div>
            <span className="text-ink-3 block text-[11px]">Degrees Offered</span>
            <span className="font-semibold text-ink">
              {institution.levels?.join(', ') || 'UG / PG'}
            </span>
          </div>
          <div>
            <span className="text-ink-3 block text-[11px]">Tuition Fee (Annual)</span>
            <span className="font-semibold text-ink">
              {institution.minAnnualFee ? formatFee(institution.minAnnualFee) : 'Information not yet verified'}
            </span>
          </div>
          <div>
            <span className="text-ink-3 block text-[11px]">Key Entrance Exam</span>
            <span className="font-semibold text-ink">
              {primaryCourse?.entranceExam || 'EAPCET / Merit'}
            </span>
          </div>
          <div>
            <span className="text-ink-3 block text-[11px]">Hostel Facility</span>
            <span className="font-semibold text-ink flex items-center gap-1">
              <Home className="w-3 h-3 text-ink-4" />
              {institution.hostelAvailable ? 'Available On-Campus' : 'Day Scholar / Off-Campus'}
            </span>
          </div>
        </div>

        {/* Featured Programs */}
        {institution.courses && institution.courses.length > 0 && (
          <div className="space-y-1 mb-4">
            <span className="text-[11px] font-medium text-ink-3 uppercase tracking-wider block">
              Popular Programs
            </span>
            <div className="flex flex-wrap gap-1.5">
              {institution.courses.slice(0, 3).map((c, i) => (
                <span
                  key={i}
                  className="inline-block px-2 py-0.5 text-xs bg-paper text-ink-2 border border-line rounded-control font-medium"
                >
                  {c.degree} {c.courseName?.split('(')[0]?.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Verification provenance tag */}
        <div className="badge badge-success">
          <CheckCircle className="w-3 h-3 shrink-0" />
          <span>Verified NIRF & State Council 2026-27</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-paper border-t border-line flex items-center justify-between gap-2">
        <button
          onClick={() => {
            if (onToggleCompare) {
              onToggleCompare(institution.slug);
            } else {
              navigate(`/colleges/compare?colleges=${institution.slug}`);
            }
          }}
          aria-pressed={isSelectedForCompare}
          className={`text-xs font-semibold px-3 py-2 rounded-control border transition-all flex items-center gap-1.5 ${
            isSelectedForCompare
              ? 'bg-primary text-white border-primary'
              : 'border-strong text-ink hover:bg-surface'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          {isSelectedForCompare ? 'Selected' : 'Compare'}
        </button>

        <Link
          to={`/colleges/${institution.slug}`}
          className="text-xs font-semibold px-3.5 py-2 rounded-control bg-ink text-white hover:bg-brand-950 transition-colors flex items-center gap-1.5"
        >
          <span>View College</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
