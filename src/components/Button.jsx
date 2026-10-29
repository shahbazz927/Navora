/* Canonical variants (design system v1): primary · secondary · tertiary ·
   destructive. The remaining entries are deprecated aliases kept so older
   call-sites render exactly as before — do not use in new code. */
const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  tertiary: 'btn-tertiary',
  destructive: 'btn-destructive',
  // ── Deprecated aliases (frozen visuals) ──
  dark: 'bg-ink text-white hover:bg-brand-950 shadow-xs',
  outline:
    'bg-transparent text-brand-700 border border-brand-200 hover:border-brand-400 hover:bg-brand-50',
  ghost:
    'bg-transparent text-ink-2 hover:text-ink hover:bg-paper-deep',
  glass:
    'bg-white/10 text-white border border-white/25 hover:bg-white/20',
  navy:
    'bg-brand-950 text-white border border-brand-800 hover:bg-ink shadow-xs',
};

const sizes = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  xl: 'btn-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  fullWidth = false,
  shine: _shine,
  ...props
}) {
  const tone = variants[variant] ?? variants.primary;

  return (
    <button
      className={`
        btn ${tone} ${sizes[size] ?? sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
