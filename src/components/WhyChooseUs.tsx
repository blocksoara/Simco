import React from 'react';
import { MapPin, UserCheck, Award, Headphones } from 'lucide-react';
import { Translations } from '../i18n/translations.ts';

interface WhyChooseUsProps {
  t: Translations['whyChooseUs'];
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ t }) => {
  const reasons = [
    {
      icon: MapPin,
      title: t.item1Title,
      description: t.item1Desc,
    },
    {
      icon: UserCheck,
      title: t.item2Title,
      description: t.item2Desc,
    },
    {
      icon: Award,
      title: t.item3Title,
      description: t.item3Desc,
    },
    {
      icon: Headphones,
      title: t.item4Title,
      description: t.item4Desc,
    },
  ];

  return (
    <section id="why-choose-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <span className="block text-[11px] font-bold text-[#1D58A7] tracking-wider uppercase">
          {t.eyebrow}
        </span>
        <h2 className="text-2xl sm:text-[26px] font-bold text-[#101827] mt-0.5 tracking-tight">
          {t.title}
        </h2>
      </div>

      {/* 4 Reasons Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8">
        {reasons.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex flex-col items-start">
              {/* Pale Blue Circular Icon */}
              <div className="w-11 h-11 rounded-full bg-[#EAF3FF] flex items-center justify-center text-[#1D58A7] mb-3.5">
                <Icon className="w-5 h-5" strokeWidth={1.8} />
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
