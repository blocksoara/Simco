import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Globe,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Video as VideoIcon,
  Star,
  FileText,
  Users,
  Mail,
  Phone,
  Calendar,
  Search,
  RefreshCw,
  X,
  ExternalLink,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  LogOut,
  Sliders,
} from 'lucide-react';
import { Property, PropertyStatus } from '../types.ts';
import { Language, getAllCountriesList } from '../i18n/translations.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase.ts';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  CURRENCIES,
  formatPriceWithCurrency,
  getDefaultCurrencyForCountry,
  getCurrency,
} from '../data/currencies.ts';
import { compressImage, formatVideoEmbedUrl } from '../utils/media.ts';

interface HiddenAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onAddProperty: (newProp: Property) => void;
  onDeleteProperty: (id: string) => Promise<void>;
  onSelectProperty: (prop: Property) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (val: boolean) => void;
  lang: Language;
}

interface ValuationLead {
  id: string;
  address: string;
  propertyType?: string;
  beds?: string;
  baths?: string;
  approxSqft?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  calculatedEstimate?: number;
  createdAt: string;
}

interface TourLead {
  id: string;
  propertyId: string;
  propertyAddress: string;
  clientName: string;
  clientPhone: string;
  tourDate: string;
  tourType: string;
  createdAt: string;
}

