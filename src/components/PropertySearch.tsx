import React from 'react';
import { Search, ChevronDown, Globe } from 'lucide-react';
import { SearchFilters } from '../types.ts';
import { Translations, getSortedCountries, Language } from '../i18n/translations.ts';

interface PropertySearchProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onSearch: () => void;
  onOpenValuation: () => void;
  onTabChange?: (tab: 'Buy' | 'Rent' | 'Sell') => void;
  lang: Language;
  t: Translations['search'];
}

export const PropertySearch: React.FC<PropertySearchProps> = ({
  filters,
  setFilters,
  onSearch,
  onOpenValuation,
  onTabChange,
  lang,
  t,
}) => {
  const sortedCountries = getSortedCountries(lang);

  const handleTabChange = (tab: 'Buy' | 'Rent' | 'Sell') => {
    setFilters((prev) => ({ ...prev, tab }));
    if (tab === 'Sell') {
      onOpenValuation();
    } else if (onTabChange) {
      onTabChange(tab);
    }
  };

  const getTabLabel = (tab: 'Buy' | 'Rent' | 'Sell') => {
    if (tab === 'Buy') return t.buy;
    if (tab === 'Rent') return t.rent;
    return t.sell;
  };

  return (
    <div className="relative -mt-16 sm:-mt-20 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_-5px_rgba(8,38,83,0.08)] border border-slate-100 p-3.5 sm:p-5">
        {/* Top Tabs: Buy / Rent / Sell */}
        <div className="flex items-center gap-6 border-b border-slate-100 pb-3 mb-3.5 px-1">
          {(['Buy', 'Rent', 'Sell'] as const).map((tab) => {
            const isActive = filters.tab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`text-xs sm:text-[13px] font-semibold transition-all relative pb-1 cursor-pointer ${
                  isActive
                    ? 'text-[#082653] after:content-[""] after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[2px] after:bg-[#082653]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {getTabLabel(tab)}
              </button>
            );
          })}
        </div>

        {/* Inputs row on desktop */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-0"
        >
          {/* Country Field */}
          <div className="flex-1 px-2 lg:pr-3">
            <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mb-0.5">
              <Globe className="w-3 h-3 text-[#1D58A7]" />
              <span>{t.countryLabel}</span>
            </label>
            <div className="relative">
              <select
                value={filters.country}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, country: e.target.value }))
                }
                className="w-full text-xs text-slate-800 font-medium appearance-none bg-transparent focus:outline-none pr-5 cursor-pointer truncate"
              >
                {sortedCountries.map((c) => (
                  <option key={c.value} value={c.value}>
                    {lang === 'fr' ? c.labelFr : c.labelEn}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="hidden lg:block h-9 w-px bg-slate-200" />

          {/* Location field (City, neighborhood) */}
          <div className="flex-1 px-2 lg:px-3">
            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
              {t.locationLabel}
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder={t.locationPlaceholder}
              className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>

          <div className="hidden lg:block h-9 w-px bg-slate-200" />

          {/* Property Type field */}
          <div className="flex-1 px-2 lg:px-3">
            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
              {t.propertyTypeLabel}
            </label>
            <div className="relative">
              <select
                value={filters.propertyType}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, propertyType: e.target.value }))
                }
                className="w-full text-xs text-slate-800 appearance-none bg-transparent focus:outline-none pr-5 cursor-pointer truncate"
              >
                <option value="Any Type">{t.anyType}</option>
                <option value="Single Family Home">{t.singleFamily}</option>
                <option value="Condo / Apartment">{t.condo}</option>
                <option value="Coastal Villa">{t.coastalVilla}</option>
                <option value="Luxury Villa">{t.luxuryVilla}</option>
                <option value="Land / Plot">{t.landPlot}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="hidden lg:block h-9 w-px bg-slate-200" />

          {/* Price Range field */}
          <div className="flex-1 px-2 lg:px-3">
            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
              {t.priceRangeLabel}
            </label>
            <div className="relative">
              <select
                value={filters.priceRange}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priceRange: e.target.value }))
                }
                className="w-full text-xs text-slate-800 appearance-none bg-transparent focus:outline-none pr-5 cursor-pointer truncate"
              >
                <option value="$Min - $Max">{t.minMax}</option>
                <option value="under-700k">{t.under700k}</option>
                <option value="700k-1m">{t.range700k1m}</option>
                <option value="1m-plus">{t.above1m}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="hidden lg:block h-9 w-px bg-slate-200" />

          {/* Beds field */}
          <div className="w-full lg:w-24 px-2 lg:px-3">
            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
              {t.bedsLabel}
            </label>
            <div className="relative">
              <select
                value={filters.beds}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, beds: e.target.value }))
                }
                className="w-full text-xs text-slate-800 appearance-none bg-transparent focus:outline-none pr-5 cursor-pointer"
              >
                <option value="Any">{t.any}</option>
                <option value="2">2+ {t.bedsLabel}</option>
                <option value="3">3+ {t.bedsLabel}</option>
                <option value="4">4+ {t.bedsLabel}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="hidden lg:block h-9 w-px bg-slate-200" />

          {/* Baths field */}
          <div className="w-full lg:w-24 px-2 lg:px-3">
            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
              {t.bathsLabel}
            </label>
            <div className="relative">
              <select
                value={filters.baths}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, baths: e.target.value }))
                }
                className="w-full text-xs text-slate-800 appearance-none bg-transparent focus:outline-none pr-5 cursor-pointer"
              >
                <option value="Any">{t.any}</option>
                <option value="2">2+ {t.bathsLabel}</option>
                <option value="3">3+ {t.bathsLabel}</option>
                <option value="4">4+ {t.bathsLabel}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 lg:pt-0 lg:pl-2 shrink-0">
            <button
              type="submit"
              className="w-full lg:w-auto bg-[#082653] hover:bg-[#16477F] text-white text-xs font-semibold px-4.5 py-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>{t.searchButton}</span>
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
