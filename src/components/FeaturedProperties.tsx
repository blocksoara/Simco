import React, { useState } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { Property } from '../types.ts';
import { PropertyCard } from './PropertyCard.tsx';
import { Translations } from '../i18n/translations.ts';

interface FeaturedPropertiesProps {
  properties: Property[];
  favorites: Set<string>;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectProperty: (property: Property) => void;
  onViewAll: () => void;
  onResetFilters: () => void;
  t: Translations['featured'];
  currentUserId?: string;
  onDeleteProperty?: (propertyId: string) => Promise<void> | void;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  properties,
  favorites,
  onToggleFavorite,
  onSelectProperty,
  onViewAll,
  onResetFilters,
  t,
  currentUserId,
  onDeleteProperty,
}) => {
  const [startIndex, setStartIndex] = useState(0);

  // If there are more than 4 properties, allow cycling
  const canSlideNext = properties.length > 4;
  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % properties.length);
  };
  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + properties.length) % properties.length);
  };

  // Get current 4 items window
  const visibleProperties =
    properties.length <= 4
      ? properties
      : [
          properties[startIndex % properties.length],
          properties[(startIndex + 1) % properties.length],
          properties[(startIndex + 2) % properties.length],
          properties[(startIndex + 3) % properties.length],
        ];

  return (
    <section id="featured-properties" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="block text-[11px] font-bold text-[#1D58A7] tracking-wider uppercase">
            {t.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-[26px] font-bold text-[#101827] mt-0.5 tracking-tight">
            {t.title}
          </h2>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs sm:text-[13px] font-semibold text-[#1D58A7] hover:text-[#082653] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>{t.viewAll}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Property Cards Container */}
      {visibleProperties.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-10 text-center">
          <p className="text-sm font-medium text-slate-600">
            {t.noResults}
          </p>
          <button
            onClick={onResetFilters}
            className="mt-3 text-xs font-semibold text-[#082653] underline hover:text-[#16477F] cursor-pointer"
          >
            {t.resetFilters}
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibleProperties.map((prop, idx) => (
              <PropertyCard
                key={`${prop.id}-${idx}`}
                property={prop}
                isFavorite={favorites.has(prop.id)}
                onToggleFavorite={onToggleFavorite}
                onSelectProperty={onSelectProperty}
                t={t}
                currentUserId={currentUserId}
                onDeleteProperty={onDeleteProperty}
              />
            ))}
          </div>

          {/* Carousel Next Arrow overlay on the right edge */}
          <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#082653] hover:scale-105 transition-all cursor-pointer"
              aria-label="Next property"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {canSlideNext && (
            <div className="hidden lg:block absolute -left-3.5 top-1/2 -translate-y-1/2 z-20">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#082653] hover:scale-105 transition-all cursor-pointer"
                aria-label="Previous property"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
