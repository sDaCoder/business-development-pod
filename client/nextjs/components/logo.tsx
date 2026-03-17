export function CurioGeniusLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Hexagon / Cube representation */}
      <path
        d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Inner Node Network (Brain/AI concept) */}
      <circle cx="50" cy="30" r="6" />
      <circle cx="30" cy="65" r="6" />
      <circle cx="70" cy="65" r="6" />
      <circle cx="50" cy="50" r="8" />

      {/* Connecting lines */}
      <path
        d="M50 36 L50 42 M44 53 L36 60 M56 53 L64 60"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M30 25 L50 5 M70 25 M30 75 L50 95 L70 75 M10 50 L30 50 M90 50 L70 50"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}
