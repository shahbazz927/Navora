import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, Calendar, Award, Globe, Bookmark } from 'lucide-react';
import { getScholarshipById, SCHOLARSHIPS } from '../data/scholarships';
import { getInstitutionBySlug } from '../data/institutionsMaster';
import { normalizeProfile, evaluateEligibility, getMatchLabel } from '../lib/scholarshipMatching';
import { useUser } from '../context/UserContext';
import { useSavedScholarships } from '../hooks/useSavedScholarships';
import { useGatedOfficialLink } from '../hooks/useGatedOfficialLink';
import PhonePromptModal from '../components/PhonePromptModal';

export default function ScholarshipDetail() {
  const { slug, scholarshipId } = useParams();
  const { answers, onboardingData } = useUser();
  const { isSaved, toggle } = useSavedScholarships();
  const { gateLink, phoneModal, closePhoneModal, submitPhone } = useGatedOfficialLink();
  const scholarship = getScholarshipById(scholarshipId) || SCHOLARSHIPS.find(s=>s.id===scholarshipId);
  const institution = slug ? getInstitutionBySlug(slug) : null;
  const gatedBase = {
    section: 'scholarships',
    collegeSlug: institution?.slug || slug || null,
    collegeName: institution?.name || null,
    scholarshipId: scholarship?.id,
    scholarshipName: scholarship?.name,
  };

  if (!scholarship) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><div className="bg-white rounded-2xl p-8 border text-center"><h2 className="font-bold text-slate-900">Scholarship not found</h2><Link to={slug?`/colleges/${slug}`:'/colleges'} className="text-blue-600 text-sm mt-3 inline-block">Back</Link></div></div>;
  }
  const isAbroad = Boolean(scholarship.country && scholarship.country !== 'India');
  const backTo = slug ? `/colleges/${slug}` : (isAbroad ? '/study-abroad' : '/colleges');
  const backLabel = institution?.name || (isAbroad ? 'Global Study' : 'Colleges');
  const profile = normalizeProfile({ answers, onboardingData, institution });
  const { match, reasons } = evaluateEligibility(scholarship, profile);
  const saved = isSaved(scholarship.id);

  const Row = ({ label, value }) => value ? <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 border-b border-slate-100 last:border-0"><span className="text-xs font-semibold text-slate-500">{label}</span><span className="text-sm font-medium text-slate-800 text-left sm:text-right max-w-[60%]">{value}</span></div> : null;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-[#0A192F] text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link to={backTo} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-4"><ArrowLeft className="w-4 h-4" /> Back to {backLabel}</Link>
          <div className="flex flex-wrap gap-2 mb-3">
            {scholarship.funding_type && <span className="px-2.5 py-1 text-xs font-bold rounded bg-blue-600 text-white">{scholarship.funding_type}</span>}
            {scholarship.scholarship_type && <span className="px-2.5 py-1 text-xs font-semibold rounded bg-white/10 border border-white/20 text-blue-200">{scholarship.scholarship_type}</span>}
            <span className={`px-2.5 py-1 text-xs font-semibold rounded border ${scholarship.verification_status==='VERIFIED'?'bg-emerald-500/20 text-emerald-300 border-emerald-400/30':'bg-amber-500/20 text-amber-300 border-amber-400/30'}`}>{scholarship.verification_status}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">{scholarship.name}</h1>
          <p className="text-sm text-slate-300 mt-2">{scholarship.provider_name} · {scholarship.provider_type}</p>
          <div className="flex gap-2 mt-4">
            <button onClick={()=>toggle(scholarship.id)} className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${saved? 'bg-amber-500 text-white':'bg-white/10 text-white border border-white/20'}`}><Bookmark className={`w-4 h-4 ${saved?'fill-white':''}`} />{saved?'Saved':'Save'}</button>
            {scholarship.official_application_url && <a href={scholarship.official_application_url} onClick={(e) => gateLink(e, { ...gatedBase, url: scholarship.official_application_url, linkLabel: 'Official application link' })} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-1.5">Apply on Official Site <ExternalLink className="w-3.5 h-3.5" /></a>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Award className="w-5 h-5 text-blue-600" /> Who can apply?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{scholarship.description}</p>
            <div className="mt-4 space-y-0 text-sm divide-y divide-slate-100">
              <Row label="Education levels" value={scholarship.education_levels?.join(', ')} />
              <Row label="Eligible courses" value={scholarship.eligible_courses?.join(', ')} />
              <Row label="Eligible nationalities" value={scholarship.eligible_nationalities?.join(', ')} />
              <Row label="Eligible states" value={scholarship.eligible_states?.join(', ')} />
              <Row label="Domicile" value={scholarship.domicile_requirement} />
              <Row label="Minimum percentage" value={scholarship.minimum_percentage ? `${scholarship.minimum_percentage}%` : null} />
              <Row label="Minimum CGPA" value={scholarship.minimum_cgpa} />
              <Row label="Income limit" value={scholarship.income_limit ? `₹${Number(scholarship.income_limit).toLocaleString('en-IN')}` : null} />
              <Row label="Gender" value={scholarship.gender_requirement} />
              <Row label="Category" value={scholarship.category_requirement?.join(', ')} />
              <Row label="Disability" value={scholarship.disability_requirement} />
            </div>
            {(scholarship.academic_requirements || scholarship.special_requirements) && (
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                {scholarship.academic_requirements && <p><strong>Academic:</strong> {scholarship.academic_requirements}</p>}
                {scholarship.special_requirements && <p className="mt-1"><strong>Other:</strong> {scholarship.special_requirements}</p>}
              </div>
            )}
          </section>

          {Array.isArray(scholarship.eligibility_highlights) && scholarship.eligibility_highlights.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-600" /> Eligibility rules that usually decide it</h3>
              <ul className="space-y-1.5">
                {scholarship.eligibility_highlights.map((h,i)=>(
                  <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-blue-600">•</span><span>{h}</span></li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-400 mt-3">Summary taken from the provider’s published rules as reviewed on {scholarship.last_verified_at || 'the last review date'}. Final eligibility and selection are always at the provider’s discretion.</p>
            </section>
          )}

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-3">Benefits</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100"><span className="text-xs text-slate-400 block">Award amount</span><span className="font-bold text-slate-900">{scholarship.award_amount ? `${scholarship.award_currency} ${Number(scholarship.award_amount).toLocaleString('en-IN')}` : 'As per scheme'}</span></div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100"><span className="text-xs text-slate-400 block">Tuition coverage</span><span className="font-semibold text-slate-800">{scholarship.tuition_coverage || '—'}</span></div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100"><span className="text-xs text-slate-400 block">Living allowance</span><span className="font-medium text-slate-800">{scholarship.living_allowance || '—'}</span></div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100"><span className="text-xs text-slate-400 block">Travel</span><span className="font-medium text-slate-800">{scholarship.travel_allowance || '—'}</span></div>
              {scholarship.accommodation && <div className="p-3 bg-slate-50 rounded-xl border"><span className="text-xs text-slate-400 block">Accommodation</span><span className="font-medium">{scholarship.accommodation}</span></div>}
              {scholarship.insurance && <div className="p-3 bg-slate-50 rounded-xl border"><span className="text-xs text-slate-400 block">Insurance</span><span className="font-medium">{scholarship.insurance}</span></div>}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" /> Application</h3>
            <div className="text-sm text-slate-700 space-y-1">
              <p><strong>Deadline:</strong> {scholarship.application_deadline ? new Date(scholarship.application_deadline).toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'}) : 'Check official source'}</p>
              {scholarship.application_window && <p><strong>Application window:</strong> {scholarship.application_window}</p>}
              <p><strong>Academic year:</strong> {scholarship.academic_year}</p>
              {scholarship.official_application_url && <a href={scholarship.official_application_url} onClick={(e) => gateLink(e, { ...gatedBase, url: scholarship.official_application_url, linkLabel: 'Official application link' })} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"><Globe className="w-4 h-4" /> Official application link <ExternalLink className="w-3 h-3" /></a>}
              {scholarship.official_source_url && <a href={scholarship.official_source_url} onClick={(e) => gateLink(e, { ...gatedBase, url: scholarship.official_source_url, linkLabel: 'Official source' })} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 ml-3 text-xs"><ShieldCheck className="w-3.5 h-3.5" /> Official source</a>}
            </div>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              Scholarship availability and eligibility can change. Verify the latest information on the official provider website before applying.
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-blue-600" /> Profile match</h4>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${match==='YOU_MAY_BE_ELIGIBLE'?'bg-emerald-50 text-emerald-700 border-emerald-200': match==='POTENTIAL_MATCH'?'bg-blue-50 text-blue-700 border-blue-200': match==='DOES_NOT_APPEAR'?'bg-red-50 text-red-700 border-red-200':'bg-amber-50 text-amber-700 border-amber-200'}`}>{getMatchLabel(match)}</span>
            <ul className="mt-3 space-y-1.5">
              {reasons.map((r,i)=>(
                <li key={i} className={`text-xs flex gap-1.5 ${r.ok===false?'text-red-600':r.ok?'text-emerald-700':'text-slate-600'}`}><span>{r.ok===false?'✗':r.ok?'✓':'•'}</span><span>{r.text}</span></li>
              ))}
              {reasons.length===0 && <li className="text-xs text-slate-500">No specific criteria to check beyond availability. See provider site.</li>}
            </ul>
            <p className="text-[11px] text-slate-400 mt-3">Based on information available in your NAVORA profile. Final eligibility is determined by the provider.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-2">Verification</h4>
            <p><span className="text-slate-500">Source:</span> <span className="font-semibold">{scholarship.source_name}</span> ({scholarship.source_type})</p>
            <p className="mt-1 break-all"><span className="text-slate-500">URL:</span> <a href={scholarship.official_source_url} onClick={(e) => gateLink(e, { ...gatedBase, url: scholarship.official_source_url, linkLabel: 'Official source' })} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{scholarship.official_source_url}</a></p>
            <p className="mt-1"><span className="text-slate-500">Status:</span> <span className="font-semibold">{scholarship.verification_status}</span></p>
            <p className="mt-1"><span className="text-slate-500">Last verified:</span> <span className="font-medium">{scholarship.last_verified_at || '—'}</span></p>
            <p className="mt-1"><span className="text-slate-500">Last updated:</span> <span className="font-medium">{scholarship.last_updated_at || '—'}</span></p>
          </div>
        </aside>
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
