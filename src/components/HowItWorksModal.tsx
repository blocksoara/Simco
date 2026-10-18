import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Translations } from '../i18n/translations.ts';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplore: () => void;
  t: Translations['modals']['howItWorks'];
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onExplore,
  t,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <span className="text-[11px] font-bold text-[#1D58A7] tracking-wider uppercase">
          {t.eyebrow}
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
          {t.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {t.subtitle}
        </p>

        {/* 3 Step Process */}
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-[#082653] text-white flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {t.step1Title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-[#082653] text-white flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {t.step2Title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-[#082653] text-white flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {t.step3Title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">{t.ready}</span>
          <button
            onClick={() => {
              onClose();
              onExplore();
            }}
            className="bg-[#082653] hover:bg-[#16477F] text-white text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{t.exploreBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
