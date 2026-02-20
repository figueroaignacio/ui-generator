export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="32" height="32" rx="8" className="fill-foreground" />
      <rect x="6" y="19" width="20" height="8" rx="3" className="fill-background" opacity="0.2" />
      <rect x="6" y="13.5" width="20" height="8" rx="3" className="fill-background" opacity="0.5" />
      <rect x="6" y="8" width="20" height="9" rx="3" className="fill-background" />
      <path
        d="M10.5 15V10L15.5 15V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-foreground"
      />
      <circle cx="20" cy="12.5" r="1.8" className="fill-foreground" />
    </svg>
  );
}
