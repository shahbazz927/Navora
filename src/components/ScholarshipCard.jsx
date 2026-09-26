import { Award, Calendar, ShieldCheck, AlertCircle, CheckCircle2, ExternalLink, Bookmark } from 'lucide-react';
import { getMatchLabel, PROFILE_MATCH } from '../lib/scholarshipMatching';
import { useSavedScholarships } from '../hooks/useSavedScholarships';

function MatchBadge({ match }) {
  const styles = {
    [PROFILE_MATCH.YOU_MAY_BE_ELIGIBLE]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    [PROFILE_MATCH.POTENTIAL_MATCH]: 'bg-blue-50 text-blue-700 border-blue-200',
    [PROFILE_MATCH.MORE_INFO_REQUIRED]: 'bg-amber-50 text-amber-700 border-amber-200',
    [PROFILE_MATCH.DOES_NOT_APPEAR]: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  const icons = {
    [PROFILE_MATCH.YOU_MAY_BE_ELIGIBLE]: <CheckCircle2 className="w-3.5 h-3.5" />,
    [PROFILE_MATCH.POTENTIAL_MATCH]: <ShieldCheck className="w-3.5 h-3.5" />,
    [PROFILE_MATCH.MORE_INFO_REQUIRED]: <AlertCircle className="w-3.5 h-3.5" />,
    [PROFILE_MATCH.DOES_NOT_APPEAR]: <AlertCircle className="w-3.5 h-3.5" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[match] || styles[PROFILE_MATCH.MORE_INFO_REQUIRED]}`}>
      {icons[match]} {getMatchLabel(match)}
    </span>
  );
}

function VerificationPill({ s }) {
  const v = s.verification_status;
  if (v === 'VERIFIED') return <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified</span>;
  if (v === 'EXPIRED') return <span className="text-xs font-semibold text-slate-500">Expired</span>;
  if (v === 'NEEDS_VERIFICATION') return <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700"><AlertCircle className="w-3.5 h-3.5" /> Needs verification</span>;
  return <span className="text-xs text-slate-500">{v || 'Unverified'}</span>;
}

export default function ScholarshipCard({ scholarship, relationshipType, match, reasons, onView, onCheck }) {
  const { isSaved, toggle } = useSavedScholarships();
  const saved = isSaved(scholarship.id);
  const deadlineText = scholarship.application_deadline ? new Date(scholarship.application_deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : 'See official source';
  const isExpired = scholarship.status === 'expired' || scholarship.verification_status === 'EXPIRED';
  const amountText = scholarship.award_amount ? `${scholarship.award_currency || 'INR'} ${Number(scholarship.award_amount).toLocaleString('en-IN')}` : (scholarship.tuition_coverage || scholarship.funding_type || 'As per scheme');
  const coverageText = scholarship.tuition_coverage || amountText;

  return (
    <div className={`p-4 rounded-xl border bg-white ${isExpired ? 'opacity-60 border-slate-200' : 'border-slate-200 hover:border-blue-200'} transition-colors`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 leading-tight">{scholarship.name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{scholarship.provider_name} · <span className="font-medium">{relationshipType}</span></p>
        </div>
        <button onClick={()=>toggle(scholarship.id)} title={saved? 'Unsave':'Save scholarship'} className={`p-1.5 rounded-lg border ${saved? 'bg-amber-50 border-amber-200 text-amber-600':'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'}`}>
          <Bookmark className={`w-4 h-4 ${saved? 'fill-amber-500 text-amber-500':''}`} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {scholarship.funding_type && <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-900 text-white">{scholarship.funding_type}</span>}
        {scholarship.scholarship_type && <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700 border border-slate-200">{scholarship.scholarship_type}</span>}
        {scholarship.country && scholarship.country !== 'India' && <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700 border border-blue-100">{scholarship.country}</span>}
        {scholarship.eligible_nationalities?.includes('India') && scholarship.country !== 'India' && <span className="px-2 py-0.5 text-xs font-medium rounded bg-emerald-50 text-emerald-700 border border-emerald-100">For Indian students</span>}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
          <span className="text-slate-400 block text-[11px]">Amount / Coverage</span>
          <span className="font-bold text-slate-900">{coverageText}</span>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
          <span className="text-slate-400 block text-[11px] flex items-center gap-1"><Calendar className="w-3 h-3" /> Deadline</span>
          <span className={`font-semibold ${isExpired? 'text-slate-500':'text-slate-900'}`}>{deadlineText}</span>
        </div>
      </div>

      <div className="space-y-1.5 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Availability:</span>
          <span className="font-semibold text-blue-700">Available at this institution</span>
          <span className="text-slate-400 text-[11px]">({relationshipType})</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400">Profile match:</span>
          <MatchBadge match={match} />
        </div>
        {reasons?.slice(0,2).map((r,i)=>(
          <div key={i} className={`flex gap-1.5 text-[11px] ${r.ok===false? 'text-red-600': r.ok? 'text-emerald-700':'text-slate-600'}`}>
            <span className="mt-0.5">{r.ok===false? '✗' : r.ok? '✓':'•'}</span><span>{r.text}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 gap-2">
        <VerificationPill s={scholarship} />
        <div className="flex gap-1.5">
          <button onClick={onCheck} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50">Check My Eligibility</button>
          <button onClick={onView} className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">View Details</button>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 mt-2">Final eligibility is determined by the scholarship provider. Verify on official website before applying.</p>
    </div>
  );
}
