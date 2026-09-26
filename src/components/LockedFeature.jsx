import { Lock } from 'lucide-react';
export default function LockedFeature({ title, desc, cta='Unlock with Pro', onUnlock }){
  return (
    <div className="bg-white border border-line rounded-2xl p-5 flex gap-4 items-start">
      <span className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0"><Lock className="w-4 h-4 text-brand-600" /></span>
      <div className="flex-1">
        <h4 className="font-semibold text-ink text-sm">{title}</h4>
        <p className="text-sm text-ink-2 mt-1 leading-relaxed">{desc}</p>
        <button onClick={onUnlock} className="mt-3 inline-flex items-center rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2">{cta}</button>
      </div>
    </div>
  );
}
