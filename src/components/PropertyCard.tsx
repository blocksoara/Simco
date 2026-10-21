import React, { useState } from 'react';
import { Heart, Bed, Bath, Maximize2, Play, Image as ImageIcon, Trash2, Award } from 'lucide-react';
import { Property } from '../types.ts';
import { Translations, Language, translatePropertyType } from '../i18n/translations.ts';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectProperty: (property: Property) => void;
  t: Translations['featured'];
  lang?: Language;
  currentUserId?: string;
  onDeleteProperty?: (propertyId: string) => Promise<void> | void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
  onSelectProperty,
  t,
  lang = 'fr',
  currentUserId,
  onDeleteProperty,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isForSale = property.status === 'FOR SALE' || property.status === 'À VENDRE';
  const isRent = property.status === 'FOR RENT' || property.status === 'À LOUER';
  const statusLabel = isForSale ? t.forSale : t.forRent;
  const periodLabel = isRent ? (lang === 'fr' || t.forRent === 'À LOUER' ? ' /mois' : ' /mo') : '';
  const photoCount = property.images && property.images.length > 1 ? property.images.length : 0;
  const hasVideo = !!property.video;


  // Check if current user is author of this listing
  const isAuthor = Boolean(currentUserId && property.authorUid && property.authorUid === currentUserId);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDeleteProperty) return;
    setIsDeleting(true);
    try {
      await onDeleteProperty(property.id);
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div
      onClick={() => onSelectProperty(property)}
      className="bg-white rounded-xl overflow-hidden border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(8,38,83,0.1)] transition-all duration-300 flex flex-col group cursor-pointer relative"
    >
      {/* Property Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={
            property.image && property.image !== 'data:,' && property.image.length > 20
              ? property.image
              : 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80'
          }
          alt={`${property.address}, ${property.location}`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80';
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap z-10">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs ${
              isForSale
                ? 'bg-[#082653] text-white'
                : 'bg-[#26965A] text-white'
            }`}
          >
            {statusLabel}
          </span>

          {property.paymentStatus === 'PAID' && (
            <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1">
              <span>✓ Payée SasPay</span>
            </span>
          )}

          {isAuthor && (
            <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1">
              <Award className="w-2.5 h-2.5" />
              <span>{t.authorBadge}</span>
            </span>
          )}

          {hasVideo && (
            <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1">
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>Vidéo</span>
            </span>
          )}

          {photoCount > 0 && (
            <span className="text-[10px] font-medium bg-black/60 backdrop-blur-xs text-white px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1">
              <ImageIcon className="w-2.5 h-2.5" />
              <span>{photoCount}</span>
            </span>
          )}
        </div>

        {/* Action Buttons (Delete for author & Favorite for all) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {isAuthor && onDeleteProperty && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmDelete(true);
              }}
              className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 backdrop-blur-xs flex items-center justify-center text-white transition-colors cursor-pointer shadow-sm"
              title={t.deleteListing}
              aria-label={t.deleteListing}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => onToggleFavorite(property.id, e)}
            className="w-7 h-7 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-xs flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-white hover:text-red-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Inline Delete Confirmation Overlay */}
      {showConfirmDelete && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-30 bg-white/95 backdrop-blur-xs p-4 flex flex-col items-center justify-center text-center animate-in fade-in duration-150"
        >
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2">
            <Trash2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-900 mb-1">
            {t.deleteListing}
          </p>
          <p className="text-[11px] text-slate-500 mb-3 px-2 line-clamp-2">
            {t.deleteListingConfirm}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmDelete(false);
              }}
              className="px-3 py-1.5 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium cursor-pointer transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="px-3 py-1.5 text-xs rounded bg-red-600 hover:bg-red-700 text-white font-medium shadow-xs cursor-pointer disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3 h-3" />
              <span>{isDeleting ? '...' : t.deleteListing}</span>
            </button>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-3.5 flex flex-col flex-grow">
        {/* Price & Currency */}
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold text-slate-900 tracking-tight">
            {property.price}
          </span>
          {periodLabel && (
            <span className="text-xs font-normal text-slate-500">
              {periodLabel}
            </span>
          )}
        </div>

        {/* Street Address */}
        <h4 className="text-xs font-semibold text-slate-800 mt-1 truncate">
          {property.address}
        </h4>

        {/* City, State ZIP */}
        <p className="text-[11px] text-slate-500 truncate mt-0.5">
          {property.location}
        </p>

        {/* Divider & Metadata Stats */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          {property.type === 'Land / Plot' || property.type === 'Terrain / Parcelle' || (property.beds === 0 && property.baths === 0) ? (
            <>
              <div className="flex items-center gap-1 font-semibold text-[#082653] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                <span>{t.landPlot}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-700 font-medium">
                <Maximize2 className="w-3 h-3 text-[#1D58A7]" />
                <span>{property.sqFt}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.beds} {t.beds}</span>
              </div>

              <div className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.baths} {t.baths}</span>
              </div>

              <div className="flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-slate-400" />
                <span>{property.sqFt}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
