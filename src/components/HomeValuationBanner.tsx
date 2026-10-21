import React from 'react';
import { ArrowRight, Home, TrendingUp } from 'lucide-react';
import { Translations } from '../i18n/translations.ts';
import valuationLivingRoomImg from '../assets/images/valuation_living_room_1791898474079.jpg';

interface HomeValuationBannerProps {
  onOpenValuation: () => void;
  t: Translations['valuationBanner'];
}

export const HomeValuationBanner: React.FC<HomeValuationBannerProps> = ({
  onOpenValuation,
  t,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-[0_4px_20px_rgba(8,38,83,0.06)] grid grid-cols-1 lg:grid-cols-2">
        {/* Left Navy Column */}
        <div className="bg-[#041A38] p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          <span className="text-xs sm:text-[13px] font-medium text-slate-300">
            {t.eyebrow}
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-white tracking-tight leading-[1.2] mt-1.5">
            {t.title}
          </h2>

          <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed mt-2.5 max-w-md">
            {t.description}
          </p>

          <div className="mt-6">
            <button
              onClick={onOpenValuation}
              className="bg-white hover:bg-slate-100 text-[#082653] text-xs sm:text-[13px] font-semibold px-5 py-2.5 rounded-md transition-colors inline-flex items-center gap-2 group cursor-pointer shadow-xs"
            >
              <span>{t.button}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Right Photographic Image with Floating Valuation Card */}
        <div className="relative min-h-[260px] sm:min-h-[300px] lg:min-h-[320px] bg-slate-100 overflow-hidden">
          <img
            src={valuationLivingRoomImg}
            alt="Bright, elegant luxury penthouse living room overlooking city skyline"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85';
            }}
          />

          {/* Floating Valuation Estimate Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md rounded-xl p-3.5 sm:p-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.18)] border border-slate-100/90 flex items-center gap-3.5 min-w-[240px] sm:min-w-[270px]">
            {/* Soft Blue Circular Icon with House */}
            <div className="w-10 h-10 rounded-full bg-[#EAF3FF] flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-[#082653]" strokeWidth={2} />
            </div>

            {/* Metric Data */}
            <div className="flex-1">
              <span className="block text-[11px] font-medium text-slate-500">
                {t.cardEstimateLabel}
              </span>

              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  $875,000
                </span>
                <span className="inline-flex items-center text-[11px] font-bold text-[#26965A]">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +12.5%
                </span>
              </div>

              <span className="block text-[10px] text-slate-400 mt-0.5">
                {t.marketTrend}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
