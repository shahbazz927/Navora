import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Liquid-glass navigation.
 *
 * One shared lens of glass travels between the options: it rests on the
 * active route and glides to whatever the pointer is over, so moving from
 * one option to the next reads as a single piece of glass moving rather
 * than two separate states. The lens is decorative — the active option is
 * still carried by `aria-current="page"` and by the text colour.
 */
export default function GlassNav({
  links,
  pathname,
  layoutId,
  ariaLabel,
  orientation = 'horizontal',
  onNavigate,
  className = '',
}) {
  const [hovered, setHovered] = useState(null);
  const reduceMotion = useReducedMotion();

  const activeTo = links.find((link) => link.isActive(pathname))?.to ?? null;
  const lensOn = hovered ?? activeTo;

  const itemCls =
    orientation === 'vertical'
      ? 'relative flex items-center w-full rounded-full px-3.5 py-2.5 text-[0.95rem] font-medium transition-colors'
      : 'relative flex items-center rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors';

  return (
    <nav
      aria-label={ariaLabel}
      className={`${
        orientation === 'vertical' ? 'flex flex-col gap-1' : 'flex items-center gap-1'
      } ${className}`}
    >
      {links.map((link) => {
        const active = link.isActive(pathname);
        const onLens = lensOn === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            onMouseEnter={() => setHovered(link.to)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(link.to)}
            onBlur={() => setHovered(null)}
            aria-current={active ? 'page' : undefined}
            className={`${itemCls} ${onLens ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
          >
            {lensOn === link.to && (
              <motion.span
                aria-hidden="true"
                layoutId={layoutId}
                className="absolute inset-0 rounded-full glass-lens"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 420, damping: 34, mass: 0.55 }
                }
              />
            )}
            <span className="relative z-10 whitespace-nowrap">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
