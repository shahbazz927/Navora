/* Progress uses the reserved journey accent (teal) per the design system.
   Pass accentClass explicitly to override for a one-off context. */
export default function StepIndicator({ currentStep, totalSteps, labels = [], accentClass = 'journey-fill' }) {
  const pct = totalSteps === 0 ? 0 : (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3.5">
        <span className="eyebrow text-ink-3">
          Step {currentStep + 1} <span className="text-ink-4 normal-case">of {totalSteps}</span>
        </span>
        {labels[currentStep] && (
          <span className="text-sm font-medium text-ink-2">{labels[currentStep]}</span>
        )}
      </div>
      <div className="journey-track relative w-full" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
        <div
          className={`h-full ${accentClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
