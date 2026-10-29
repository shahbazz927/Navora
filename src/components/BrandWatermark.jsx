import markLightBlue from '../assets/navora-mark-lightblue.png';

/**
 * Decorative NAVORA mark rendered as a soft light-blue background layer.
 *
 * Purely ornamental — it is hidden from assistive tech and never accepts
 * pointer events, so it can sit behind real content without affecting
 * layout, focus order, or interaction.
 *
 * The asset is a pre-tinted, alpha-preserving copy of the brand mark
 * (navora-mark-lightblue.png). Tinting it at build time keeps the colour
 * identical on every browser instead of relying on a CSS filter that can
 * shift the hue.
 */
export default function BrandWatermark({
  className = '',
  opacity = 0.14,
  size = 'min(58vh, 34rem)',
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      <img
        src={markLightBlue}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="select-none object-contain"
        style={{ height: size, width: 'auto', opacity }}
      />
    </div>
  );
}
