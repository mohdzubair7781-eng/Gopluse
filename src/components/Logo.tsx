import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = true 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Brand Logo Display matching user's exact uploaded design */}
      <div className="relative flex items-center">
        <img 
          src="/goplus-logo.jpg" 
          alt="Go Plus Medicine Delivery Logo" 
          referrerPolicy="no-referrer"
          className={`${sizeClasses} w-auto object-contain drop-shadow-sm`}
          onError={(e) => {
            // If image fails, fallback to inline SVG replica
            const target = e.currentTarget;
            target.style.display = 'none';
            const svgSibling = target.nextElementSibling as HTMLElement;
            if (svgSibling) svgSibling.style.display = 'flex';
          }}
        />

        {/* Crisp vector fallback / alternative */}
        <div className="hidden items-center" aria-label="Go Plus">
          <svg 
            viewBox="0 0 320 120" 
            className={`${sizeClasses} w-auto`}
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Speed streaks on left */}
            <path d="M10 45H50C53 45 55 42 55 39C55 36 53 33 50 33H10C7 33 5 36 5 39C5 42 7 45 10 45Z" fill="#F97316"/>
            <path d="M2 62H42C45 62 47 59 47 56C47 53 45 50 42 50H2C-1 50 -1 56 2 62Z" fill="#EA580C"/>
            <path d="M14 79H38C41 79 43 76 43 73C43 70 41 67 38 67H14C11 67 9 70 9 73C9 76 11 79 14 79Z" fill="#FB923C"/>

            {/* Letter G */}
            <path d="M125 32C108 32 94 45 94 62C94 79 108 92 125 92C138 92 148 84 152 74H125V60H167C168 64 168 68 168 73C168 96 149 112 125 112C94 112 70 89 70 62C70 35 94 12 125 12C143 12 158 20 167 33L150 46C144 38 135 32 125 32Z" fill="#0F172A"/>

            {/* Letter O with Scooter Rider Silhouette */}
            <circle cx="215" cy="62" r="48" fill="#0F172A" />
            <circle cx="215" cy="62" r="30" fill="white" />
            
            {/* Scooter Courier Silhouette */}
            <g transform="translate(195, 45) scale(0.45)">
              {/* Rider Head / Helmet */}
              <circle cx="48" cy="18" r="8" fill="#0F172A"/>
              {/* Rider Body */}
              <path d="M42 26C38 32 35 44 34 52H52C53 45 54 36 48 26Z" fill="#0F172A"/>
              {/* Delivery Box with speed lines */}
              <rect x="16" y="24" width="18" height="18" rx="2" fill="#F97316"/>
              <line x1="6" y1="28" x2="13" y2="28" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="8" y1="34" x2="13" y2="34" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Scooter Frame */}
              <path d="M22 55L34 55L44 42L56 55H62" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Wheels */}
              <circle cx="25" cy="62" r="7" fill="#0F172A"/>
              <circle cx="25" cy="62" r="3" fill="white"/>
              <circle cx="58" cy="62" r="7" fill="#0F172A"/>
              <circle cx="58" cy="62" r="3" fill="white"/>
            </g>

            {/* Vibrant Orange Plus Sign */}
            <path d="M290 40H306C309 40 312 43 312 46V54H320C323 54 326 57 326 60V68C326 71 323 74 320 74H312V82C312 85 309 88 306 88H290C287 88 284 85 284 82V74H276C273 74 270 71 270 68V60C270 57 273 54 276 54H284V46C284 43 287 40 290 40Z" fill="url(#orangeGrad)"/>
            
            <defs>
              <linearGradient id="orangeGrad" x1="270" y1="40" x2="326" y2="88" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="1" stopColor="#EA580C" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showSubtitle && (
        <div className="flex flex-col justify-center leading-none">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            15-Min Local Meds
          </span>
        </div>
      )}
    </div>
  );
};
