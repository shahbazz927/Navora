// Plain background for the auth screens. The form itself carries the visual interest.
export default function BackgroundEffects({ theme = 'light' }) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed inset-0 -z-10 ${
        isDark ? 'bg-brand-950' : 'bg-paper'
      }`}
      aria-hidden="true"
    />
  );
}
