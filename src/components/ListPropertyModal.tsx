import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle,
  Building2,
  Globe,
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
  Upload,
  Plus,
  Play,
  Star,
  Coins,
  CreditCard,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Info,
  Home,
  Palmtree,
  Crown,
  Map,
  Sparkles,
} from 'lucide-react';
import { Property } from '../types.ts';
import { Translations, getAllCountriesList, Language } from '../i18n/translations.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import {
  CURRENCIES,
  getDefaultCurrencyForCountry,
  formatPriceWithCurrency,
  getCurrency,
} from '../data/currencies.ts';
import { compressImage, formatVideoEmbedUrl } from '../utils/media.ts';
import {
  LISTING_FEE_TIERS,
  getListingPublicationFee,
  convertXafToCurrency,
} from '../data/listingFees.ts';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty?: (newProp: Property) => void;
  lang: Language;
  t: Translations['modals']['listProperty'];
}

type ModalStep = 'details' | 'payment' | 'checkout' | 'success';

export const ListPropertyModal: React.FC<ListPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
  lang,
  t,
}) => {
  const { user } = useAuth();

  // Wizard step
  const [step, setStep] = useState<ModalStep>('details');

  // Form states
  const [country, setCountry] = useState('France');
  const [currency, setCurrency] = useState('EUR');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [listingType, setListingType] = useState<'FOR SALE' | 'FOR RENT'>('FOR SALE');
  const [targetPrice, setTargetPrice] = useState('');
  const [propertyType, setPropertyType] = useState('Single Family Home');
  const [beds, setBeds] = useState('3');
  const [baths, setBaths] = useState('2');
  const [sqft, setSqft] = useState('2200');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Media
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // SasPay Payment States
  const [showPricingTable, setShowPricingTable] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [checkoutSession, setCheckoutSession] = useState<{
    id: string;
    checkout_url: string;
    slug?: string;
    amount?: string;
    currency?: string;
  } | null>(null);
  const [isCheckingPaymentStatus, setIsCheckingPaymentStatus] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [completedProperty, setCompletedProperty] = useState<Property | null>(null);

  const filePhotoInputRef = useRef<HTMLInputElement>(null);
  const fileVideoInputRef = useRef<HTMLInputElement>(null);
  const statusPollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      if (user.displayName && !name) setName(user.displayName);
      if (user.email && !email) setEmail(user.email);
    }
  }, [user, isOpen]);

  // Clean up polling timer on unmount
  useEffect(() => {
    return () => {
      if (statusPollTimerRef.current) {
        clearInterval(statusPollTimerRef.current);
      }
    };
  }, []);

  // When country changes, automatically adapt default currency
  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry);
    const suggestedCurrency = getDefaultCurrencyForCountry(selectedCountry);
    setCurrency(suggestedCurrency);
  };

  if (!isOpen) return null;

  const sortedCountries = getAllCountriesList(lang);
  const isLand = propertyType === 'Land / Plot' || propertyType === 'Terrain / Parcelle';
  const currentCurrency = getCurrency(currency);
  const currentFee = getListingPublicationFee(propertyType, currency);

  // Process selected or dropped photo files
  const processPhotoFiles = async (fileList: FileList | File[]) => {
    if (!fileList || fileList.length === 0) return;

    setIsUploadingPhoto(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const isImage =
          file.type.startsWith('image/') ||
          /\.(jpe?g|png|webp|gif|bmp|heic|heif|avif)$/i.test(file.name);
        if (isImage) {
          const compressed = await compressImage(file, 1400, 1050, 0.8);
          if (compressed && (compressed.startsWith('data:image/') || compressed.startsWith('http')) && compressed.length > 50) {
            newImages.push(compressed);
          }
        }
      }
      if (newImages.length > 0) {
        setPhotos((prev) => [...prev, ...newImages]);
      }
    } catch (err) {
      console.warn('Image processing failed:', err);
    } finally {
      setIsUploadingPhoto(false);
      if (filePhotoInputRef.current) {
        filePhotoInputRef.current.value = '';
      }
    }
  };

  const handlePhotoFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await processPhotoFiles(e.target.files);
    }
  };

  const handlePhotoDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingPhoto(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processPhotoFiles(e.dataTransfer.files);
    }
  };


  // Add photo via direct URL
  const handleAddPhotoUrl = () => {
    if (photoUrlInput.trim()) {
      setPhotos((prev) => [...prev, photoUrlInput.trim()]);
      setPhotoUrlInput('');
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimaryCover = (indexToCover: number) => {
    setPhotos((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(indexToCover, 1);
      return [item, ...copy];
    });
  };

  // Handle video upload (compressed data or object URL)
  const handleVideoFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    try {
      const videoObjectUrl = URL.createObjectURL(file);
      setVideoUrl(videoObjectUrl);
    } catch (err) {
      console.warn('Video load error:', err);
    } finally {
      setIsUploadingVideo(false);
      if (fileVideoInputRef.current) {
        fileVideoInputRef.current.value = '';
      }
    }
  };

  // Build target Property object
  const buildPropertyObject = (paymentRef?: string): Property => {
    const numericPrice = parseInt(targetPrice.replace(/[^0-9]/g, ''), 10) || 500000;
    const formattedPrice = formatPriceWithCurrency(numericPrice, currency);

    const savedType = isLand
      ? lang === 'fr'
        ? 'Terrain / Parcelle'
        : 'Land / Plot'
      : propertyType;

    const validPhotos = photos.filter(
      (p) => p && typeof p === 'string' && p.trim().length > 30 && p !== 'data:,'
    );

    const primaryImage =
      validPhotos.length > 0
        ? validPhotos[0]
        : isLand
        ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80'
        : propertyType === 'Coastal Villa'
        ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80'
        : 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80';

    return {
      id: `user-prop-${Date.now()}`,
      status: listingType,
      price: formattedPrice,
      rawPrice: numericPrice,
      currency: currency,
      currencySymbol: currentCurrency.symbol,
      period: listingType === 'FOR RENT' ? (lang === 'fr' ? '/mois' : '/mo') : '',
      address: address.trim(),
      location: `${city.trim() || address.trim()}, ${country.trim()}`,
      city: city.trim() || address.split(',')[0] || 'International City',
      state: '',
      zip: '',
      country: country.trim(),
      beds: isLand ? 0 : parseInt(beds, 10) || 3,
      baths: isLand ? 0 : parseInt(baths, 10) || 2,
      sqFt: `${sqft} ${isLand ? (lang === 'fr' ? 'm² (Superficie)' : 'Sq Ft (Lot)') : 'Sq Ft'}`,
      image: primaryImage,
      images: validPhotos.length > 0 ? validPhotos : [primaryImage],
      video: videoUrl.trim() || '',
      type: savedType,
      description: isLand
        ? lang === 'fr'
          ? `Superbe terrain / parcelle d'exception situé à ${city || address} (${country}). Opportunité rare pour développement résidentiel ou commercial.`
          : `Exceptional prime land / buildable plot located in ${city || address} (${country}). Outstanding residential or commercial development potential.`
        : lang === 'fr'
        ? `Propriété d'exception récemment publiée dans un cadre privilégié (${country}). Finitions haut de gamme, prestations luxueuses et luminosité remarquable.`
        : `Exceptional luxury residence newly listed in a prime area (${country}). High-end architectural craftsmanship and finishes.`,
      yearBuilt: new Date().getFullYear(),
      parking: isLand ? (lang === 'fr' ? 'Accès viabilisé' : 'Access Road') : 'Garage privé',
      features: isLand
        ? lang === 'fr'
          ? ['Terrain viabilisé', 'Permis constructible possible', 'Situation géographique de prestige']
          : ['Utilities Available', 'Zoned Residential', 'Prime Location']
        : ['Architecture moderne', 'Haute performance énergétique', 'Finitions de prestige'],
      authorUid: user?.uid || 'advertiser',
      createdAt: new Date().toISOString(),
      paymentStatus: 'PAID',
      paymentReference: paymentRef || `saspay-sim-${Date.now()}`,
      paymentAmount: currentFee.formatted,
      paidAt: new Date().toISOString(),
      agent: {
        name: name.trim() || user?.displayName || 'Annonceur Homeluxe',
        phone: phone.trim() || '(800) 123-4567',
        email: email.trim() || user?.email || 'concierge@homeluxe.com',
      },
    };
  };

  // Step 1 Submit: validate form and move to payment step
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !city.trim() || !targetPrice.trim() || !name.trim() || !email.trim()) {
      return;
    }
    setStep('payment');
  };

  // Step 2 Action: Create checkout session on SasPay REST API
  const handleInitiateSasPay = async () => {
    setIsCreatingCheckout(true);
    setPaymentError(null);

    const executeCheckoutRequest = async () => {
      const advertiserEmail = email.trim() || user?.email || 'contact@homeluxe.com';
      const advertiserName = name.trim() || user?.displayName || 'Annonceur Homeluxe';
      const advertiserPhone = phone.trim() || '';

      const response = await fetch('/api/saspay/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          amount: currentFee.saspayAmountString,
          currency: currentFee.currency,
          description: `Publication annonce Homeluxe - ${currentFee.tier.nameFr}`,
          country: country,
          customer_email: advertiserEmail,
          customer_name: advertiserName,
          customer_phone: advertiserPhone,
          metadata: {
            propertyType,
            address: address.trim(),
            city: city.trim(),
            userUid: user?.uid || 'guest',
            baseFeeXaf: currentFee.amountXaf,
          },
        }),
      });

      const text = await response.text();
      let resData: any = null;
      try {
        resData = JSON.parse(text);
      } catch (_) {
        resData = null;
      }

      if (!response.ok || !resData || !resData.success) {
        let errMessage = 'Erreur lors de la création de la session SasPay';
        if (resData && typeof resData.error === 'string' && resData.error.trim()) {
          errMessage = resData.error;
        } else if (resData && typeof resData.message === 'string' && resData.message.trim()) {
          errMessage = resData.message;
        } else if (resData?.error && typeof resData.error === 'object') {
          const parts = Object.entries(resData.error).map(([k, v]) => {
            const valStr = Array.isArray(v) ? v.join(', ') : String(v);
            return `${k}: ${valStr}`;
          });
          if (parts.length > 0) errMessage = parts.join(' | ');
        } else if (response.status === 502 || response.status === 504) {
          errMessage = 'La passerelle SasPay est momentanément indisponible (502). Veuillez réessayer.';
        }
        throw new Error(errMessage);
      }

      const session = resData.data;
      if (!session || !session.checkout_url) {
        throw new Error('SasPay n\'a pas retourné de session de paiement valide.');
      }

      return session;
    };

    try {
      let session: any = null;
      try {
        session = await executeCheckoutRequest();
      } catch (firstErr: any) {
        // If network hiccup or temporary 502, automatically retry once
        const msg = String(firstErr?.message || '');
        if (msg.includes('fetch') || msg.includes('502') || msg.includes('indisponible')) {
          await new Promise((r) => setTimeout(r, 1200));
          session = await executeCheckoutRequest();
        } else {
          throw firstErr;
        }
      }

      setCheckoutSession(session);
      setStep('checkout');

      // Start automatic polling for status
      startPollingPaymentStatus(session.id);
    } catch (err: any) {
      console.error('SasPay Checkout creation error:', err);
      let friendlyMessage =
        'Impossible d’initialiser le paiement SasPay. Veuillez vérifier vos informations ou réessayer.';

      const rawMsg = String(err?.message || '');
      if (rawMsg.toLowerCase().includes('failed to fetch') || rawMsg.toLowerCase().includes('network')) {
        friendlyMessage =
          'Connexion au serveur de paiement interrompue. Veuillez vérifier votre accès Internet et cliquer sur "Réessayer".';
      } else if (rawMsg.trim() && !rawMsg.includes('[object Object]')) {
        friendlyMessage = rawMsg;
      }

      setPaymentError(friendlyMessage);
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  // Check payment status on SasPay
  const checkPaymentStatus = async (sessionId: string) => {
    setIsCheckingPaymentStatus(true);
    try {
      const res = await fetch(`/api/saspay/check-status/${sessionId}`);
      const data = await res.json();

      if (data.success && (data.data?.status === 'PAID' || data.data?.status === 'SUCCESS')) {
        await handlePaymentCompleted(sessionId);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('SasPay status poll exception:', err);
      return false;
    } finally {
      setIsCheckingPaymentStatus(false);
    }
  };

  // Periodic polling
  const startPollingPaymentStatus = (sessionId: string) => {
    if (statusPollTimerRef.current) clearInterval(statusPollTimerRef.current);

    statusPollTimerRef.current = setInterval(async () => {
      const isPaid = await checkPaymentStatus(sessionId);
      if (isPaid && statusPollTimerRef.current) {
        clearInterval(statusPollTimerRef.current);
      }
    }, 3500);
  };

  // Complete payment and persist listing to Firestore
  const handlePaymentCompleted = async (paymentRef: string) => {
    if (statusPollTimerRef.current) {
      clearInterval(statusPollTimerRef.current);
    }

    const newProp = buildPropertyObject(paymentRef);

    // Persist to Firestore
    try {
      await setDoc(doc(db, 'properties', newProp.id), newProp);
    } catch (err) {
      console.warn('Firestore property save error:', err);
    }

    if (onAddProperty) {
      onAddProperty(newProp);
    }

    setCompletedProperty(newProp);
    setStep('success');
  };

  // Simulate test payment for developer/tester demo
  const handleSimulatePayment = async () => {
    await handlePaymentCompleted(`saspay-test-${Date.now()}`);
  };

  const handleReset = () => {
    if (statusPollTimerRef.current) {
      clearInterval(statusPollTimerRef.current);
    }
    setStep('details');
    setPhotos([]);
    setVideoUrl('');
    setPhotoUrlInput('');
    setCheckoutSession(null);
    setCompletedProperty(null);
    setPaymentError(null);
    onClose();
  };

  const parsedVideo = videoUrl ? formatVideoEmbedUrl(videoUrl) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#082653] flex items-center justify-center text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {step === 'details'
                ? t.title
                : step === 'payment'
                ? 'Tarif & Paiement SasPay'
                : step === 'checkout'
                ? 'Règlement Sécurisé SasPay'
                : 'Publication Confirmée'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 'details'
                ? t.subtitle
                : step === 'payment'
                ? 'Confirmez les frais de publication pour activer votre annonce sur le réseau Homeluxe.'
                : step === 'checkout'
                ? 'Paiement en cours via Mobile Money ou Carte Bancaire.'
                : 'Votre bien est en ligne et accessible mondialement.'}
            </p>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* STEP 4: SUCCESS RECEIPT */}
        {/* -------------------------------------------------------- */}
        {step === 'success' && (
          <div className="py-6 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Paiement SasPay Validé • Statut Actif
              </span>
              <h4 className="text-xl font-bold text-slate-900 pt-1">
                Annonce publiée avec succès !
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Votre bien a été enregistré dans le catalogue international Homeluxe. Les acheteurs et locataires peuvent dès maintenant consulter votre annonce et vous contacter.
              </p>
            </div>

            {/* Receipt Summary Card */}
            {completedProperty && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Bien :</span>
                  <span className="font-semibold text-slate-900">{completedProperty.address}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Type de bien :</span>
                  <span className="font-semibold text-slate-900">{completedProperty.type}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Prix affiché :</span>
                  <span className="font-bold text-[#082653]">{completedProperty.price}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Frais acquittés :</span>
                  <span className="font-bold text-emerald-600">{completedProperty.paymentAmount}</span>
                </div>
                <div className="flex justify-between pt-1 text-[11px] text-slate-400">
                  <span>Réf. transaction :</span>
                  <span className="font-mono">{completedProperty.paymentReference?.slice(0, 18)}...</span>
                </div>
              </div>
            )}

            <button
              onClick={handleReset}
              className="mt-4 px-8 py-3 bg-[#082653] hover:bg-[#16477F] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md"
            >
              Voir mon annonce dans le catalogue
            </button>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* STEP 2: PAYMENT OVERVIEW & TARIFF VERIFICATION */}
        {/* -------------------------------------------------------- */}
        {step === 'payment' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Property Summary Pill */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#082653] flex items-center justify-center shrink-0">
                  {propertyType === 'Single Family Home' && <Home className="w-5 h-5" />}
                  {propertyType === 'Condo / Apartment' && <Building2 className="w-5 h-5" />}
                  {propertyType === 'Coastal Villa' && <Palmtree className="w-5 h-5" />}
                  {propertyType === 'Luxury Villa' && <Crown className="w-5 h-5" />}
                  {isLand && <Map className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{address || 'Nouvelle Propriété'}</h4>
                  <p className="text-xs text-slate-500">
                    {city}, {country} • Type : <strong className="text-slate-700">{currentFee.tier.nameFr}</strong>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Prix affiché</span>
                <span className="text-xs font-bold text-[#082653]">
                  {formatPriceWithCurrency(parseInt(targetPrice.replace(/[^0-9]/g, '') || '0', 10), currency)}
                </span>
              </div>
            </div>

            {/* Official Fee Box */}
            <div className="bg-gradient-to-br from-[#041a38] to-[#0a2e5c] text-white p-5 rounded-2xl shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Frais de publication pour annonceur
                  </span>
                  <h4 className="text-2xl font-black tracking-tight text-white mt-1">
                    {currentFee.formatted}
                  </h4>
                  {currentCurrency.code !== 'XAF' && (
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      Tarif de base officiel : <strong>{currentFee.amountXaf.toLocaleString('fr-FR')} XAF</strong>
                    </p>
                  )}
                </div>

                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-right">
                  <span className="text-[10px] text-slate-300 uppercase block">Passerelle</span>
                  <span className="text-xs font-extrabold text-amber-300">SasPay</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed relative z-10 border-t border-white/10 pt-2.5">
                {currentFee.tier.descriptionFr}
              </p>

              {/* Supported payment methods badges */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2 text-[11px] text-slate-200">
                <span className="font-semibold text-amber-300">Moyens acceptés :</span>
                <span className="bg-white/15 px-2 py-0.5 rounded font-medium">MTN MoMo</span>
                <span className="bg-white/15 px-2 py-0.5 rounded font-medium">Orange Money</span>
                <span className="bg-white/15 px-2 py-0.5 rounded font-medium">Moov Money</span>
                <span className="bg-white/15 px-2 py-0.5 rounded font-medium">Wave</span>
                <span className="bg-white/15 px-2 py-0.5 rounded font-medium">Airtel Money</span>
                <span className="bg-white/15 px-2 py-0.5 rounded font-medium">Carte Visa / Mastercard</span>
              </div>
            </div>

            {/* Error Message if any */}
            {paymentError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2 min-w-0">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span className="leading-relaxed">{paymentError}</span>
                </div>
                <button
                  type="button"
                  onClick={handleInitiateSasPay}
                  disabled={isCreatingCheckout}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shrink-0 cursor-pointer text-[11px] transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}

            {/* Actions: Proceed with SasPay OR Demo */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleInitiateSasPay}
                disabled={isCreatingCheckout}
                className="w-full bg-[#082653] hover:bg-[#16477F] text-white text-xs font-bold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isCreatingCheckout ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Génération du lien de paiement SasPay...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Payer avec SasPay ({currentFee.formatted})</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Modifier les informations</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="text-amber-700 hover:text-amber-900 font-medium underline cursor-pointer text-[11px]"
                  title="Valider sans débit réel pour tester"
                >
                  Mode Démo / Test instantané
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* STEP 3: LIVE CHECKOUT PAGE & POLLING */}
        {/* -------------------------------------------------------- */}
        {step === 'checkout' && checkoutSession && (
          <div className="space-y-5 animate-in fade-in text-center py-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#082653] flex items-center justify-center mx-auto border border-blue-100">
              <RefreshCw className="w-7 h-7 animate-spin text-[#082653]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">
                Paiement en attente de validation
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Veuillez finaliser votre paiement sur la page sécurisée SasPay (Mobile Money ou Carte Bancaire). Dès validation, votre annonce sera mise en ligne automatiquement.
              </p>
            </div>

            {/* SasPay Checkout Direct Link */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 max-w-md mx-auto">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Montant à régler :</span>
                <span className="font-extrabold text-[#082653] text-sm">{currentFee.formatted}</span>
              </div>

              <a
                href={checkoutSession.checkout_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Ouvrir la page de paiement SasPay</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-[11px] text-slate-500 italic">
                Une fois votre paiement effectué sur SasPay, nous détectons automatiquement la confirmation.
              </p>
            </div>

            {/* Manual check and Demo completion */}
            <div className="space-y-2 pt-2 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => checkPaymentStatus(checkoutSession.id)}
                disabled={isCheckingPaymentStatus}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isCheckingPaymentStatus ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Vérification auprès de SasPay...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>J’ai terminé mon paiement / Vérifier le statut</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSimulatePayment}
                className="w-full py-2 text-xs font-semibold text-amber-700 hover:text-amber-900 cursor-pointer"
              >
                Simuler le succès du paiement (Mode Test / Démo)
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* STEP 1: PROPERTY DETAILS FORM */}
        {/* -------------------------------------------------------- */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="space-y-4">
            {/* Listing Type: Vente / Location */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setListingType('FOR SALE')}
                className={`py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  listingType === 'FOR SALE'
                    ? 'bg-[#082653] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.forSaleTab}
              </button>
              <button
                type="button"
                onClick={() => setListingType('FOR RENT')}
                className={`py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  listingType === 'FOR RENT'
                    ? 'bg-[#082653] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.forRentTab}
              </button>
            </div>

            {/* Country Selector */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                <Globe className="w-3.5 h-3.5 text-[#1D58A7]" />
                <span>{t.countryLabel}</span>
              </label>
              <select
                required
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#082653]"
              >
                {sortedCountries.map((c) => (
                  <option key={c.value} value={c.value}>
                    {lang === 'fr' ? c.labelFr : c.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* City & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'fr' ? 'Ville' : 'City'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Abidjan, Douala, Paris, New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#082653]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.addressLabel} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.addressPlaceholder}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#082653]"
                />
              </div>
            </div>

            {/* Currency & Price Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mb-1">
                  <Coins className="w-3.5 h-3.5 text-[#1D58A7]" />
                  <span>{t.currencyLabel}</span>
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#082653]"
                >
                  {CURRENCIES.map((cur) => (
                    <option key={cur.code} value={cur.code}>
                      {lang === 'fr' ? cur.labelFr : cur.labelEn}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {lang === 'fr'
                    ? `Symbole : ${currentCurrency.symbol} (${currentCurrency.code})`
                    : `Symbol: ${currentCurrency.symbol} (${currentCurrency.code})`}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {t.priceLabel} ({currentCurrency.symbol}) *
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    {currentCurrency.symbol}
                  </span>
                  <input
                    type="text"
                    required
                    placeholder={
                      currentCurrency.code === 'XOF' || currentCurrency.code === 'XAF'
                        ? '150 000 000'
                        : listingType === 'FOR SALE'
                        ? '850,000'
                        : '3,500'
                    }
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full pl-12 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#082653]"
                  />
                </div>
                {targetPrice && (
                  <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
                    {lang === 'fr' ? 'Affichage :' : 'Preview:'}{' '}
                    {formatPriceWithCurrency(parseInt(targetPrice.replace(/[^0-9]/g, '') || '0', 10), currency)}
                    {listingType === 'FOR RENT' ? (lang === 'fr' ? ' /mois' : ' /mo') : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Property Type with Fee notice */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  {t.typeLabel} *
                </label>
                <span className="text-[11px] font-bold text-[#082653] flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Frais de publication : {currentFee.formatted}</span>
                </span>
              </div>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#082653]"
              >
                <option value="Single Family Home">
                  {lang === 'fr' ? 'Maison individuelle (500 XAF)' : 'Single Family Home (500 XAF)'}
                </option>
                <option value="Condo / Apartment">
                  {lang === 'fr' ? 'Appartement / Combo (1 000 XAF)' : 'Condo / Apartment (1,000 XAF)'}
                </option>
                <option value="Coastal Villa">
                  {lang === 'fr' ? 'Villa côtière (1 500 XAF)' : 'Coastal Villa (1,500 XAF)'}
                </option>
                <option value="Luxury Villa">
                  {lang === 'fr' ? 'Villa de prestige (2 000 XAF)' : 'Luxury Villa (2,000 XAF)'}
                </option>
                <option value="Land / Plot">
                  {lang === 'fr' ? 'Terrain / Parcelle (3 000 XAF)' : 'Land / Plot (3,000 XAF)'}
                </option>
              </select>
            </div>

            {/* Dynamic Interactive Fee Banner */}
            <div className="p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#082653] text-amber-300 flex items-center justify-center font-bold text-xs">
                    ⚡
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Frais de publication : <span className="text-[#082653] font-black">{currentFee.formatted}</span>
                      {currentCurrency.code !== 'XAF' && (
                        <span className="text-slate-500 font-normal text-[10px]"> ({currentFee.amountXaf} XAF)</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Paiement sécurisé par <strong>SasPay</strong> • Mobile Money & Cartes bancaires
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPricingTable(!showPricingTable)}
                  className="text-[11px] font-semibold text-[#1D58A7] hover:underline cursor-pointer"
                >
                  {showPricingTable ? 'Masquer la grille' : 'Voir tous les tarifs'}
                </button>
              </div>

              {/* Collapsible Tariff Grid */}
              {showPricingTable && (
                <div className="pt-2 border-t border-blue-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] animate-in fade-in">
                  {Object.values(LISTING_FEE_TIERS).map((tier) => {
                    const tierFee = convertXafToCurrency(tier.amountXaf, currency);
                    const isSelected = tier.id === propertyType;
                    return (
                      <div
                        key={tier.id}
                        className={`p-2 rounded-lg border flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-100/90 border-[#082653] font-bold text-slate-900'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#082653]" />}
                          <span>{lang === 'fr' ? tier.nameFr : tier.nameEn}</span>
                        </span>
                        <div className="text-right">
                          <span className="font-extrabold text-[#082653]">
                            {tierFee.toLocaleString('fr-FR')} {currentCurrency.symbol}
                          </span>
                          <span className="text-[9px] text-slate-400 block">({tier.amountXaf} XAF)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {isLand ? (
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-800">
                <span className="font-semibold">{t.landPlot} : </span>
                {lang === 'fr'
                  ? 'Terrain constructible / Parcelle viabilisée. Nombre de chambres et salles de bain non applicable.'
                  : 'Buildable land / serviced plot. Bedrooms and bathrooms are not applicable.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.bedsLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.bathsLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Sqft / Surface */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isLand
                  ? lang === 'fr'
                    ? 'Superficie du terrain (m²)'
                    : 'Land Plot Area (Sq Ft / m²)'
                  : lang === 'fr'
                  ? 'Surface habitable (Sq Ft / m²)'
                  : 'Living Area (Sq Ft / m²)'}
              </label>
              <input
                type="text"
                placeholder={isLand ? '5000' : '2200'}
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            {/* Photos & Videos Upload Section */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900">
                  {t.mediaSectionTitle}
                </label>
                <p className="text-[11px] text-slate-500">
                  {t.mediaSectionDesc}
                </p>
              </div>

              {/* Upload Photos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#082653]" />
                    <span>{t.uploadPhotosLabel}</span>
                    {photos.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        {photos.length}
                      </span>
                    )}
                  </span>
                  {photos.length > 0 && (
                    <button
                      type="button"
                      onClick={() => filePhotoInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{t.uploadPhotosBtn}</span>
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={filePhotoInputRef}
                  onChange={handlePhotoFilesSelected}
                  multiple
                  accept="image/*"
                  className="hidden"
                />

                {/* Dropzone Area when no photos or for quick add */}
                {photos.length === 0 ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingPhoto(true);
                    }}
                    onDragLeave={() => setIsDraggingPhoto(false)}
                    onDrop={handlePhotoDrop}
                    onClick={() => filePhotoInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                      isDraggingPhoto
                        ? 'border-[#082653] bg-blue-50/60 scale-[1.01]'
                        : 'border-slate-300 hover:border-[#082653] bg-slate-50/70 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-200/80 flex items-center justify-center text-[#082653]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {isUploadingPhoto
                        ? (lang === 'fr' ? 'Optimisation et chargement des photos...' : 'Optimizing and uploading photos...')
                        : (lang === 'fr' ? 'Cliquez pour sélectionner vos photos ou glissez-déposez ici' : 'Click to select photos or drag & drop here')}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {lang === 'fr'
                        ? 'Photos de haute qualité (JPG, PNG, WebP) depuis votre PC ou smartphone'
                        : 'High quality photos (JPG, PNG, WebP) from phone or desktop'}
                    </p>
                    <button
                      type="button"
                      disabled={isUploadingPhoto}
                      className="mt-3 px-3 py-1.5 bg-[#082653] hover:bg-[#16477F] text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingPhoto ? 'Traitement...' : t.uploadPhotosBtn}</span>
                    </button>
                  </div>
                ) : (
                  /* Thumbnails list with "+ Ajouter" tile */
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                    {photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group bg-slate-100 shadow-2xs"
                      >
                        <img
                          src={photo}
                          alt={`Property upload ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if broken
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                            {t.coverPhotoBadge}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetPrimaryCover(idx);
                              }}
                              title={t.setAsCover}
                              className="w-7 h-7 rounded-full bg-white text-slate-800 flex items-center justify-center text-[10px] font-bold shadow hover:bg-slate-100 cursor-pointer transition-transform hover:scale-110"
                            >
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePhoto(idx);
                            }}
                            title={t.removeMedia}
                            className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow hover:bg-red-700 cursor-pointer transition-transform hover:scale-110"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Quick Add More Tile */}
                    <button
                      type="button"
                      onClick={() => filePhotoInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="aspect-video rounded-lg border-2 border-dashed border-slate-300 hover:border-[#082653] bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center text-slate-600 hover:text-[#082653] transition-all cursor-pointer p-2"
                    >
                      <Plus className="w-4 h-4 mb-0.5" />
                      <span className="text-[10px] font-semibold text-center leading-tight">
                        {lang === 'fr' ? '+ Ajouter' : '+ Add more'}
                      </span>
                    </button>
                  </div>
                )}

                {/* Direct Photo URL Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="url"
                    placeholder={t.photoUrlPlaceholder}
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPhotoUrl();
                      }
                    }}
                    className="flex-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#082653]"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 inline mr-1" />
                    <span>{t.addPhotoUrlBtn}</span>
                  </button>
                </div>
              </div>


              {/* Video Walkthrough Section */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  {t.videoSectionLabel}
                </span>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder={t.videoPlaceholder}
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => fileVideoInputRef.current?.click()}
                    disabled={isUploadingVideo}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <VideoIcon className="w-3.5 h-3.5" />
                    <span>{t.uploadVideoBtn}</span>
                  </button>
                  <input
                    type="file"
                    ref={fileVideoInputRef}
                    onChange={handleVideoFileSelected}
                    accept="video/*"
                    className="hidden"
                  />
                </div>

                {parsedVideo && (
                  <div className="pt-2">
                    <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                      {parsedVideo.type === 'youtube' || parsedVideo.type === 'vimeo' ? (
                        <iframe
                          src={parsedVideo.embedUrl}
                          title="Property Video Walkthrough"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video src={parsedVideo.embedUrl} controls className="w-full h-full object-contain" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                {t.contactSection}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder={t.namePlaceholder}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {/* CTA Button to proceed to payment */}
            <button
              type="submit"
              className="w-full bg-[#082653] hover:bg-[#16477F] text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>Continuer vers le paiement ({currentFee.formatted})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
