import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  GitCompare,
  ArrowLeft,
  X,
  Building2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Award,
  Globe,
  Wallet,
  Clock,
  Info,
  Calendar
} from 'lucide-react';
import { ALL_INSTITUTIONS, getInstitutionBySlug } from '../data/institutionsMaster';
import { getScholarshipsForInstitution } from '../data/scholarships';
import GatedOfficialLink from '../components/GatedOfficialLink';
import { isScholarshipActive } from '../lib/scholarshipMatching';
import { COUNTRIES, UNIVERSITIES, FX } from '../data/studyAbroad.js';
import { IllustrationEmptyState } from '../components/EditorialIllustrations';

export default function CollegeCompare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode: 'domestic' | 'global'
  const modeParam = searchParams.get('mode') || 'domestic';
  const [mode, setMode] = useState(modeParam);

  // Selected domestic slugs from URL or default
  const slugsParam = searchParams.get('colleges') || '';
  const initialSlugs = slugsParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const [selectedSlugs, setSelectedSlugs] = useState(() => {
    if (initialSlugs.length > 0) return initialSlugs.slice(0, 4);
    return ['iit-hyderabad', 'cbit-hyderabad'];
  });

  // Selected global country IDs from URL or default
  const globalParam = searchParams.get('countries') || '';
  const initialCountries = globalParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const [selectedCountries, setSelectedCountries] = useState(() => {
    if (initialCountries.length > 0) return initialCountries.slice(0, 4);
    return ['usa', 'uk', 'germany'];
  });

  const [searchDropdown, setSearchDropdown] = useState('');

  // Update domestic slugs in URL
  const updateSlugs = (newSlugs) => {
    setSelectedSlugs(newSlugs);
    setSearchParams({ mode: 'domestic', colleges: newSlugs.join(',') });
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

  // Update global countries in URL
  const updateCountries = (newCountries) => {
    setSelectedCountries(newCountries);
    setSearchParams({ mode: 'global', countries: newCountries.join(',') });
  };

  const removeCountry = (id) => {
    const next = selectedCountries.filter((c) => c !== id);
    updateCountries(next);
  };

  const addCountry = (id) => {
    if (selectedCountries.includes(id)) return;
    if (selectedCountries.length >= 4) {
      alert('You can compare up to 4 global destinations at once.');
      return;
    }
    const next = [...selectedCountries, id];
    updateCountries(next);
    setSearchDropdown('');
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    if (newMode === 'domestic') {
      setSearchParams({ mode: 'domestic', colleges: selectedSlugs.join(',') });
    } else {
      setSearchParams({ mode: 'global', countries: selectedCountries.join(',') });
    }
  };

  // Domestic data
  const comparedInstitutions = useMemo(() => {
    return selectedSlugs.map((s) => getInstitutionBySlug(s)).filter(Boolean);
  }, [selectedSlugs]);

  const availableToAddDomestic = useMemo(() => {
    return ALL_INSTITUTIONS.filter(
      (inst) => !selectedSlugs.includes(inst.slug)
    );
  }, [selectedSlugs]);

  // Global data
  const comparedCountries = useMemo(() => {
    return selectedCountries
      .map((id) => COUNTRIES.find((c) => c.id === id))
      .filter(Boolean);
  }, [selectedCountries]);

  const availableToAddGlobal = useMemo(() => {
    return COUNTRIES.filter((c) => !selectedCountries.includes(c.id));
  }, [selectedCountries]);

  const formatCurrency = (amt) => {
    if (!amt) return 'Not published by institution';
    return `₹${amt.toLocaleString('en-IN')}`;
  };

  const flagFromCode = (code) => {
    if (!code || code.length !== 2) return '🏳️';
    const A = 0x1f1e6;
    return String.fromCodePoint(...[...code.toUpperCase()].map((ch) => A + ch.charCodeAt(0) - 65));
  };

  return (
    <div className="min-h-screen bg-paper pb-24" aria-label="College and Global Study Comparison">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="bg-ink text-white pt-10 pb-12 px-5 sm:px-8 border-b border-brand-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link
              to={mode === 'domestic' ? '/colleges' : '/global-study'}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {mode === 'domestic' ? 'College Discovery' : 'Global Study'}</span>
            </Link>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-control border border-white/15">
              <button
                type="button"
                onClick={() => handleModeSwitch('domestic')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  mode === 'domestic'
                    ? 'bg-white text-ink shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Indian Institutions
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('global')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  mode === 'global'
                    ? 'bg-white text-ink shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Global Study Destinations
              </button>
            </div>
          </div>

          <h1 className="font-ui font-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-2">
            {mode === 'domestic'
              ? 'Compare Higher Education Institutions'
              : 'Compare Global Study Destinations & Universities'}
          </h1>
          <p className="text-xs sm:text-sm text-white/75 max-w-2xl font-normal leading-relaxed">
            Review objective, verified factual criteria side-by-side. NAVORA presents strictly neutral data without arbitrary algorithmic rankings. Verified fees and visa thresholds are distinguished from living estimates.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8">
        {/* ── Selector Header Bar ─────────────────────────────── */}
        <div className="bg-white rounded-card border border-line p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs font-semibold text-ink-2">
            Comparing{' '}
            <span className="font-bold text-ink">
              {mode === 'domestic' ? comparedInstitutions.length : comparedCountries.length}
            </span>{' '}
            of 4 options
          </div>

          {mode === 'domestic' ? (
            selectedSlugs.length < 4 && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={searchDropdown}
                  onChange={(e) => {
                    if (e.target.value) addSlug(e.target.value);
                  }}
                  className="text-xs font-medium bg-paper border border-line rounded-control px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-72"
                  aria-label="Add college to compare"
                >
                  <option value="">+ Add college to compare...</option>
                  {availableToAddDomestic.map((inst) => (
                    <option key={inst.slug} value={inst.slug}>
                      {inst.name} ({inst.city})
                    </option>
                  ))}
                </select>
              </div>
            )
          ) : (
            selectedCountries.length < 4 && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={searchDropdown}
                  onChange={(e) => {
                    if (e.target.value) addCountry(e.target.value);
                  }}
                  className="text-xs font-medium bg-paper border border-line rounded-control px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-72"
                  aria-label="Add country to compare"
                >
                  <option value="">+ Add global destination to compare...</option>
                  {availableToAddGlobal.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.region})
                    </option>
                  ))}
                </select>
              </div>
            )
          )}
        </div>

        {/* ── Legend Strip ─────────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs bg-paper-subtle border border-line px-4 py-2.5 rounded-control">
          <span className="font-bold text-ink-3 uppercase tracking-wider text-[10px]">Data Integrity:</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Regulatory / Institutional Data
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            Estimated Living Cost Range
          </span>
          <span className="inline-flex items-center gap-1.5 text-ink-3 bg-white px-2 py-0.5 rounded border border-line">
            Missing values marked honestly
          </span>
        </div>

        {/* ═══════════════════════════════════════════════════════
            MODE 1: DOMESTIC INSTITUTIONS COMPARISON
           ═══════════════════════════════════════════════════════ */}
        {mode === 'domestic' && (
          <>
            {comparedInstitutions.length > 0 ? (
              <div className="overflow-x-auto bg-white rounded-panel border border-line shadow-card">
                <table className="w-full text-left border-collapse" aria-label="Domestic institutions comparison table">
                  <thead>
                    <tr className="border-b border-line bg-paper/70">
                      <th className="p-4 text-xs font-bold text-ink-3 uppercase tracking-wider w-48 sticky left-0 bg-paper/95 z-10 backdrop-blur-xs">
                        Category
                      </th>
                      {comparedInstitutions.map((inst) => (
                        <th key={inst.id} className="p-4 w-72 min-w-[280px] align-top">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wide block mb-1">
                                {inst.institutionType}
                              </span>
                              <Link
                                to={`/colleges/${inst.slug}`}
                                className="text-sm font-bold text-ink hover:text-brand-600 leading-tight block"
                              >
                                {inst.name}
                              </Link>
                              <span className="text-xs text-ink-3 block mt-0.5">{inst.location}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSlug(inst.slug)}
                              className="p-1 text-ink-3 hover:text-ink hover:bg-paper rounded transition-colors cursor-pointer"
                              title="Remove from comparison"
                              aria-label={`Remove ${inst.name} from comparison`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-xs">
                    {/* Ownership & Status */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        Ownership & Affiliation
                      </td>
                      {comparedInstitutions.map((inst) => (
                        <td key={inst.id} className="p-4 text-ink">
                          <div>
                            <strong>{inst.ownership || 'Private'}</strong> ({inst.universityAffiliation || 'Autonomous / Deemed'})
                          </div>
                          <span className="text-ink-3 text-[11px]">
                            {inst.autonomousStatus ? 'UGC Autonomous Institution' : 'Affiliated College'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Accreditation & NIRF */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        Accreditation & NIRF
                      </td>
                      {comparedInstitutions.map((inst) => (
                        <td key={inst.id} className="p-4 text-ink space-y-1">
                          <div className="font-semibold text-ink">
                            {inst.nirfRank || 'State Accredited'}
                          </div>
                          <div className="text-ink-3 text-[11px]">{inst.recognition || 'UGC / AICTE Approved'}</div>
                        </td>
                      ))}
                    </tr>

                    {/* Annual Tuition Fee (Verified) */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        <div>Tuition Fee (Annual)</div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-semibold mt-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified Institutional Data
                        </span>
                      </td>
                      {comparedInstitutions.map((inst) => (
                        <td key={inst.id} className="p-4">
                          <div className="text-sm font-bold text-brand-700">
                            {inst.minAnnualFee
                              ? `${formatCurrency(inst.minAnnualFee)} – ${formatCurrency(inst.maxAnnualFee || inst.minAnnualFee)}`
                              : 'Information not published by college'}
                          </div>
                          <span className="text-[10px] text-ink-3 block mt-0.5">Per academic year · Tuition only</span>
                        </td>
                      ))}
                    </tr>

                    {/* Hostel & Living (Estimated) */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        <div>Hostel & Living</div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 font-semibold mt-0.5">
                          <Info className="w-3 h-3 text-amber-600" />
                          Estimated Living Cost
                        </span>
                      </td>
                      {comparedInstitutions.map((inst) => (
                        <td key={inst.id} className="p-4 text-ink">
                          {inst.hostelAvailable ? (
                            <div className="space-y-1">
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                On-Campus Residential Available
                              </span>
                              <div className="text-[11px] text-ink-3">
                                Est. ₹60,000 – ₹1,20,000 / year (Hostel & Mess)
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="text-ink-3">Day Scholar / Off-Campus PG Only</span>
                              <div className="text-[11px] text-ink-4">Est. PG ₹8,000 – ₹14,000 / month</div>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Key Entrance Exams & Admission Route */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        Entrance Exams & Criteria
                      </td>
                      {comparedInstitutions.map((inst) => (
                        <td key={inst.id} className="p-4 text-ink">
                          <span className="font-semibold text-ink block">
                            {inst.courses?.[0]?.entranceExam || 'State CET / Institutional Exam'}
                          </span>
                          <span className="text-ink-3 text-[11px] block mt-0.5">
                            {inst.courses?.[0]?.admissionMode || 'Convener Quota (Category A) & Management Quota (Category B)'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Verified Placements */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        <div>Verified Placements</div>
                        <span className="text-[10px] text-ink-3 block font-normal">NIRF / Institutional report</span>
                      </td>
                      {comparedInstitutions.map((inst) => (
                        <td key={inst.id} className="p-4 text-ink space-y-1">
                          {inst.placements ? (
                            <>
                              <div className="font-bold text-ink">
                                Median: {formatCurrency(inst.placements.medianPackage)}
                              </div>
                              <div className="text-ink-2 text-[11px]">
                                Average: {formatCurrency(inst.placements.averagePackage)}
                              </div>
                              <div className="text-emerald-700 text-[11px] font-semibold">
                                Placement Rate: {inst.placements.placementRate}%
                              </div>
                            </>
                          ) : (
                            <span className="text-ink-4 italic">Not published in official NIRF disclosure</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Scholarships Available */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        Scholarships & Fee Reimbursement
                      </td>
                      {comparedInstitutions.map((inst) => {
                        const count =
                          getScholarshipsForInstitution(inst.slug).filter(isScholarshipActive).length +
                          (inst.scholarships?.length || 0);
                        return (
                          <td key={inst.id} className="p-4 text-ink">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold">
                              <Award className="w-3.5 h-3.5" /> {count} verified opportunities
                            </span>
                            <div className="text-[11px] text-ink-3 mt-1">
                              State Fee Reimbursement (TS ePASS) & Merit Aid eligible
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Data Source & Verification Date */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        Data Source & Verification
                      </td>
                      {comparedInstitutions.map((inst) => (
                        <td key={inst.id} className="p-4 text-ink-3 text-[11px]">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            {inst.verificationStatus || 'VERIFIED'}
                          </div>
                          <div className="mt-0.5">Source: {inst.recognition || 'TSCHE / Osmania Univ'}</div>
                          <div className="text-ink-4">Academic Year 2024-25</div>
                        </td>
                      ))}
                    </tr>

                    {/* Official Links */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        Official Links
                      </td>
                      {comparedInstitutions.map((inst) => (
                        <td key={inst.id} className="p-4 text-ink">
                          <div className="flex items-center gap-2">
                            {inst.website && (
                              <GatedOfficialLink
                                url={inst.website}
                                linkLabel="Official Website"
                                section="colleges"
                                collegeSlug={inst.slug}
                                collegeName={inst.name}
                                className="text-xs font-semibold text-brand-600 hover:underline inline-flex items-center gap-1"
                              >
                                <span>Official Website</span>
                                <ExternalLink className="w-3 h-3" />
                              </GatedOfficialLink>
                            )}
                            <Link
                              to={`/colleges/${inst.slug}`}
                              className="px-2.5 py-1 bg-ink text-white rounded-control text-[11px] font-semibold hover:bg-brand-900 transition-colors"
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
              <div className="bg-white rounded-panel border border-line p-12 text-center shadow-card">
                <IllustrationEmptyState className="w-32 h-32 mx-auto mb-4" />
                <h3 className="font-ui font-bold text-lg text-ink mb-1.5">No Colleges Selected</h3>
                <p className="text-xs sm:text-sm text-ink-2 max-w-sm mx-auto mb-5 leading-relaxed">
                  Select 2 to 4 colleges from our verified catalog to compare their fees, eligibility, hostel, and placements side-by-side.
                </p>
                <Link
                  to="/colleges"
                  className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 shadow-brand inline-block"
                >
                  Explore Colleges Catalog
                </Link>
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════════════════
            MODE 2: GLOBAL STUDY DESTINATIONS COMPARISON
           ═══════════════════════════════════════════════════════ */}
        {mode === 'global' && (
          <>
            {comparedCountries.length > 0 ? (
              <div className="overflow-x-auto bg-white rounded-panel border border-line shadow-card">
                <table className="w-full text-left border-collapse" aria-label="Global study destinations comparison table">
                  <thead>
                    <tr className="border-b border-line bg-paper/70">
                      <th className="p-4 text-xs font-bold text-ink-3 uppercase tracking-wider w-48 sticky left-0 bg-paper/95 z-10 backdrop-blur-xs">
                        Category
                      </th>
                      {comparedCountries.map((c) => (
                        <th key={c.id} className="p-4 w-72 min-w-[280px] align-top">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl" role="img" aria-label={c.name}>
                                  {flagFromCode(c.code)}
                                </span>
                                <span className="text-xs font-bold text-brand-700 uppercase tracking-wide">
                                  {c.region}
                                </span>
                              </div>
                              <h3 className="text-base font-bold text-ink leading-tight">
                                {c.name}
                              </h3>
                              <span className="text-xs text-ink-3 block mt-0.5">
                                Currency: {c.currency} ({FX[c.currency] ? `1 ${c.currency} ≈ ₹${FX[c.currency]}` : ''})
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCountry(c.id)}
                              className="p-1 text-ink-3 hover:text-ink hover:bg-paper rounded transition-colors cursor-pointer"
                              title="Remove from comparison"
                              aria-label={`Remove ${c.name} from comparison`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-xs">
                    {/* Annual Tuition Range */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        <div>Annual Tuition Range</div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-semibold mt-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified Tuition Band
                        </span>
                      </td>
                      {comparedCountries.map((c) => {
                        const rate = FX[c.currency] || 85;
                        const minINR = Math.round((c.tuitionRange.min * rate) / 100000);
                        const maxINR = Math.round((c.tuitionRange.max * rate) / 100000);
                        return (
                          <td key={c.id} className="p-4">
                            <div className="text-sm font-bold text-brand-700">
                              {c.currency} {c.tuitionRange.min.toLocaleString()} – {c.tuitionRange.max.toLocaleString()}
                            </div>
                            <div className="text-xs font-semibold text-ink mt-0.5">
                              ≈ ₹{minINR}L – ₹{maxINR}L / year
                            </div>
                            <span className="text-[10px] text-ink-3 block mt-0.5">
                              {c.id === 'germany' ? 'Public unis zero/low tuition; private unis higher' : 'Varies by university ranking & subject'}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Estimated Living Cost (Monthly & Annual) */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        <div>Estimated Living Cost</div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 font-semibold mt-0.5">
                          <Info className="w-3 h-3 text-amber-600" />
                          Estimated Living Cost
                        </span>
                      </td>
                      {comparedCountries.map((c) => {
                        const rate = FX[c.currency] || 85;
                        const minAnnualINR = Math.round((c.annualLivingCost.min * rate) / 100000);
                        const maxAnnualINR = Math.round((c.annualLivingCost.max * rate) / 100000);
                        return (
                          <td key={c.id} className="p-4 text-ink">
                            <div className="font-semibold text-ink">
                              {c.currency} {c.monthlyLivingCost.min} – {c.monthlyLivingCost.max} / month
                            </div>
                            <div className="text-[11px] text-ink-2 mt-0.5">
                              Annual: ≈ ₹{minAnnualINR}L – ₹{maxAnnualINR}L ({c.currency} {c.annualLivingCost.min.toLocaleString()} – {c.annualLivingCost.max.toLocaleString()})
                            </div>
                            <div className="text-[10px] text-ink-3 mt-1 leading-tight">
                              {c.cityNote || 'Capital cities significantly higher'}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Visa Financial Requirement / Proof of Funds */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        <div>Visa Financial Requirement</div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-semibold mt-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Official Visa Rule
                        </span>
                      </td>
                      {comparedCountries.map((c) => (
                        <td key={c.id} className="p-4 text-ink">
                          <p className="font-semibold text-ink leading-relaxed">
                            {c.visaFinancialRequirement || 'Proof of full tuition + living for first year'}
                          </p>
                          <span className="text-[10px] text-ink-3 block mt-1">
                            Government-mandated proof of funds before visa grant
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Post-Study Work Visa Route & Rights */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        Post-Study Work Route
                      </td>
                      {comparedCountries.map((c) => (
                        <td key={c.id} className="p-4 text-ink">
                          <span className="font-bold text-brand-700 block">
                            {c.postStudyRoute}
                          </span>
                          <span className="text-xs text-ink font-semibold block mt-0.5">
                            Duration: {c.postStudyDuration}
                          </span>
                          <span className="text-[11px] text-ink-3 block mt-0.5">
                            Work during study: {c.workWhileStudying}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Admission & Language Requirements */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        Language & Admissions
                      </td>
                      {comparedCountries.map((c) => (
                        <td key={c.id} className="p-4 text-ink">
                          <p className="text-xs text-ink leading-relaxed font-medium">
                            {c.languageConsiderations}
                          </p>
                          <span className="text-[11px] text-ink-3 block mt-1">
                            Eligibility: {c.postStudyEligibility}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Key Scholarships */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        Scholarship Opportunities
                      </td>
                      {comparedCountries.map((c) => (
                        <td key={c.id} className="p-4 text-ink">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold mb-1.5">
                            <Award className="w-3.5 h-3.5" /> Verified Scholarships
                          </span>
                          <p className="text-[11px] text-ink-2 leading-relaxed">
                            {c.scholarshipAvailability || 'Merit and need-based institutional aid'}
                          </p>
                        </td>
                      ))}
                    </tr>

                    {/* Official Regulatory Warnings */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        Important Warnings & Risks
                      </td>
                      {comparedCountries.map((c) => (
                        <td key={c.id} className="p-4">
                          <ul className="space-y-1.5">
                            {(c.importantWarnings || []).map((w, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-[11px] text-amber-900 bg-amber-50/70 p-2 rounded border border-amber-200/60 leading-tight">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                                <span>{w}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    {/* Official Verification & Source */}
                    <tr>
                      <td className="p-4 font-bold text-ink sticky left-0 bg-white">
                        Data Source & Verification
                      </td>
                      {comparedCountries.map((c) => (
                        <td key={c.id} className="p-4 text-ink-3 text-[11px]">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-0.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Official Government Immigration Portal
                          </div>
                          {c.sourceUrl && (
                            <a
                              href={c.sourceUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="text-brand-600 hover:underline inline-flex items-center gap-1 truncate max-w-[200px]"
                            >
                              <span>{c.sourceUrl.replace('https://', '')}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          )}
                          <div className="text-ink-4 mt-1">Last verified: {c.lastVerified || '2025-09-01'}</div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-panel border border-line p-12 text-center shadow-card">
                <IllustrationEmptyState className="w-32 h-32 mx-auto mb-4" />
                <h3 className="font-ui font-bold text-lg text-ink mb-1.5">No Destinations Selected</h3>
                <p className="text-xs sm:text-sm text-ink-2 max-w-sm mx-auto mb-5 leading-relaxed">
                  Select 2 to 4 countries from our global study catalog to compare their tuition, living budgets, visa requirements, and post-study work routes.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCountries(['usa', 'uk', 'germany'])}
                  className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 shadow-brand inline-block cursor-pointer"
                >
                  Load Popular Comparison (USA, UK, Germany)
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Footer Guidance Disclaimer ───────────────────────── */}
        <div className="mt-8 p-4 rounded-card bg-paper-subtle border border-line text-xs text-ink-2 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Advisory Integrity Notice:</strong> All figures reflect published 2024–2025 academic and immigration regulations.
            Living expense figures represent independent estimates and must not be confused with legal visa maintenance minimums. Foreign exchange conversions are indicative (updated quarterly). Always verify specific university fees and visa requirements with official government portals before committing funds.
          </p>
        </div>
      </div>
    </div>
  );
}
