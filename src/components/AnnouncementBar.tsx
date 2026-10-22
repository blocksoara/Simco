import React from 'react';
import { Star, ShieldCheck, Tag, Phone, Facebook, Instagram, Linkedin, Globe } from 'lucide-react';
import { Language, Translations } from '../i18n/translations.ts';

interface AnnouncementBarProps {
  onOpenValuation: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations['announcement'];
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  onOpenValuation,
  lang,
  setLang,
  t,
}) => {
  return (
    <div className="bg-[#041A38] text-white text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#0f2e5a]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left trust markers */}
        <div className="flex items-center gap-2.5 sm:gap-6 tracking-tight overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-1.5 text-slate-200 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-300" strokeWidth={2} />
            <span className="truncate">{t.trusted}</span>
          </div>

          <div className="hidden xs:flex items-center gap-1.5 text-slate-200 shrink-0">
            <Star className="w-3.5 h-3.5 text-slate-300 fill-slate-300" strokeWidth={1.5} />
            <span>{t.rated}</span>
          </div>

          <button
            onClick={onOpenValuation}
            className="hidden sm:flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors shrink-0 text-left cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-slate-300" strokeWidth={2} />
            <span>{t.freeValuation}</span>
          </button>
        </div>

        {/* Right contact, social markers, and language switcher */}
        <div className="flex items-center gap-2 sm:gap-5 text-slate-200 shrink-0">
          <a
            href="tel:8001234567"
            className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-slate-300" strokeWidth={2} />
            <span className="font-medium">{t.phone}</span>
          </a>

          <div className="hidden md:flex items-center gap-3 pl-2 border-l border-[#1a3865]">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Language Switcher EN-FR */}
          <div className="flex items-center gap-1 pl-1.5 sm:pl-3 border-l border-[#1a3865] shrink-0">
            <Globe className="w-3.5 h-3.5 text-slate-300 mr-0.5" />
            <button
              onClick={() => setLang('fr')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer min-h-[22px] ${
                lang === 'fr'
                  ? 'bg-[#1D58A7] text-white shadow-2xs font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Passer en Français"
            >
              FR
            </button>
            <span className="text-slate-500 text-[10px]">/</span>
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer min-h-[22px] ${
                lang === 'en'
                  ? 'bg-[#1D58A7] text-white shadow-2xs font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Switch to English"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
