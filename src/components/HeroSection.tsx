import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Translations } from '../i18n/translations.ts';

interface HeroSectionProps {
  onExploreProperties: () => void;
  onHowItWorks: () => void;
  t: Translations['hero'];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProperties,
  onHowItWorks,
  t,
}) => {
  return (
    <div className="relative w-full bg-[#f8fafc] overflow-hidden">
      {/* Container with relative framing */}
      <div className="relative min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] w-full">
        {/* Background Image of Luxury House at Dusk */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_luxury_home_1791898470387.jpg"
            alt="Luxury contemporary architectural villa at dusk with illuminated pool"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right lg:object-center"
          />
          {/* Subtle gradient scrim ensuring dark text is 100% legible on the left while preserving photographic clarity on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent lg:w-[62%] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/40 pointer-events-none" />
        </div>

        {/* Hero Content on the left */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-28 lg:pb-32">
          <div className="max-w-xl">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[46px] font-extrabold text-[#101827] tracking-tight leading-[1.12]">
              {t.headingPart1}
              <br />
              {t.headingPart2}{' '}
              <span className="text-[#1D58A7]">{t.headingHighlight}</span>
            </h1>

            {/* Sub-headline description */}
            <p className="mt-4 text-sm sm:text-[15px] text-slate-700 font-normal leading-relaxed max-w-md">
              {t.description}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onExploreProperties}
                className="bg-[#082653] hover:bg-[#16477F] text-white text-xs sm:text-[13px] font-semibold px-5 py-3 rounded-md transition-all shadow-sm hover:shadow flex items-center gap-2 group cursor-pointer"
              >
                <span>{t.exploreProperties}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={onHowItWorks}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-[13px] font-semibold px-5 py-3 rounded-md transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <span>{t.howItWorks}</span>
                <Play className="w-3.5 h-3.5 text-slate-700 fill-slate-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
