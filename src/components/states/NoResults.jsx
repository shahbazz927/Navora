import { IllustrationNoResults } from '../EditorialIllustrations';

export default function NoResults({ query, onClear }) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      <div className="mb-4 flex items-center justify-center">
        <IllustrationNoResults className="w-36 h-36 sm:w-44 sm:h-44" />
      </div>
      <h3 className="font-ui font-bold text-lg text-ink tracking-tight">No results found</h3>
      {query ? (
        <p className="mt-2 text-sm text-ink-2 max-w-md leading-relaxed">
          No verified matches found for “<span className="font-semibold text-ink">{query}</span>”. Try adjusting your search criteria, widening the filter bands, or exploring adjacent fields.
        </p>
      ) : (
        <p className="mt-2 text-sm text-ink-2 max-w-md leading-relaxed">
          Try adjusting or clearing your filters to see available programmes and pathways.
        </p>
      )}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-xl border border-line bg-surface hover:bg-paper text-sm font-semibold text-ink px-5 py-2.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
