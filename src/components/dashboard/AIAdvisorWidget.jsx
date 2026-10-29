import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';

export default function AIAdvisorWidget({ used }) {
  return (
    <section aria-labelledby="ai-widget" className="bg-white border border-line rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="w-11 h-11 rounded-2xl bg-brand-950 text-cyan-300 flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h2 id="ai-widget" className="font-ui font-bold text-[1.05rem] text-ink">AI Advisor</h2>
          <p className="text-sm text-ink-2 mt-0.5">
            <strong className="text-ink">Unlimited messages</strong>
            <span className="text-ink-3"> · no daily limit{used ? ` · ${used} sent today` : ''}</span>
          </p>
        </div>
        <Link
          to="/advisor"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-ink text-white text-sm font-semibold px-5 py-2.5 hover:bg-brand-950 transition-colors"
        >
          Ask Advisor <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
