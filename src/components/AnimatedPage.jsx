/* Motion is intentionally limited to interactions that aid comprehension
   (see individual components). Page/section entry animations were removed:
   content renders immediately, which is faster and respects user expectations. */

export default function AnimatedPage({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

export function FadeIn({ children, delay: _delay = 0, className = '' }) {
  return <div className={className}>{children}</div>;
}

export function StaggerContainer({ children, className = '', stagger: _stagger = 0.08 }) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className = '' }) {
  return <div className={`h-full ${className}`}>{children}</div>;
}