export const HiddenAdminModal: React.FC<HiddenAdminModalProps> = ({
  isOpen,
  onClose,
  properties,
  onAddProperty,
  onDeleteProperty,
  onSelectProperty,
  isAdminAuthenticated,
  setIsAdminAuthenticated,
  lang,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'publish' | 'properties' | 'leads' | 'security'>('publish');

  // Auth gate states
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Direct email login state for owner
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [isEmailLoginOpen, setIsEmailLoginOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // New Property Form States
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [country, setCountry] = useState('France');
  const [city, setCity] = useState('Cannes');
  const [address, setAddress] = useState('Boulevard de la Croisette');
  const [listingType, setListingType] = useState<PropertyStatus>('FOR SALE');
  const [propertyType, setPropertyType] = useState('Villa d\'Architecte');
  const [currency, setCurrency] = useState('EUR');
  const [rawPrice, setRawPrice] = useState('4850000');
  const [beds, setBeds] = useState('5');
  const [baths, setBaths] = useState('6');
  const [sqFt, setSqFt] = useState('420 m²');
  const [lotSize, setLotSize] = useState('2500 m²');
  const [parking, setParking] = useState('Garage 4 véhicules');
  const [yearBuilt, setYearBuilt] = useState('2024');
  const [badge, setBadge] = useState('Exclusivité Homeluxe');
  const [isFeatured, setIsFeatured] = useState(true);
  const [description, setDescription] = useState(
    'Propriété d’exception offrant des prestations de très haut standing, vue panoramique imprenable, domotique complète, finitions en marbre et matériaux nobles.'
  );

  // Agent branding
  const [agentName, setAgentName] = useState('Direction Homeluxe Prestige');
  const [agentPhone, setAgentPhone] = useState('+33 4 93 39 00 00');
  const [agentEmail, setAgentEmail] = useState('direction@homeluxe.com');

  // Media
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [isSubmittingProperty, setIsSubmittingProperty] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Manage catalogue states
  const [searchTerm, setSearchTerm] = useState('');
  const [catalogueFilter, setCatalogueFilter] = useState<'all' | 'admin' | 'users' | 'FOR SALE' | 'FOR RENT'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Leads
  const [valuationLeads, setValuationLeads] = useState<ValuationLead[]>([]);
  const [tourLeads, setTourLeads] = useState<TourLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Security passkey setting
  const [newMasterPass, setNewMasterPass] = useState('');
  const [passUpdateMsg, setPassUpdateMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen for ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load leads when switching to leads tab
  useEffect(() => {
    if (isOpen && isAdminAuthenticated && activeTab === 'leads') {
      fetchLeads();
    }
  }, [isOpen, isAdminAuthenticated, activeTab]);

  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const valSnapshot = await getDocs(collection(db, 'valuation_requests'));
      const valList: ValuationLead[] = [];
      valSnapshot.forEach((docSnap) => {
        const d = docSnap.data();
        valList.push({
          id: docSnap.id,
          address: d.address || '',
          propertyType: d.propertyType,
          beds: d.beds,
          baths: d.baths,
          approxSqft: d.approxSqft,
          ownerName: d.ownerName || 'Anonyme',
          ownerEmail: d.ownerEmail || '',
          ownerPhone: d.ownerPhone || '',
          calculatedEstimate: d.calculatedEstimate,
          createdAt: d.createdAt || '',
        });
      });
      setValuationLeads(valList.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')));

      const tourSnapshot = await getDocs(collection(db, 'tour_requests'));
      const tList: TourLead[] = [];
      tourSnapshot.forEach((docSnap) => {
        const d = docSnap.data();
        tList.push({
          id: docSnap.id,
          propertyId: d.propertyId || '',
          propertyAddress: d.propertyAddress || '',
          clientName: d.clientName || 'Client',
          clientPhone: d.clientPhone || '',
          tourDate: d.tourDate || '',
          tourType: d.tourType || '',
          createdAt: d.createdAt || '',
        });
      });
      setTourLeads(tList.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')));
    } catch (err) {
      console.warn('Error reading leads from Firestore:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  if (!isOpen) return null;

  // Validation & Unlock logic
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedCustomPass = localStorage.getItem('homeluxe_admin_key');
    const validCodes = ['homeluxe2025', 'admin1234', 'admin8888', 'admin', storedCustomPass].filter(Boolean);

    if (validCodes.includes(passcode.trim())) {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem('homeluxe_admin_auth', 'true');
        sessionStorage.setItem('homeluxe_admin_auth', 'true');
      } catch (_) {}
      setAuthError(null);
      setPasscode('');
    } else {
      setAuthError(
        lang === 'fr'
          ? 'Code de sécurité incorrect. Veuillez vérifier votre clé d’accès.'
          : 'Invalid master security passcode. Please check your credentials.'
      );
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerEmail || !ownerPassword) return;
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, ownerEmail, ownerPassword);
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem('homeluxe_admin_auth', 'true');
        sessionStorage.setItem('homeluxe_admin_auth', 'true');
      } catch (_) {}
      setIsEmailLoginOpen(false);
    } catch (err: any) {
      setAuthError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLockConsole = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('homeluxe_admin_auth');
      sessionStorage.removeItem('homeluxe_admin_auth');
    } catch (_) {}
    onClose();
  };

  // Country change automatically adapts currency
  const handleCountryChange = (c: string) => {
    setCountry(c);
    const curr = getDefaultCurrencyForCountry(c);
    setCurrency(curr);
  };

  // Preset quick fill
  const loadPreset = (presetType: 'cannes' | 'manhattan' | 'marrakech') => {
    if (presetType === 'cannes') {
      setTitle('Villa Miramar & Vue Cap d\'Antibes');
      setTagline('Demeure contemporaine les pieds dans l\'eau avec ponton d\'amarrage privé');
      setCountry('France');
      setCity('Cannes');
      setAddress('Boulevard de la Croisette, Cannes');
      setCurrency('EUR');
      setRawPrice('7800000');
      setPropertyType('Villa d\'Architecte');
      setBeds('6');
      setBaths('7');
      setSqFt('650 m²');
      setLotSize('4200 m²');
      setBadge('Exclusivité Homeluxe');
      setIsFeatured(true);
      setCoverImage('https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80');
      setGalleryImages([
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      ]);
    } else if (presetType === 'manhattan') {
      setTitle('Sky Penthouse Billionaires\' Row');
      setTagline('Vue vertigineuse 360° sur Central Park et la skyline de Manhattan');
      setCountry('United States');
      setCity('New York');
      setAddress('432 Park Avenue, Penthouse 88, New York, NY 10022');
      setCurrency('USD');
      setRawPrice('18500000');
      setPropertyType('Penthouse de Prestige');
      setBeds('4');
      setBaths('5');
      setSqFt('5800 sq ft');
      setLotSize('Terrasse 120 m²');
      setBadge('Off-Market Confidentiel');
      setIsFeatured(true);
      setCoverImage('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80');
      setGalleryImages([
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      ]);
    } else {
      setTitle('Palais & Palmeraie Royale');
      setTagline('Architecture hispano-mauresque, oliveraie centenaire et spa traditionnel');
      setCountry('Maroc');
      setCity('Marrakech');
      setAddress('Circuit de la Palmeraie, Marrakech');
      setCurrency('EUR');
      setRawPrice('3950000');
      setPropertyType('Manoir & Domaine');
      setBeds('8');
      setBaths('9');
      setSqFt('1200 m²');
      setLotSize('15 000 m²');
      setBadge('Coup de Cœur Direction');
      setIsFeatured(true);
      setCoverImage('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80');
      setGalleryImages([
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      ]);
    }
  };

  // Upload photo from device
  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const newImgs: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImage =
          file.type.startsWith('image/') ||
          /\.(jpe?g|png|webp|gif|bmp|heic|heif|avif)$/i.test(file.name);
        if (isImage) {
          const compressed = await compressImage(file, 1400, 1050, 0.8);
          if (compressed && compressed.length > 50 && compressed !== 'data:,') {
            newImgs.push(compressed);
          }
        }
      }
      if (newImgs.length > 0) {
        setGalleryImages((prev) => [...prev, ...newImgs]);
      }
    } catch (err) {
      console.warn('Image upload compression error:', err);
    }
  };

  // Submit new property as Admin/Agency
  const handlePublishAdminProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProperty(true);

    try {
      const numPrice = parseFloat(rawPrice.replace(/\s+/g, '')) || 1000000;
      const formattedPrice = formatPriceWithCurrency(numPrice, currency);
      const curr = getCurrency(currency);

      const propId = `admin-prop-${Date.now()}`;
      const allImages = [coverImage, ...galleryImages].filter(Boolean);

      const newProp: Property = {
        id: propId,
        status: listingType,
        price: formattedPrice,
        rawPrice: numPrice,
        currency: curr.code,
        currencySymbol: curr.symbol,
        period: listingType === 'FOR RENT' ? (lang === 'fr' ? '/mois' : '/mo') : '',
        address: address.trim() || `${propertyType} Prestige`,
        location: `${city}, ${country}`,
        city: city.trim(),
        state: '',
        zip: '',
        country: country.trim(),
        beds: parseInt(beds) || 4,
        baths: parseInt(baths) || 4,
        sqFt: sqFt.trim() || '400 m²',
        image: coverImage || allImages[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        images: allImages,
        video: videoUrl.trim() || '',
        type: propertyType,
        description: description.trim() || `${title}. ${tagline}`,
        yearBuilt: parseInt(yearBuilt) || new Date().getFullYear(),
        parking,
        features: [
          'Prestation Haute Gamme Signature',
          'Sécurité & Domotique Intégrée',
          'Matériaux Nobles et Marbres Rares',
          'Piscine et Espaces de Détente Privés',
          badge,
        ],
        authorUid: user?.uid || 'admin_owner',
        createdAt: new Date().toISOString(),
        featured: isFeatured,
        badge,
        isAdminListing: true,
        agent: {
          name: agentName || 'Direction Homeluxe Prestige',
          phone: agentPhone || '+33 4 93 39 00 00',
          email: agentEmail || 'direction@homeluxe.com',
        },
      };

      // Persist in Firestore
      await setDoc(doc(db, 'properties', propId), newProp);

      // Add to React state
      onAddProperty(newProp);

      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Admin publish property error:', err);
      alert('Erreur lors de la publication : ' + (err as any).message);
    } finally {
      setIsSubmittingProperty(false);
    }
  };

  // Toggle Featured status in Firestore
  const handleToggleFeatured = async (property: Property) => {
    setActionLoadingId(property.id);
    try {
      const nextFeatured = !property.featured;
      await updateDoc(doc(db, 'properties', property.id), {
        featured: nextFeatured,
      });
      property.featured = nextFeatured;
    } catch (err) {
      console.warn('Error updating featured in Firestore:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Toggle Status (For Sale <-> For Rent)
  const handleToggleStatus = async (property: Property) => {
    setActionLoadingId(property.id);
    try {
      const nextStatus: PropertyStatus = property.status === 'FOR SALE' ? 'FOR RENT' : 'FOR SALE';
      await updateDoc(doc(db, 'properties', property.id), {
        status: nextStatus,
      });
      property.status = nextStatus;
    } catch (err) {
      console.warn('Error toggling status in Firestore:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Save new master passkey
  const handleSaveMasterPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMasterPass.trim().length < 4) {
      setPassUpdateMsg('Le code doit comporter au moins 4 caractères.');
      return;
    }
    localStorage.setItem('homeluxe_admin_key', newMasterPass.trim());
    setPassUpdateMsg('Code secret maître mis à jour avec succès !');
    setNewMasterPass('');
    setTimeout(() => setPassUpdateMsg(null), 4000);
  };

  // Delete lead
  const handleDeleteValuationLead = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'valuation_requests', id));
      setValuationLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.warn('Error deleting lead:', err);
    }
  };

  const handleDeleteTourLead = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tour_requests', id));
      setTourLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.warn('Error deleting tour request:', err);
    }
  };

  // Filter catalogue properties
  const filteredCatalogue = properties.filter((prop) => {
    const matchesSearch =
      (prop.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prop.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prop.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prop.price || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (catalogueFilter === 'admin') return prop.isAdminListing === true;
    if (catalogueFilter === 'users') return prop.isAdminListing !== true;
    if (catalogueFilter === 'FOR SALE') return prop.status === 'FOR SALE';
    if (catalogueFilter === 'FOR RENT') return prop.status === 'FOR RENT';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-[#03152d] border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[94vh] shadow-2xl flex flex-col overflow-hidden text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Executive Header */}
        <div className="bg-[#020e20] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-wider text-white">
                  HOMELUXE MASTER CONSOLE
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-widest">
                  Discret / Propriétaire
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Espace confidentiel de gestion immobilière, publication prioritaire et modération
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={handleLockConsole}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold border border-red-500/30 transition-colors cursor-pointer"
                title="Verrouiller et masquer la console"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Verrouiller</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION GATE (If not yet authenticated) */}
        {!isAdminAuthenticated ? (
          <div className="p-6 sm:p-12 max-w-lg mx-auto w-full my-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/5">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Accès Sécurisé Propriétaire
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                Veuillez saisir votre code d’accès maître ou vous connecter avec votre compte administrateur.
              </p>
            </div>

            {authError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {!isEmailLoginOpen ? (
              <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Code maître (ex: homeluxe2025)"
                    autoFocus
                    className="w-full bg-[#071e3d] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 pr-10 tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Déverrouiller la Console</span>
                </button>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <button
                    type="button"
                    onClick={() => setIsEmailLoginOpen(true)}
                    className="hover:text-amber-400 transition-colors cursor-pointer underline"
                  >
                    Connexion par email/mot de passe
                  </button>
                  <span className="text-[11px] text-slate-500">
                    Raccourci: <code className="text-amber-400">Ctrl+Shift+A</code>
                  </span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-3 text-left">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Email Administrateur</label>
                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="direction@homeluxe.com"
                    required
                    className="w-full bg-[#071e3d] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Mot de passe</label>
                  <input
                    type="password"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#071e3d] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer mt-2 flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  <span>Se connecter en tant qu'administrateur</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEmailLoginOpen(false)}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    ← Retour au code secret maître
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs */}
            <div className="bg-[#041d40] px-6 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
              <button
                onClick={() => setActiveTab('publish')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'publish'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Publier une Annonce Prestige</span>
              </button>

              <button
                onClick={() => setActiveTab('properties')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'properties'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Catalogue & Modération ({properties.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'leads'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Demandes & Visites Clients</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'security'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Sécurité & Raccourcis</span>
              </button>
            </div>

            {/* TAB CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: PUBLISH PRESTIGE LISTING */}
              {activeTab === 'publish' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {publishSuccess && (
                    <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                      <div>
                        <p className="text-sm font-bold">Annonce prestige publiée avec succès !</p>
                        <p className="text-xs text-emerald-400/80">
                          Elle est désormais visible instantanément par tous les visiteurs sur le site et enregistrée dans Firestore.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Preset Quick Fill Bar */}
                  <div className="bg-[#05224a] p-3.5 rounded-xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                      <Award className="w-4 h-4" />
                      <span>Remplissage rapide avec modèles de luxe :</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => loadPreset('cannes')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200 border border-slate-600 transition-colors cursor-pointer"
                      >
                        🏰 Villa Cannes / Croisette
                      </button>
                      <button
                        type="button"
                        onClick={() => loadPreset('manhattan')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200 border border-slate-600 transition-colors cursor-pointer"
                      >
                        🏙️ Penthouse Manhattan NY
                      </button>
                      <button
                        type="button"
                        onClick={() => loadPreset('marrakech')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200 border border-slate-600 transition-colors cursor-pointer"
                      >
                        🌴 Palais Palmeraie Marrakech
                      </button>
                    </div>
                  </div>

                  {/* Publishing Form */}
                  <form onSubmit={handlePublishAdminProperty} className="space-y-5">
                    {/* General Info */}
                    <div className="bg-[#041a38] p-5 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>1. Informations Générales & Titre</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">
                            Titre de la propriété
                          </label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="ex: Villa Miramar & Vue Cap d'Antibes"
                            required
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">
                            Sous-titre / Accroche
                          </label>
                          <input
                            type="text"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="ex: Demeure contemporaine les pieds dans l'eau"
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">
                            Statut de la transaction
                          </label>
                          <select
                            value={listingType}
                            onChange={(e) => setListingType(e.target.value as PropertyStatus)}
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          >
                            <option value="FOR SALE">À VENDRE (FOR SALE)</option>
                            <option value="FOR RENT">À LOUER (FOR RENT)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">
                            Type de bien
                          </label>
                          <input
                            type="text"
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                            placeholder="ex: Villa d'Architecte, Penthouse, Manoir"
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">
                            Badge exclusif
                          </label>
                          <select
                            value={badge}
                            onChange={(e) => setBadge(e.target.value)}
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          >
                            <option value="Exclusivité Homeluxe">Exclusivité Homeluxe</option>
                            <option value="Coup de Cœur Direction">Coup de Cœur Direction</option>
                            <option value="Off-Market Confidentiel">Off-Market Confidentiel</option>
                            <option value="Vue Mer Panoramique">Vue Mer Panoramique</option>
                            <option value="Nouveauté Prestige">Nouveauté Prestige</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Multi-currency */}
                    <div className="bg-[#041a38] p-5 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>2. Prix, Pays & Devise Internationale</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">
                            Pays d'implantation
                          </label>
                          <select
                            value={country}
                            onChange={(e) => handleCountryChange(e.target.value)}
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          >
                            {getAllCountriesList(lang).map((c) => (
                              <option key={c.value} value={c.value}>
                                {lang === 'fr' ? c.labelFr : c.labelEn}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">
                            Devise de vente / location
                          </label>
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          >
                            {CURRENCIES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.labelFr}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">
                            Montant brut ({currency})
                          </label>
                          <input
                            type="number"
                            value={rawPrice}
                            onChange={(e) => setRawPrice(e.target.value)}
                            placeholder="ex: 4500000"
                            required
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">
                            Ville / Région
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="ex: Cannes"
                            required
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">
                            Adresse exacte / Quartier de prestige
                          </label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="ex: Boulevard de la Croisette"
                            required
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Specs & Dimensions */}
                    <div className="bg-[#041a38] p-5 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>3. Caractéristiques & Dimensions</span>
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">Chambres</label>
                          <input
                            type="number"
                            value={beds}
                            onChange={(e) => setBeds(e.target.value)}
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">Salles de bain</label>
                          <input
                            type="number"
                            value={baths}
                            onChange={(e) => setBaths(e.target.value)}
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">Surface Habitable</label>
                          <input
                            type="text"
                            value={sqFt}
                            onChange={(e) => setSqFt(e.target.value)}
                            placeholder="ex: 450 m²"
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-medium block mb-1">Terrain / Parc</label>
                          <input
                            type="text"
                            value={lotSize}
                            onChange={(e) => setLotSize(e.target.value)}
                            placeholder="ex: 3 000 m²"
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          Description détaillée du bien
                        </label>
                        <textarea
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Description soignée pour la clientèle haut de gamme..."
                          className="w-full bg-[#020e20] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Media, Photos & Video Tour */}
                    <div className="bg-[#041a38] p-5 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>4. Galerie Photos & Visite Vidéo Virtuelle</span>
                      </h4>

                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          Image Principale (Couverture)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="https://..."
                            required
                            className="flex-1 bg-[#020e20] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-600 flex items-center gap-1.5 cursor-pointer"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>Parcourir</span>
                          </button>
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleUploadPhoto}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>

                      {/* Cover preview */}
                      {coverImage && (
                        <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-slate-700">
                          <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded font-semibold">
                            Photo de couverture principale
                          </span>
                        </div>
                      )}

                      {/* Additional Gallery Photos */}
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          Ajouter des photos à la galerie ({galleryImages.length} photos)
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="url"
                            value={newGalleryUrl}
                            onChange={(e) => setNewGalleryUrl(e.target.value)}
                            placeholder="URL d'une photo supplémentaire (https://...)"
                            className="flex-1 bg-[#020e20] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newGalleryUrl.trim()) {
                                setGalleryImages([...galleryImages, newGalleryUrl.trim()]);
                                setNewGalleryUrl('');
                              }
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold cursor-pointer"
                          >
                            Ajouter
                          </button>
                        </div>

                        {galleryImages.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {galleryImages.map((img, idx) => (
                              <div
                                key={idx}
                                className="relative aspect-video rounded-lg overflow-hidden border border-slate-700 group"
                              >
                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Video Tour */}
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          Lien Visite Vidéo Virtuelle (YouTube, Vimeo ou MP4)
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="ex: https://www.youtube.com/watch?v=..."
                            className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 pr-10"
                          />
                          <VideoIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                        </div>
                      </div>
                    </div>

                    {/* Featured Checkbox & Publish CTA */}
                    <div className="bg-[#05224a] p-5 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isFeatured}
                          onChange={(e) => setIsFeatured(e.target.checked)}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-white block">Épingler en haut de la page d'accueil</span>
                          <span className="text-slate-400">
                            Affiche l'annonce dans la section prestigieuse des propriétés en vedette
                          </span>
                        </div>
                      </label>

                      <button
                        type="submit"
                        disabled={isSubmittingProperty}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSubmittingProperty ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Publication en cours...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Publier l'Annonce Officielle</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: MANAGE PROPERTIES & MODERATION */}
              {activeTab === 'properties' && (
                <div className="space-y-4">
                  {/* Search and Filters Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#041a38] p-4 rounded-xl border border-slate-800">
                    <div className="relative flex-1 max-w-md">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher par adresse, ville, prix..."
                        className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 pl-9"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {(['all', 'admin', 'users', 'FOR SALE', 'FOR RENT'] as const).map((fil) => (
                        <button
                          key={fil}
                          onClick={() => setCatalogueFilter(fil)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            catalogueFilter === fil
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          {fil === 'all'
                            ? `Tous (${properties.length})`
                            : fil === 'admin'
                            ? 'Agence'
                            : fil === 'users'
                            ? 'Particuliers'
                            : fil === 'FOR SALE'
                            ? 'À Vendre'
                            : 'À Louer'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Properties Table / Cards */}
                  <div className="grid grid-cols-1 gap-3">
                    {filteredCatalogue.map((prop) => (
                      <div
                        key={prop.id}
                        className="bg-[#041a38] border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={prop.image}
                            alt={prop.address}
                            className="w-16 h-14 rounded-lg object-cover border border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-white truncate max-w-xs">
                                {prop.address}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  prop.status === 'FOR SALE'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {prop.status}
                              </span>
                              {prop.isAdminListing ? (
                                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                                  👑 Agence Officielle
                                </span>
                              ) : (
                                <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                                  Particulier
                                </span>
                              )}
                              {prop.paymentStatus === 'PAID' && (
                                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                                  💳 Payé SasPay ({prop.paymentAmount || 'Tarif acquitté'})
                                </span>
                              )}
                              {prop.featured && (
                                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-slate-950" />
                                  <span>Vedette</span>
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-400 mt-0.5">
                              {prop.city}, {prop.country} • {prop.beds} lits • {prop.baths} sdb • {prop.sqFt}
                            </p>
                            <p className="text-xs font-semibold text-amber-400 mt-1">
                              {prop.price} {prop.period || ''}
                            </p>
                          </div>
                        </div>

                        {/* Actions for this property */}
                        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                          {/* Toggle Featured */}
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(prop)}
                            disabled={actionLoadingId === prop.id}
                            className={`p-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${
                              prop.featured
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                            }`}
                            title={prop.featured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                          >
                            <Star className={`w-3.5 h-3.5 ${prop.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                            <span className="hidden sm:inline">
                              {prop.featured ? 'En Vedette' : 'Mettre en Vedette'}
                            </span>
                          </button>

                          {/* Toggle Status */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(prop)}
                            disabled={actionLoadingId === prop.id}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                            title="Changer statut Vente / Location"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {/* View */}
                          <button
                            type="button"
                            onClick={() => {
                              onSelectProperty(prop);
                              onClose();
                            }}
                            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Voir</span>
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm(`Supprimer définitivement l'annonce "${prop.address}" ?`)) {
                                await onDeleteProperty(prop.id);
                              }
                            }}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
                            title="Supprimer cette annonce"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: LEADS & INQUIRIES */}
              {activeTab === 'leads' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Demandes Clients & Estimations Reçues</h4>
                      <p className="text-xs text-slate-400">
                        Coordonnées des prospects ayant demandé une estimation ou réservé une visite
                      </p>
                    </div>

                    <button
                      onClick={fetchLeads}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingLeads ? 'animate-spin' : ''}`} />
                      <span>Actualiser</span>
                    </button>
                  </div>

                  {/* Valuation Inquiries */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Demandes d'Estimation Immobilière ({valuationLeads.length})</span>
                    </h5>

                    {valuationLeads.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-4 bg-[#041a38] rounded-xl border border-slate-800">
                        Aucune demande d'estimation enregistrée pour le moment.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2.5">
                        {valuationLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className="bg-[#041a38] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <p className="font-bold text-white text-sm">{lead.ownerName}</p>
                              <div className="flex flex-wrap items-center gap-3 text-slate-300 mt-1">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                                  <a href={`mailto:${lead.ownerEmail}`} className="hover:underline text-amber-300">
                                    {lead.ownerEmail}
                                  </a>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                                  <a href={`tel:${lead.ownerPhone}`} className="hover:underline">
                                    {lead.ownerPhone}
                                  </a>
                                </span>
                              </div>
                              <p className="text-slate-400 mt-1">
                                Adresse du bien : <span className="text-white font-medium">{lead.address}</span>
                                {lead.calculatedEstimate && (
                                  <>
                                    {' '}
                                    • Estimation générée :{' '}
                                    <span className="text-emerald-400 font-bold">
                                      {lead.calculatedEstimate.toLocaleString('fr-FR')} €
                                    </span>
                                  </>
                                )}
                              </p>
                            </div>

                            <button
                              onClick={() => handleDeleteValuationLead(lead.id)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-colors cursor-pointer self-end sm:self-center"
                              title="Supprimer ce lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tour Booking Inquiries */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Demandes de Visite Privée ({tourLeads.length})</span>
                    </h5>

                    {tourLeads.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-4 bg-[#041a38] rounded-xl border border-slate-800">
                        Aucune demande de visite enregistrée pour le moment.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2.5">
                        {tourLeads.map((tour) => (
                          <div
                            key={tour.id}
                            className="bg-[#041a38] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <p className="font-bold text-white text-sm">{tour.clientName}</p>
                              <p className="text-slate-300 mt-1">
                                Téléphone :{' '}
                                <a href={`tel:${tour.clientPhone}`} className="text-amber-300 hover:underline">
                                  {tour.clientPhone}
                                </a>{' '}
                                • Bien : <span className="text-white">{tour.propertyAddress}</span>
                              </p>
                              <p className="text-slate-400 mt-1">
                                Date souhaitée : <span className="text-amber-400 font-semibold">{tour.tourDate}</span> (
                                {tour.tourType === 'in-person' ? 'Visite sur place' : 'Visite vidéo à distance'})
                              </p>
                            </div>

                            <button
                              onClick={() => handleDeleteTourLead(tour.id)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-colors cursor-pointer self-end sm:self-center"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: SECURITY & SHORTCUTS */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-xl mx-auto">
                  <div className="bg-[#041a38] p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      <span>Personnaliser le Code Secret Maître</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Vous pouvez définir un mot de passe personnalisé pour accéder à cet espace secret.
                      (Codes par défaut acceptés : <code>homeluxe2025</code> ou <code>admin1234</code>).
                    </p>

                    {passUpdateMsg && (
                      <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/40">
                        {passUpdateMsg}
                      </div>
                    )}

                    <form onSubmit={handleSaveMasterPass} className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          Nouveau Code Secret Maître
                        </label>
                        <input
                          type="password"
                          value={newMasterPass}
                          onChange={(e) => setNewMasterPass(e.target.value)}
                          placeholder="Entrez votre nouveau mot de passe secret"
                          className="w-full bg-[#020e20] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Enregistrer le nouveau code secret
                      </button>
                    </form>
                  </div>

                  {/* Stealth Access Guide */}
                  <div className="bg-[#041a38] p-5 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Comment ouvrir la console secrète sans attirer l'attention ?</span>
                    </h4>
                    <ul className="space-y-2 text-slate-400 list-disc list-inside">
                      <li>
                        <strong className="text-slate-200">Raccourci clavier universel :</strong> Pressez{' '}
                        <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">
                          Ctrl + Shift + A
                        </kbd>{' '}
                        (ou <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">Cmd + Shift + A</kbd> sur Mac) à tout moment.
                      </li>
                      <li>
                        <strong className="text-slate-200">Adresse URL discrète :</strong> Ajoutez{' '}
                        <code className="text-amber-300">#admin</code> à la fin de l'URL du navigateur.
                      </li>
                      <li>
                        <strong className="text-slate-200">Déclencheur discret en pied de page :</strong> Cliquez{' '}
                        <strong>3 fois consécutives</strong> sur le symbole <code>©</code> tout en bas de la page.
                      </li>
                      <li>
                        <strong className="text-slate-200">Verrouillage instantané :</strong> Pressez la touche{' '}
                        <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">Échap</kbd> ou
                        cliquez sur "Verrouiller" pour faire disparaître toute trace de la console.
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleLockConsole}
                      className="px-6 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Verrouiller et masquer la session immédiatement</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
