import React, { useState, useEffect } from 'react';
import { X, Search, Award } from 'lucide-react';
import { Property } from '../types.ts';
import { PropertyCard } from './PropertyCard.tsx';
import { Translations, Language, getSortedCountries } from '../i18n/translations.ts';

interface AllPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  favorites: Set<string>;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectProperty: (property: Property) => void;
  lang: Language;
  t: Translations['modals']['allProperties'];
  featuredT: Translations['featured'];
  searchT: Translations['search'];
  currentUserId?: string;
  currentUserEmail?: string;
  onDeleteProperty?: (propertyId: string) => Promise<void> | void;
  initialFilter?: 'all' | 'FOR SALE' | 'FOR RENT' | 'my-listings';
}

export const AllPropertiesModal: React.FC<AllPropertiesModalProps> = ({
  isOpen,
  onClose,
  properties,
  favorites,
  onToggleFavorite,
  onSelectProperty,
  lang,
  t,
  featuredT,
  searchT,
  currentUserId,
  currentUserEmail,
  onDeleteProperty,
  initialFilter = 'all',
}) => {
  const [filterType, setFilterType] = useState<'all' | 'FOR SALE' | 'FOR RENT' | 'my-listings'>(initialFilter);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync initialFilter when opened
  useEffect(() => {
    if (isOpen) {
      setFilterType(initialFilter);
    }
  }, [isOpen, initialFilter]);

  if (!isOpen) return null;

  const sortedCountries = getSortedCountries(lang);

  // Match by authorUid OR by advertiser email for seamless cross-device account syncing
  const isUserListing = (p: Property) => {
    if (currentUserId && p.authorUid === currentUserId) return true;
    if (
      currentUserEmail &&
      p.agent?.email &&
      p.agent.email.toLowerCase().trim() === currentUserEmail.toLowerCase().trim()
    ) {
      return true;
    }
    return false;
  };

  // Count user listings across devices
  const myPropertiesCount = properties.filter(isUserListing).length;

  const filtered = properties.filter((p) => {
    // My listings filter
    if (filterType === 'my-listings') {
      if (!isUserListing(p)) return false;
    } else if (filterType !== 'all' && p.status !== filterType) {
      return false;
    }

    // Country Filter
    if (selectedCountry !== 'all') {
      const matchCountry =
        p.country.toLowerCase() === selectedCountry.toLowerCase() ||
        (selectedCountry === 'France' && (p.location.includes('France') || p.country === 'France')) ||
        (selectedCountry === 'États-Unis' && (p.location.includes('United States') || p.country === 'United States' || p.country === 'États-Unis')) ||
        (selectedCountry === 'United States' && (p.country === 'United States' || p.country === 'États-Unis'));
      if (!matchCountry) return false;
    }

    // Property Type Filter
    if (selectedPropertyType !== 'all') {
      if (selectedPropertyType === 'Land / Plot') {
        const isLand =
          p.type === 'Land / Plot' ||
          p.type === 'Terrain / Parcelle' ||
          p.type.toLowerCase().includes('terrain') ||
          p.type.toLowerCase().includes('parcelle') ||
          p.type.toLowerCase().includes('land') ||
          p.type.toLowerCase().includes('plot');
        if (!isLand) return false;
      } else if (p.type !== selectedPropertyType) {
        return false;
      }
    }

    // Keyword Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        p.address.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-[11px] font-bold text-[#1D58A7] tracking-wider uppercase">
            {t.eyebrow}
          </span>
          <h2 className="text-2xl font-bold text-[#082653] mt-1">
            {filterType === 'my-listings'
              ? (lang === 'fr' ? 'Mes annonces publiées' : 'My Published Listings')
              : t.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {filterType === 'my-listings'
              ? (lang === 'fr'
                  ? `Vous avez ${myPropertiesCount} annonce(s) active(s) sur le réseau Homeluxe.`
                  : `You have ${myPropertiesCount} active listing(s) on Homeluxe.`)
              : `${filtered.length} ${lang === 'fr' ? 'propriétés disponibles' : 'properties available'}`}
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                filterType === 'all'
                  ? 'bg-[#082653] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {t.allTab} ({properties.length})
            </button>
            <button
              onClick={() => setFilterType('FOR SALE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                filterType === 'FOR SALE'
                  ? 'bg-[#082653] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {t.forSaleTab}
            </button>
            <button
              onClick={() => setFilterType('FOR RENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                filterType === 'FOR RENT'
                  ? 'bg-[#26965A] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {t.forRentTab}
            </button>

            {currentUserId && (
              <button
                onClick={() => setFilterType('my-listings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  filterType === 'my-listings'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/70'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{featuredT.myListingsTab}</span>
                <span className="text-[10px] bg-amber-600/20 px-1.5 py-0.2 rounded-full">
                  {myPropertiesCount}
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Country Dropdown with all countries in alphabetical order */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="flex-1 sm:flex-initial px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#082653] cursor-pointer max-w-xs"
            >
              {sortedCountries.map((c) => (
                <option key={c.value} value={c.value}>
                  {lang === 'fr' ? c.labelFr : c.labelEn}
                </option>
              ))}
            </select>

            {/* Property Type Dropdown including Terrain / Parcelle */}
            <select
              value={selectedPropertyType}
              onChange={(e) => setSelectedPropertyType(e.target.value)}
              className="flex-1 sm:flex-initial px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#082653] cursor-pointer"
            >
              <option value="all">{t.allTypes}</option>
              <option value="Single Family Home">{searchT.singleFamily}</option>
              <option value="Condo / Apartment">{searchT.condo}</option>
              <option value="Coastal Villa">{searchT.coastalVilla}</option>
              <option value="Luxury Villa">{searchT.luxuryVilla}</option>
              <option value="Land / Plot">{searchT.landPlot}</option>
            </select>

            {/* Search Input */}
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#082653]"
              />
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
            {filterType === 'my-listings' ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                  <Award className="w-5 h-5" />
                </div>
                <p className="font-semibold text-slate-800 text-sm">
                  {lang === 'fr' ? 'Aucune annonce publiée pour le moment' : 'No listings published yet'}
                </p>
                <p className="text-slate-500 text-xs mt-1 max-w-sm">
                  {lang === 'fr'
                    ? 'Vous n’avez pas encore d’annonce active. Cliquez sur « Publier » pour ajouter votre bien à la vente ou à la location.'
                    : 'You do not have any active listings yet. Click "List Property" to publish your home or land.'}
                </p>
              </div>
            ) : (
              t.emptyState
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((prop, idx) => (
              <PropertyCard
                key={`${prop.id}-${idx}`}
                property={prop}
                isFavorite={favorites.has(prop.id)}
                onToggleFavorite={onToggleFavorite}
                onSelectProperty={(p) => {
                  onSelectProperty(p);
                }}
                t={featuredT}
                lang={lang}
                currentUserId={currentUserId}
                onDeleteProperty={onDeleteProperty}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
