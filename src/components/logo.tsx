import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative animate-logo-entry", className)}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Hacker mask */}
        <path d="M25 30 Q50 20 75 30 Q90 50 75 80 L50 95 L25 80 Q10 50 25 30 Z" fill="#111" />
        <path d="M25 30 Q50 20 75 30 Q90 50 75 80 L50 95 L25 80 Q10 50 25 30 Z" stroke="hsl(var(--accent))" strokeWidth="1" />
        
        {/* Eyes */}
        <path d="M35 50 Q40 45 45 50 Q40 55 35 50 Z" fill="hsl(var(--accent))" />
        <path d="M55 50 Q60 45 65 50 Q60 55 55 50 Z" fill="hsl(var(--accent))" />
        
        {/* "2025" */}
        <text x="50" y="70" fontFamily="Source Code Pro, monospace" fontSize="16" fill="#0f0" textAnchor="middle" fontWeight="bold" filter="url(#neon-glow)">
          2025
        </text>

        {/* Neon code elements */}
        <path d="M10 40 L20 45 L15 55" stroke="#0f0" strokeWidth="1.5" filter="url(#neon-glow)" strokeLinecap="round" />
        <path d="M90 40 L80 45 L85 55" stroke="#0f0" strokeWidth="1.5" filter="url(#neon-glow)" strokeLinecap="round" />
      </svg>
    </div>
  );
}
