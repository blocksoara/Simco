import React from 'react';
import { Home, Users, ShieldCheck, Tag } from 'lucide-react';
import { Translations } from '../i18n/translations.ts';

interface BenefitsRowProps {
  t: Translations['benefits'];
}

export const BenefitsRow: React.FC<BenefitsRowProps> = ({ t }) => {
  const benefits = [
    {
      icon: Home,
      title: t.item1Title,
      description: t.item1Desc,
    },
    {
      icon: Users,
      title: t.item2Title,
      description: t.item2Desc,
    },
    {
      icon: ShieldCheck,
      title: t.item3Title,
      description: t.item3Desc,
    },
    {
      icon: Tag,
      title: t.item4Title,
      description: t.item4Desc,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {benefits.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-3.5">
              {/* Navy Circular Icon */}
              <div className="w-10 h-10 rounded-full bg-[#082653] flex items-center justify-center shrink-0 shadow-xs">
                <Icon className="w-4 h-4 text-white" strokeWidth={2} />
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-[13px] font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
