export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle with gradient effect */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#logoGradient)" />
      
      {/* Chat bubble */}
      <path
        d="M8 12C8 9.79086 9.79086 8 12 8H20C22.2091 8 24 9.79086 24 12V18C24 20.2091 22.2091 22 20 22H14L10 26V22C8.89543 22 8 21.1046 8 20V12Z"
        fill="white"
      />
      
      {/* Message lines */}
      <line
        x1="12"
        y1="14"
        x2="20"
        y2="14"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="17"
        x2="18"
        y2="17"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Sparkle/star effect */}
      <circle cx="22" cy="10" r="1.5" fill="#FCD34D" opacity="0.9" />
      <circle cx="24" cy="8" r="1" fill="#FCD34D" opacity="0.7" />
    </svg>
  );
}

