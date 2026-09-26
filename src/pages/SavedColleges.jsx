import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, ArrowLeft, Building2, ArrowRight, GitCompare, Trash2 } from 'lucide-react';
import { useSavedColleges } from '../hooks/useSavedColleges';
import { getInstitutionBySlug } from '../data/institutionsMaster';
import CollegeCard from '../components/CollegeCard';
import { getScholarshipsForInstitution } from '../data/scholarships';
import { isScholarshipActive, normalizeProfile, evaluateEligibility, getMatchLabel } from '../lib/scholarshipMatching';
import { useUser } from '../context/UserContext';
import { Link as RouterLink } from 'react-router-dom';
import { Award } from 'lucide-react';

export default function SavedColleges() {
  const { savedSlugs, toggleSaveCollege } = useSavedColleges();
  const { answers, onboardingData } = useUser();
  const navigate = useNavigate();

  const savedInstitutions = savedSlugs
    .map((s) => getInstitutionBySlug(s))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header */}
      <div className="bg-[#0A192F] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/colleges"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to College Discovery</span>
            </Link>

            {savedInstitutions.length >= 2 && (
              <button
                onClick={() =>
                  navigate(
                    `/colleges/compare?colleges=${savedInstitutions
                      .slice(0, 4)
                      .map((i) => i.slug)
                      .join(',')}`
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-500"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare Saved ({savedInstitutions.length})</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Bookmark className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                My Saved Colleges
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-0.5">
                Bookmarked institutions saved for quick reference, counselling prep, and fee comparison.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {savedInstitutions.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {savedInstitutions.length} Saved {savedInstitutions.length === 1 ? 'Institution' : 'Institutions'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedInstitutions.map((inst) => {
                const schs = getScholarshipsForInstitution(inst.slug).filter(isScholarshipActive);
                const profile = normalizeProfile({ answers, onboardingData, institution: inst });
                const potential = schs.filter(s=> evaluateEligibility(s, profile).match !== 'DOES_NOT_APPEAR').length;
                return (
                  <div key={inst.id} className="space-y-2">
                    <CollegeCard institution={inst} />
                    {schs.length>0 && (
                      <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-blue-600" /> {schs.length} scholarships · {potential} potential</span>
                        <Link to={`/colleges/${inst.slug}#scholarships`} className="text-xs font-bold text-blue-600 hover:underline">View Scholarships</Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto mt-8">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No colleges saved yet</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              As you explore institutions in Hyderabad and across India, click the bookmark icon on any college card to save it here for fast review.
            </p>
            <Link
              to="/colleges"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors shadow-sm"
            >
              <span>Explore Colleges Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
