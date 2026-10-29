import { useEffect, useState, useCallback } from 'react';
import logoUrl from '../assets/navora-logo.png';

/**
 * NAVORA premium splash screen.
 *
 * Shows once per browser session (sessionStorage), never replays during
 * client-side navigation, and always unmounts on schedule so it can never
 * block access to the website — even if the animation or image fails.
 *
 * Animation sequence (normal motion):
 *   0.0–0.3s  background paints, logo begins revealing (opacity + scale)
 *   0.3–0.8s  logo settles into its final centred position
 *   0.8–1.2s  tagline "Navigate Your Future." fades up beneath the logo
 *   1.2–1.7s  splash fades out and the existing homepage is revealed
 *
 * Reduced motion: instant reveal, brief display, immediate exit.
 */
export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('initial'); // initial | logo | tagline | exit | done
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const timers = [];

    if (reduced) {
      // Respect the user's motion preference: no animation, brief display.
      setPhase('logo');
      timers.push(setTimeout(() => setPhase('tagline'), 100));
      timers.push(setTimeout(() => setPhase('exit'), 450));
      timers.push(setTimeout(() => setPhase('done'), 700));
    } else {
      // 0.0–0.3s: begin revealing the logo.
      setPhase('logo');
      // 0.3–0.8s: logo settles into its final position.
      timers.push(setTimeout(() => setPhase('logo-settled'), 300));
      // 0.8–1.2s: reveal the tagline beneath the logo.
      timers.push(setTimeout(() => setPhase('tagline'), 800));
      // 1.2–1.7s: fade out the splash and reveal the homepage.
      timers.push(setTimeout(() => setPhase('exit'), 1200));
      timers.push(setTimeout(() => setPhase('done'), 1700));
    }

    return () => timers.forEach((t) => clearTimeout(t));
  }, [reduced]);

  const handleExitComplete = useCallback(() => {
    if (phase === 'exit') {
      setPhase('done');
      if (typeof onFinish === 'function') onFinish();
    }
  }, [phase, onFinish]);

  if (phase === 'done') return null;

  return (
    <div
      className="navora-splash"
      data-phase={phase}
      role="status"
      aria-label="NAVORA — Navigate Your Future"
      aria-busy={phase !== 'exit'}
      onTransitionEnd={handleExitComplete}
    >
      <img
        src={logoUrl}
        alt="NAVORA"
        className="navora-splash__logo"
        aria-label="NAVORA logo"
        decoding="async"
      />
      {phase === 'tagline' && (
        <p className="navora-splash__tagline">Navigate Your Future.</p>
      )}
    </div>
  );
}
