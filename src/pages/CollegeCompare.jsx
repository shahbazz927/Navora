import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  GitCompare,
  ArrowLeft,
  X,
  Building2,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Plus,
  ArrowRight,
  Award
} from 'lucide-react';
import { ALL_INSTITUTIONS, getInstitutionBySlug } from '../data/institutionsMaster';
import { getScholarshipsForInstitution } from '../data/scholarships';
import GatedOfficialLink from '../components/GatedOfficialLink';
import { isScholarshipActive } from '../lib/scholarshipMatching';

export default function CollegeCompare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Selected slugs from URL or default
  const slugsParam = searchParams.get('colleges') || '';
  const initialSlugs = slugsParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const [selectedSlugs, setSelectedSlugs] = useState(() => {
    if (initialSlugs.length > 0) return initialSlugs.slice(0, 4);
    // Default 2 top institutions for preview
    return ['iit-hyderabad', 'cbit-hyderabad'];
  });

  const [searchDropdown, setSearchDropdown] = useState('');

  // Update URL search params
  const updateSlugs = (newSlugs) => {
    setSelectedSlugs(newSlugs);
    setSearchParams({ colleges: newSlugs.join(',') });
  };

  const removeSlug = (slug) => {
    const next = selectedSlugs.filter((s) => s !== slug);
    updateSlugs(next);
  };

  const addSlug = (slug) => {
    if (selectedSlugs.includes(slug)) return;
    if (selectedSlugs.length >= 4) {
      alert('You can compare up to 4 institutions at once.');
      return;
    }
    const next = [...selectedSlugs, slug];
    updateSlugs(next);
    setSearchDropdown('');
  };

  const comparedInstitutions = useMemo(() => {
    return selectedSlugs.map((s) => getInstitutionBySlug(s)).filter(Boolean);
  }, [selectedSlugs]);

  const availableToAdd = useMemo(() => {
    return ALL_INSTITUTIONS.filter(
      (inst) => !selectedSlugs.includes(inst.slug)
    );
  }, [selectedSlugs]);

  const formatCurrency = (amt) => {
    if (!amt) return 'Not Available';
    return `₹${amt.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header */}
      <div className="bg-[#0A192F] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/colleges"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to College Discovery</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Compare Higher Education Institutions
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl font-light">
            Review objective, verified factual criteria side-by-side. NAVORA presents strictly neutral data without arbitrary algorithmic rankings.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Selector Header Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs font-semibold text-slate-600">
            Comparing <span className="font-bold text-slate-900">{comparedInstitutions.length}</span> of 4 institutions
          </div>

          {selectedSlugs.length < 4 && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={searchDropdown}
                onChange={(e) => {
                  if (e.target.value) addSlug(e.target.value);
                }}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-64"
              >
                <option value="">+ Add college to compare...</option>
                {availableToAdd.map((inst) => (
                  <option key={inst.slug} value={inst.slug}>
                    {inst.name} ({inst.city})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {comparedInstitutions.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-48 sticky left-0 bg-slate-50/90 backdrop-blur z-10">
                    Category
                  </th>
                  {comparedInstitutions.map((inst) => (
                    <th key={inst.id} className="p-4 w-72 min-w-[280px] align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide block mb-1">
                            {inst.institutionType}
                          </span>
                          <Link
                            to={`/colleges/${inst.slug}`}
                            className="text-sm font-bold text-slate-900 hover:text-blue-600 leading-tight block"
                          >
                            {inst.name}
                          </Link>
                          <span className="text-xs text-slate-500 block mt-0.5">{inst.location}</span>
                        </div>
                        <button
                          onClick={() => removeSlug(inst.slug)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {/* Location & Ownership */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white">
                    Ownership & Status
                  </td>
                  {comparedInstitutions.map((inst) => (
                    <td key={inst.id} className="p-4 text-slate-800">
                      <div>
                        <strong>{inst.ownership}</strong> ({inst.universityAffiliation})
                      </div>
                      <span className="text-slate-500 text-[11px]">
                        {inst.autonomousStatus ? 'Autonomous Institution' : 'Affiliated'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Accreditation & NIRF */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white">
                    Accreditation & NIRF
                  </td>
                  {comparedInstitutions.map((inst) => (
                    <td key={inst.id} className="p-4 text-slate-800 space-y-1">
                      <div className="font-semibold text-slate-900">
                        {inst.nirfRank || 'State Accredited'}
                      </div>
                      <div className="text-slate-500 text-[11px]">{inst.accreditation}</div>
                    </td>
                  ))}
                </tr>

                {/* Popular Degrees */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white">
                    Key Courses Offered
                  </td>
                  {comparedInstitutions.map((inst) => (
                    <td key={inst.id} className="p-4 text-slate-800">
                      <div className="flex flex-wrap gap-1">
                        {inst.courses?.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium"
                          >
                            {c.degree} {c.courseName?.split('(')[0]?.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Annual Tuition Fee */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white">
                    Tuition Fee (Annual)
                  </td>
                  {comparedInstitutions.map((inst) => (
                    <td key={inst.id} className="p-4 text-slate-800 font-bold text-sm text-blue-700">
                      {inst.minAnnualFee
                        ? formatCurrency(inst.minAnnualFee)
                        : 'Information not yet verified'}
                    </td>
                  ))}
                </tr>

                {/* Hostel & Living */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white">
                    Hostel & Living
                  </td>
                  {comparedInstitutions.map((inst) => (
                    <td key={inst.id} className="p-4 text-slate-800">
                      {inst.hostelAvailable ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          On-Campus Residential
                        </span>
                      ) : (
                        <span className="text-slate-500">Day Scholar / Off-Campus</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Key Entrance Exams */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white">
                    Entrance Exams & Route
                  </td>
                  {comparedInstitutions.map((inst) => (
                    <td key={inst.id} className="p-4 text-slate-800">
                      <span className="font-semibold text-slate-900 block">
                        {inst.courses?.[0]?.entranceExam || 'EAPCET / ICET'}
                      </span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        {inst.courses?.[0]?.admissionMode}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Placement Track Record */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white">
                    Verified Placements
                  </td>
                  {comparedInstitutions.map((inst) => (
                    <td key={inst.id} className="p-4 text-slate-800 space-y-1">
                      {inst.placements ? (
                        <>
                          <div className="font-bold text-slate-900">
                            Median: {formatCurrency(inst.placements.medianPackage)}
                          </div>
                          <div className="text-slate-600 text-[11px]">
                            Average: {formatCurrency(inst.placements.averagePackage)}
                          </div>
                          <div className="text-emerald-700 text-[11px] font-semibold">
                            Placement Rate: {inst.placements.placementRate}%
                          </div>
                        </>
                      ) : (
                        <span className="text-slate-400 italic">Not available / unverified</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Scholarships — factual comparison only, no ranking §19 */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white">
                    Scholarships & Financial Aid
                  </td>
                  {comparedInstitutions.map((inst) => {
                    const count = getScholarshipsForInstitution(inst.slug).filter(isScholarshipActive).length + (inst.scholarships?.length || 0);
                    return (
                      <td key={inst.id} className="p-4 text-slate-800">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold">
                          <Award className="w-3.5 h-3.5" /> {count} opportunities
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1">Available at this institution (factual count)</div>
                      </td>
                    );
                  })}
                </tr>

                {/* Facilities */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white">
                    Key Facilities
                  </td>
                  {comparedInstitutions.map((inst) => (
                    <td key={inst.id} className="p-4 text-slate-800">
                      <div className="flex flex-wrap gap-1">
                        {inst.facilities?.slice(0, 4).map((f, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded text-[11px]"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Official Links */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white">
                    Official Links
                  </td>
                  {comparedInstitutions.map((inst) => (
                    <td key={inst.id} className="p-4 text-slate-800">
                      <div className="flex items-center gap-2">
                        {inst.website && (
                          <GatedOfficialLink
                            url={inst.website}
                            linkLabel="Official Website"
                            section="colleges"
                            collegeSlug={inst.slug}
                            collegeName={inst.name}
                            className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            <span>Website</span>
                            <ExternalLink className="w-3 h-3" />
                          </GatedOfficialLink>
                        )}
                        <Link
                          to={`/colleges/${inst.slug}`}
                          className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-[11px] font-semibold hover:bg-blue-800"
                        >
                          View Detail
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No colleges selected</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select 2 to 4 colleges from our discovery catalog to compare them side by side.
            </p>
            <Link
              to="/colleges"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 inline-block"
            >
              Explore Colleges Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
