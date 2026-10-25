/** Khatam (8-point star) used for the logo, splash and hero. Colour follows currentColor. */
export default function Star({ className = '', sw = 1 }: { className?: string; sw?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth={sw}>
      <rect x="18" y="18" width="64" height="64" />
      <rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)" />
      <circle cx="50" cy="50" r="22" /><circle cx="50" cy="50" r="8" />
    </svg>
  )
}
