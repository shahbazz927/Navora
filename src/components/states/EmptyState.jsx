import { Link } from 'react-router-dom';
import { IllustrationEmptyState } from '../EditorialIllustrations';

export default function EmptyState({
  illustration: CustomIllustration,
  icon: Icon,
  title = 'Nothing here yet',
  description,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      <div className="mb-4 flex items-center justify-center">
        {CustomIllustration ? (
          <CustomIllustration className="w-36 h-36 sm:w-44 sm:h-44" />
        ) : Icon ? (
          <span className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
            <Icon className="w-7 h-7 text-brand-600" />
          </span>
        ) : (
          <IllustrationEmptyState className="w-36 h-36 sm:w-44 sm:h-44" />
        )}
      </div>
      <h3 className="font-ui font-bold text-lg text-ink tracking-tight">{title}</h3>
      {description && <p className="mt-2 text-sm text-ink-2 max-w-md leading-relaxed">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 shadow-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
