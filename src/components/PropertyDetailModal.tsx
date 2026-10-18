import React, { useState } from 'react';
import {
  X,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Check,
  CheckCircle,
  ShieldCheck,
  Play,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Video as VideoIcon,
  Trash2,
  Award,
} from 'lucide-react';
import { Property } from '../types.ts';
import { Translations, Language } from '../i18n/translations.ts';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { formatVideoEmbedUrl } from '../utils/media.ts';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  t: Translations['modals']['propertyDetail'];
  featuredT: Translations['featured'];
  currentUserId?: string;
  onDeleteProperty?: (propertyId: string) => Promise<void> | void;
  lang?: Language;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isFavorite,
  onToggleFavorite,
  t,
  featuredT,
  currentUserId,
  onDeleteProperty,
  lang = 'fr',
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>('photos');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [tourBooked, setTourBooked] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [tourDate, setTourDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [tourType, setTourType] = useState('In-Person');

  if (!property) return null;

  const defaultFallback =
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80';
  const rawList =
    property.images && property.images.length > 0
      ? property.images
      : property.image
      ? [property.image]
      : [];
  const cleanList = rawList.filter(
    (p) => p && typeof p === 'string' && p.trim().length > 30 && p !== 'data:,'
  );
  const allPhotos: string[] = cleanList.length > 0 ? cleanList : [defaultFallback];
  const currentPhoto = allPhotos[selectedPhotoIndex] || allPhotos[0] || defaultFallback;

  const parsedVideo = property.video ? formatVideoEmbedUrl(property.video) : null;
  const hasVideo = !!parsedVideo;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  const handleBookTour = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'tour_requests', `tour-${Date.now()}`), {
        propertyId: property.id,
        propertyAddress: property.address,
        clientName,
        clientPhone,
        tourDate,
        tourType,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Error saving tour request to Firestore:', err);
    }
    setTourBooked(true);
    setTimeout(() => {
      setTourBooked(false);
    }, 5000);
  };

  const isForSale = property.status === 'FOR SALE';
  const statusLabel = isForSale ? featuredT.forSale : featuredT.forRent;
  const periodLabel = property.period ? (featuredT.forRent === 'À LOUER' ? ' /mois' : property.period) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 shadow hover:bg-white flex items-center justify-center text-slate-700 hover:text-black transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media Header (Gallery & Video Player) */}
        <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
          {activeMediaTab === 'video' && parsedVideo ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
              {parsedVideo.type === 'youtube' || parsedVideo.type === 'vimeo' ? (
                <iframe
                  src={parsedVideo.embedUrl}
                  title="Virtual Property Tour"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={parsedVideo.embedUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          ) : (
            <div className="relative w-full h-full group">
              <img
                src={currentPhoto}
                alt={property.address}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultFallback;
                }}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Prev / Next controls for gallery */}
              {allPhotos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Photo Counter */}
                  <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {selectedPhotoIndex + 1} / {allPhotos.length} {t.photoCount}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Badges on top-left */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm ${
                isForSale ? 'bg-[#082653] text-white' : 'bg-[#26965A] text-white'
              }`}
            >
              {statusLabel}
            </span>
            <span className="text-xs font-medium bg-black/50 backdrop-blur-md text-white px-2.5 py-1 rounded">
              {property.type}
            </span>
          </div>

          {/* Media Tabs Switcher (Photos vs Video) */}
          {hasVideo && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md p-1 rounded-full flex items-center gap-1 z-10 shadow-lg">
              <button
                type="button"
                onClick={() => setActiveMediaTab('photos')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeMediaTab === 'photos'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{t.photosTab} ({allPhotos.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMediaTab('video')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeMediaTab === 'video'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.videoTourTab}</span>
              </button>
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={(e) => onToggleFavorite(property.id, e)}
            className="absolute bottom-3 right-4 bg-white/90 hover:bg-white text-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow flex items-center gap-1.5 transition-colors cursor-pointer z-10"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'
              }`}
            />
            <span>{isFavorite ? t.saved : t.saveProperty}</span>
          </button>
        </div>

        {/* Thumbnail Carousel if multiple photos */}
        {allPhotos.length > 1 && activeMediaTab === 'photos' && (
          <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {allPhotos.map((thumb, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedPhotoIndex === idx
                    ? 'border-[#082653] scale-105 shadow-xs'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={thumb}
                  alt={`Thumbnail ${idx + 1}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultFallback;
                  }}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header & Pricing */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {property.address}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{property.location}</span>
                {property.country && (
                  <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EAF3FF] text-[#082653] border border-[#D5E5FA]">
                    {property.country}
                  </span>
                )}
                {property.currency && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {property.currency}
                  </span>
                )}
                {property.paymentStatus === 'PAID' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Paiement SasPay validé ({property.paymentAmount || 'Acquitté'})</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-1 text-2xl sm:text-3xl font-extrabold text-[#082653]">
              <span>{property.price}</span>
              {periodLabel && (
                <span className="text-sm font-normal text-slate-500">
                  {periodLabel}
                </span>
              )}
            </div>
          </div>

          {/* Quick Specs Bar */}
          {property.type === 'Land / Plot' || property.type === 'Terrain / Parcelle' || (property.beds === 0 && property.baths === 0) ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400">Nature du bien</span>
                <span className="text-sm font-bold text-[#082653] mt-0.5">{t.landPlot}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5" /> {t.livingArea}
                </span>
                <span className="text-sm font-bold text-slate-800 mt-0.5">{property.sqFt}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex flex-col items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Viabilisation & Accès
                </span>
                <span className="text-xs font-semibold text-slate-800 mt-1">{property.parking || 'Viabilisé & Borné'}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5" /> {t.bedrooms}
                </span>
                <span className="text-sm font-bold text-slate-800 mt-0.5">
                  {property.beds}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5" /> {t.bathrooms}
                </span>
                <span className="text-sm font-bold text-slate-800 mt-0.5">
                  {property.baths}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5" /> {t.livingArea}
                </span>
                <span className="text-sm font-bold text-slate-800 mt-0.5">
                  {property.sqFt}
                </span>
              </div>

              <div className="hidden sm:flex flex-col items-center">
                <span className="text-xs text-slate-400">{t.built}</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5">
                  {property.yearBuilt || 2023}
                </span>
              </div>
            </div>
          )}

          {/* Video Banner Callout if property has video */}
          {hasVideo && activeMediaTab !== 'video' && (
            <div
              onClick={() => setActiveMediaTab('video')}
              className="p-3.5 bg-red-50/80 hover:bg-red-50 border border-red-200/80 rounded-xl flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-red-900">
                    {t.videoTourTab}
                  </h4>
                  <p className="text-[11px] text-red-700">
                    {t.watchVideo}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-red-700 flex items-center gap-1">
                Lancer <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              {t.aboutHome}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Features Checklist */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                {t.highlights}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.features.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50/80 px-3 py-2 rounded-lg border border-slate-100"
                  >
                    <Check className="w-3.5 h-3.5 text-[#26965A] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule a Tour & Agent Section */}
          <div className="bg-[#EAF3FF] rounded-xl p-5 border border-[#D0E3FA]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#082653]">
                  {t.scheduleTour}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {t.scheduleTourDesc}
                </p>
              </div>

              {property.agent && (
                <div className="hidden sm:block text-right">
                  <span className="text-[11px] text-slate-500 block">{t.agentInCharge}</span>
                  <span className="text-xs font-bold text-[#082653] block">
                    {property.agent.name}
                  </span>
                </div>
              )}
            </div>

            {tourBooked ? (
              <div className="bg-white rounded-lg p-4 border border-emerald-200 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-slate-900">
                  {t.tourSuccessTitle}
                </h5>
                <p className="text-[11px] text-slate-500 mt-1">
                  {t.tourSuccessDesc}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookTour} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder={t.fullNamePlaceholder}
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#082653]"
                />

                <input
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#082653]"
                />

                <button
                  type="submit"
                  className="bg-[#082653] hover:bg-[#16477F] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors shadow-xs cursor-pointer"
                >
                  {t.confirmButton}
                </button>
              </form>
            )}
          </div>

          {/* Advertiser Controls Section */}
          {property && currentUserId && property.authorUid && property.authorUid === currentUserId && onDeleteProperty && (
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-2">
                    <span>{t.authorBadge}</span>
                    <span className="text-[10px] uppercase font-semibold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                      {lang === 'fr' ? 'Annonceur' : 'Author'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-amber-800/90 mt-0.5">
                    {lang === 'fr'
                      ? 'Vous avez publié cette annonce. Vous pouvez la supprimer définitivement du catalogue mondial.'
                      : 'You listed this property. You can permanently remove it from the global catalog.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.deleteListingBtn}</span>
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && property && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t.deleteListingConfirmTitle}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {t.deleteListingConfirmDesc}
              </p>
              <div className="mt-4 p-3 bg-slate-50 rounded-lg text-left text-xs border border-slate-200">
                <p className="font-semibold text-slate-800 truncate">{property.address}</p>
                <p className="text-slate-500 truncate">{property.location}</p>
                <p className="font-bold text-[#082653] mt-1">{property.price}</p>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  {t.deleteListingCancel}
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      if (onDeleteProperty) {
                        await onDeleteProperty(property.id);
                      }
                      setShowDeleteConfirm(false);
                      onClose();
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? '...' : t.deleteListingConfirm}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
