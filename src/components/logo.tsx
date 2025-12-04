import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg 
      className={cn(className)}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="white"/>
      <path d="M50 25C40 25 35 35 35 45C35 55 45 75 50 85C55 75 65 55 65 45C65 35 60 25 50 25Z" fill="#16A34A"/>
      <path d="M50 25C40 25 35 35 35 45C35 55 45 75 50 85" stroke="white" strokeWidth="2"/>
      <path d="M50 25C60 25 65 35 65 45C65 55 55 75 50 85" stroke="white" strokeWidth="2"/>
      <circle cx="50" cy="20" r="5" fill="#16A34A"/>
    </svg>
  );
}
