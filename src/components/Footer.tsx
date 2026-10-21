import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Globe } from 'lucide-react';
import { Language, Translations } from '../i18n/translations.ts';

interface FooterProps {
  onNavigate: (section: string) => void;
  onOpenValuation: () => void;
  lang: Language;
  setLang?: (lang: Language) => void;
  t: Translations['footer'];
  onTriggerAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenValuation,
  lang,
  setLang,
  t,
  onTriggerAdmin,
}) => {
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDiscreetClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      onTriggerAdmin?.();
    }
  };
  return (
    <footer className="bg-[#041A38] text-white pt-14 pb-8 border-t border-[#0b264e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 pb-12">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-1.5 flex flex-col items-start">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded border-2 border-white flex items-center justify-center p-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M3 10.5L12 3l9 7.5v9.5a1 1 0 0 1-1 1h-5v-6h-4v6H4a1 1 0 0 1-1-1v-9.5z" />
                  <path d="M9 10h6" />
                  <path d="M12 10v4" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="font-extrabold text-white text-[16px] tracking-tight leading-none">
                  HOMELUXE
                </span>
                <span className="text-[8.5px] font-semibold text-slate-300 tracking-[0.25em] leading-tight uppercase mt-0.5">
                  {lang === 'fr' ? 'IMMOBILIER' : 'REAL ESTATE'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300/80 leading-relaxed mt-4 max-w-xs">
              {t.description}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0a274e] hover:bg-[#16477F] flex items-center justify-center text-slate-200 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0a274e] hover:bg-[#16477F] flex items-center justify-center text-slate-200 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0a274e] hover:bg-[#16477F] flex items-center justify-center text-slate-200 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0a274e] hover:bg-[#16477F] flex items-center justify-center text-slate-200 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3.5 tracking-tight">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {['Home', 'Buy', 'Rent', 'Sell', 'Listings'].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => {
                      if (link === 'Sell') {
                        onOpenValuation();
                      } else {
                        onNavigate(link);
                      }
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {link === 'Home'
                      ? lang === 'fr'
                        ? 'Accueil'
                        : 'Home'
                      : link === 'Buy'
                      ? lang === 'fr'
                        ? 'Acheter'
                        : 'Buy'
                      : link === 'Rent'
                      ? lang === 'fr'
                        ? 'Louer'
                        : 'Rent'
                      : link === 'Sell'
                      ? lang === 'fr'
                        ? 'Vendre'
                        : 'Sell'
                      : lang === 'fr'
                      ? 'Annonces'
                      : 'Listings'}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3.5 tracking-tight">
              {t.company}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('About Us')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {lang === 'fr' ? 'À Propos' : 'About Us'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('Our Agents')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.ourAgents}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('Careers')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.careers}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('Blog')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('Contact Us')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.contactUs}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3.5 tracking-tight">
              {t.resources}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onOpenValuation()}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.homeValuation}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('Buyers Guide')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.buyersGuide}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('Sellers Guide')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.sellersGuide}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('FAQ')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.faq}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('Mortgage Calculator')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.mortgageCalc}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div id="footer-contact">
            <h4 className="text-sm font-bold text-white mb-3.5 tracking-tight">
              {t.contactUs}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <a
                href="tel:8001234567"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>(800) 123-4567</span>
              </a>

              <a
                href="mailto:info@homeluxe.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>info@homeluxe.com</span>
              </a>

              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  123 Real Estate Blvd, Suite 100, Los Angeles, CA 90001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-6 border-t border-[#0d2a53] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div
            onClick={handleDiscreetClick}
            className="cursor-default select-none transition-opacity active:opacity-75"
            title=""
          >
            {t.rights}
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('Privacy Policy')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              {t.privacy}
            </button>
            <button
              onClick={() => onNavigate('Terms of Service')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              {t.terms}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
