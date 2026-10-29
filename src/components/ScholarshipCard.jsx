import { Award, Calendar, ShieldCheck, AlertCircle, CheckCircle2, ExternalLink, Bookmark } from 'lucide-react';
import { getMatchLabel, PROFILE_MATCH } from '../lib/scholarshipMatching';
import { useSavedScholarships } from '../hooks/useSavedScholarships';

function MatchBadge({ match }) {
  const styles = {
    [PROFILE_MATCH.YOU_MAY_BE_ELIGIBLE]: 'bg-success-soft text-success border-success/25',
    [PROFILE_MATCH.POTENTIAL_MATCH]: 'bg-primary-soft text-primary-active border-primary/20',
    [PROFILE_MATCH.MORE_INFO_REQUIRED]: 'bg-warning-soft text-warning border-warning/25',
    [PROFILE_MATCH.DOES_NOT_APPEAR]: 'bg-paper text-ink-2 border-line',
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
  if (v === 'VERIFIED') return <span className="inline-flex items-center gap-1 text-xs font-semibold text-success"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>;
  if (v === 'EXPIRED') return <span className="text-xs font-semibold text-ink-3">Expired</span>;
  if (v === 'NEEDS_VERIFICATION') return <span className="inline-flex items-center gap-1 text-xs font-medium text-warning"><AlertCircle className="w-3.5 h-3.5" /> Needs verification</span>;
  return <span className="text-xs text-ink-3">{v || 'Unverified'}</span>;
}

export default function ScholarshipCard({ scholarship, relationshipType, match, reasons, onView, onCheck }) {
  const { isSaved, toggle } = useSavedScholarships();
  const saved = isSaved(scholarship.id);
  const deadlineText = scholarship.application_deadline ? new Date(scholarship.application_deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : 'See official source';
  const isExpired = scholarship.status === 'expired' || scholarship.verification_status === 'EXPIRED';
  const amountText = scholarship.award_amount ? `${scholarship.award_currency || 'INR'} ${Number(scholarship.award_amount).toLocaleString('en-IN')}` : (scholarship.tuition_coverage || scholarship.funding_type || 'As per scheme');
  const coverageText = scholarship.tuition_coverage || amountText;

  return (
    <div className={`card ${isExpired ? 'opacity-60' : 'card-interactive'}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="type-card-title text-sm text-ink leading-tight">{scholarship.name}</h4>
          <p className="text-xs text-ink-3 mt-0.5">{scholarship.provider_name} · <span className="font-medium">{relationshipType}</span></p>
        </div>
        <button onClick={()=>toggle(scholarship.id)} title={saved? 'Unsave':'Save scholarship'} aria-pressed={saved} aria-label={saved? 'Unsave scholarship':'Save scholarship'} className={`p-1.5 rounded-control border ${saved? 'bg-warning-soft border-warning/30 text-warning':'bg-paper border-line text-ink-3 hover:text-ink'}`}>
          <Bookmark className={`w-4 h-4 ${saved? 'fill-warning text-warning':''}`} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {scholarship.funding_type && <span className="px-2 py-0.5 text-xs font-semibold rounded-control bg-ink text-white">{scholarship.funding_type}</span>}
        {scholarship.scholarship_type && <span className="px-2 py-0.5 text-xs font-medium rounded-control bg-paper text-ink-2 border border-line">{scholarship.scholarship_type}</span>}
        {scholarship.country && scholarship.country !== 'India' && <span className="px-2 py-0.5 text-xs font-medium rounded-control bg-primary-soft text-primary-active border border-brand-200">{scholarship.country}</span>}
        {scholarship.eligible_nationalities?.includes('India') && scholarship.country !== 'India' && <span className="px-2 py-0.5 text-xs font-medium rounded-control bg-success-soft text-success border border-success/25">For Indian students</span>}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-paper border border-line rounded-control p-2.5">
          <span className="text-ink-3 block text-[11px]">Amount / Coverage</span>
          <span className="font-bold text-ink">{coverageText}</span>
        </div>
        <div className="bg-paper border border-line rounded-control p-2.5">
          <span className="text-ink-3 block text-[11px] flex items-center gap-1"><Calendar className="w-3 h-3" /> Deadline</span>
          <span className={`font-semibold ${isExpired? 'text-ink-3':'text-ink'}`}>{deadlineText}</span>
        </div>
      </div>

      <div className="space-y-1.5 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-ink-3">Availability:</span>
          <span className="font-semibold text-primary">Available at this institution</span>
          <span className="text-ink-3 text-[11px]">({relationshipType})</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-ink-3">Profile match:</span>
          <MatchBadge match={match} />
        </div>
        {reasons?.slice(0,2).map((r,i)=>(
          <div key={i} className={`flex gap-1.5 text-[11px] ${r.ok===false? 'text-error': r.ok? 'text-success':'text-ink-2'}`}>
            <span className="mt-0.5">{r.ok===false? '✗' : r.ok? '✓':'•'}</span><span>{r.text}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-line gap-2">
        <VerificationPill s={scholarship} />
        <div className="flex gap-1.5">
          <button onClick={onCheck} className="px-3 py-1.5 rounded-control border border-strong bg-surface text-ink text-xs font-semibold hover:bg-paper">Check My Eligibility</button>
          <button onClick={onView} className="px-3.5 py-1.5 rounded-control bg-primary text-white text-xs font-bold hover:bg-primary-hover">View Details</button>
        </div>
      </div>
      <p className="text-[11px] text-ink-3 mt-2">Final eligibility is determined by the scholarship provider. Verify on official website before applying.</p>
    </div>
  );
}
