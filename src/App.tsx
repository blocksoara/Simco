/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { PropertySearch } from './components/PropertySearch.tsx';
import { BenefitsRow } from './components/BenefitsRow.tsx';
import { FeaturedProperties } from './components/FeaturedProperties.tsx';
import { HomeValuationBanner } from './components/HomeValuationBanner.tsx';
import { WhyChooseUs } from './components/WhyChooseUs.tsx';
import { Newsletter } from './components/Newsletter.tsx';
import { Footer } from './components/Footer.tsx';
import { PropertyDetailModal } from './components/PropertyDetailModal.tsx';
import { ValuationModal } from './components/ValuationModal.tsx';
import { ListPropertyModal } from './components/ListPropertyModal.tsx';
import { HowItWorksModal } from './components/HowItWorksModal.tsx';
import { AllPropertiesModal } from './components/AllPropertiesModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { HiddenAdminModal } from './components/HiddenAdminModal.tsx';
import { FEATURED_PROPERTIES } from './data/properties.ts';
import { Property, SearchFilters } from './types.ts';
import { Language, translations } from './i18n/translations.ts';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext.tsx';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from './lib/firebase.ts';

export default function App() {
  // French is the default language as requested: "mets le français la langue par defaut"
  const [lang, setLang] = useState<Language>('fr');
  const t = translations[lang];

  const { user, userFavorites, toggleFavoriteInCloud } = useAuth();

  const [activeNavTab, setActiveNavTab] = useState('home');
  const [localFavorites, setLocalFavorites] = useState<Set<string>>(new Set(['prop-4']));
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isValuationOpen, setIsValuationOpen] = useState(false);
  const [isListPropertyOpen, setIsListPropertyOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAllPropertiesOpen, setIsAllPropertiesOpen] = useState(false);
  const [allPropertiesInitialFilter, setAllPropertiesInitialFilter] = useState<'all' | 'FOR SALE' | 'FOR RENT' | 'my-listings'>('all');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return (
      typeof window !== 'undefined' &&
      (localStorage.getItem('homeluxe_admin_auth') === 'true' ||
        sessionStorage.getItem('homeluxe_admin_auth') === 'true')
    );
  });
  const [notification, setNotification] = useState<string | null>(null);

  // Hidden Admin Panel triggers: Ctrl+Shift+A or #admin in URL
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen((prev) => !prev);
      }
    };

    const checkHashOrQuery = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=true') ||
        window.location.search.includes('admin=1')
      ) {
        setIsAdminModalOpen(true);
        try {
          history.replaceState(null, '', window.location.pathname);
        } catch (_) {}
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkHashOrQuery);
    checkHashOrQuery();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkHashOrQuery);
    };
  }, []);

  // Dynamic properties collection with Firestore real-time sync
  const [propertiesList, setPropertiesList] = useState<Property[]>(FEATURED_PROPERTIES);

  // Sync real-time properties from Firestore
  useEffect(() => {
    try {
      const propertiesCol = collection(db, 'properties');
      const unsub = onSnapshot(
        propertiesCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreProps: Property[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              const defaultLuxuryPhoto =
                'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80';
              const rawImage = typeof data.image === 'string' ? data.image.trim() : '';
              const isClean = rawImage && rawImage !== 'data:,' && rawImage.length > 30;
              const safeImage = isClean ? rawImage : defaultLuxuryPhoto;
              const rawImages = Array.isArray(data.images) ? data.images : rawImage ? [rawImage] : [];
              const cleanImages = rawImages.filter(
                (img: string) => img && typeof img === 'string' && img !== 'data:,' && img.trim().length > 30
              );

              firestoreProps.push({
                id: docSnap.id,
                status: data.status,
                price: data.price,
                rawPrice: data.rawPrice,
                currency: data.currency,
                currencySymbol: data.currencySymbol,
                period: data.period,
                address: data.address,
                location: data.location,
                city: data.city,
                state: data.state || '',
                zip: data.zip || '',
                country: data.country,
                beds: data.beds,
                baths: data.baths,
                sqFt: data.sqFt,
                image: safeImage,
                images: cleanImages.length > 0 ? cleanImages : [safeImage],
                video: data.video || undefined,
                type: data.type,
                description: data.description,
                yearBuilt: data.yearBuilt,
                parking: data.parking,
                features: data.features,
                authorUid: data.authorUid,
                createdAt: data.createdAt,
                featured: data.featured,
                badge: data.badge,
                isAdminListing: data.isAdminListing,
                isArchived: data.isArchived,
                paymentStatus: data.paymentStatus,
                paymentReference: data.paymentReference,
                paymentAmount: data.paymentAmount,
                paidAt: data.paidAt,
                agent: data.agent,
              });
            });

            const uniqueMap = new Map<string, Property>();
            firestoreProps.forEach((p) => uniqueMap.set(p.id, p));
            FEATURED_PROPERTIES.forEach((p) => {
              if (!uniqueMap.has(p.id)) {
                uniqueMap.set(p.id, p);
              }
            });
            setPropertiesList(Array.from(uniqueMap.values()));
          }
        },
        (err) => {
          console.warn('Firestore onSnapshot properties error:', err);
        }
      );

      return () => unsub();
    } catch (e) {
      console.warn('Firestore subscription exception:', e);
    }
  }, []);

  // Use user favorites from Firestore if signed in, otherwise local favorites
  const activeFavorites = user ? userFavorites : localFavorites;

  const [filters, setFilters] = useState<SearchFilters>({
    tab: 'Buy',
    country: 'all',
    location: '',
    propertyType: 'Any Type',
    priceRange: '$Min - $Max',
    beds: 'Any',
    baths: 'Any',
  });

  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(filters);

  // Toggle favorite property (syncs to Firestore if user is authenticated)
  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      await toggleFavoriteInCloud(id);
    } else {
      setLocalFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }
  };

  // Add newly listed property from anywhere in the world (with strict deduplication)
  const handleAddProperty = (newProp: Property) => {
    setPropertiesList((prev) => [newProp, ...prev.filter((p) => p.id !== newProp.id)]);
  };

  // Delete property (removes from Firestore and local state)
  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await deleteDoc(doc(db, 'properties', propertyId));
    } catch (err) {
      console.warn('Firestore property delete error:', err);
    }
    setPropertiesList((prev) => prev.filter((p) => p.id !== propertyId));
    if (selectedProperty?.id === propertyId) {
      setSelectedProperty(null);
    }
    setNotification(
      lang === 'fr'
        ? 'Votre annonce a été supprimée avec succès !'
        : 'Your listing has been successfully deleted!'
    );
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Open "My Listings" in AllPropertiesModal
  const handleOpenMyListings = () => {
    setAllPropertiesInitialFilter('my-listings');
    setIsAllPropertiesOpen(true);
  };

  // Filter properties logic with global country filter and strict ID uniqueness
  const displayedProperties = useMemo(() => {
    const seenIds = new Set<string>();
    return propertiesList.filter((prop) => {
      if (seenIds.has(prop.id)) return false;
      seenIds.add(prop.id);

      // Tab filter
      if (appliedFilters.tab === 'Buy' && prop.status !== 'FOR SALE') {
        return false;
      }
      if (appliedFilters.tab === 'Rent' && prop.status !== 'FOR RENT') {
        return false;
      }

      // Country filter
      if (
        appliedFilters.country &&
        appliedFilters.country !== 'all'
      ) {
        const selC = appliedFilters.country.toLowerCase();
        const propC = prop.country.toLowerCase();
        const matchesCountry =
          propC === selC ||
          (selC === 'france' && (propC === 'france' || prop.location.toLowerCase().includes('france'))) ||
          (selC === 'états-unis' && (propC === 'united states' || propC === 'états-unis')) ||
          (selC === 'united states' && (propC === 'united states' || propC === 'états-unis')) ||
          (selC === 'suisse' && (propC === 'switzerland' || propC === 'suisse')) ||
          (selC === 'émirats arabes unis' && (propC === 'united arab emirates' || propC === 'émirats arabes unis' || prop.location.toLowerCase().includes('dubai')));
        if (!matchesCountry) return false;
      }

      // Location filter (city, neighborhood, zip)
      if (appliedFilters.location.trim()) {
        const query = appliedFilters.location.toLowerCase();
        const matchesLoc =
          prop.location.toLowerCase().includes(query) ||
          prop.address.toLowerCase().includes(query) ||
          prop.city.toLowerCase().includes(query) ||
          prop.country.toLowerCase().includes(query) ||
          prop.zip.includes(query);
        if (!matchesLoc) return false;
      }

      // Property type filter (with support for Terrain / Parcelle & Land / Plot)
      if (appliedFilters.propertyType !== 'Any Type') {
        if (
          appliedFilters.propertyType === 'Land / Plot' ||
          appliedFilters.propertyType === 'Terrain / Parcelle' ||
          appliedFilters.propertyType === 'Terrain' ||
          appliedFilters.propertyType === 'Parcelle'
        ) {
          const isLand =
            prop.type === 'Land / Plot' ||
            prop.type === 'Terrain / Parcelle' ||
            prop.type.toLowerCase().includes('terrain') ||
            prop.type.toLowerCase().includes('parcelle') ||
            prop.type.toLowerCase().includes('land') ||
            prop.type.toLowerCase().includes('plot');
          if (!isLand) return false;
        } else if (prop.type !== appliedFilters.propertyType) {
          return false;
        }
      }

      // Price filter
      if (appliedFilters.priceRange === 'under-700k' && prop.rawPrice >= 700000) {
        return false;
      }
      if (
        appliedFilters.priceRange === '700k-1m' &&
        (prop.rawPrice < 700000 || prop.rawPrice > 1000000)
      ) {
        return false;
      }
      if (appliedFilters.priceRange === '1m-plus' && prop.rawPrice < 1000000) {
        return false;
      }

      const isLandProperty =
        prop.type === 'Land / Plot' ||
        prop.type === 'Terrain / Parcelle' ||
        (prop.beds === 0 && prop.baths === 0);

      // Beds filter (ignore for Land / Plot)
      if (!isLandProperty && appliedFilters.beds !== 'Any') {
        const reqBeds = parseInt(appliedFilters.beds, 10);
        if (prop.beds < reqBeds) return false;
      }

      // Baths filter (ignore for Land / Plot)
      if (!isLandProperty && appliedFilters.baths !== 'Any') {
        const reqBaths = parseInt(appliedFilters.baths, 10);
        if (prop.baths < reqBaths) return false;
      }

      return true;
    });
  }, [propertiesList, appliedFilters]);

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
    const el = document.getElementById('featured-properties');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    const defaultFilters: SearchFilters = {
      tab: 'Buy',
      country: 'all',
      location: '',
      propertyType: 'Any Type',
      priceRange: '$Min - $Max',
      beds: 'Any',
      baths: 'Any',
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const handleExploreProperties = () => {
    const el = document.getElementById('featured-properties');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterStatus = (status: 'all' | 'FOR SALE' | 'FOR RENT') => {
    if (status === 'FOR SALE') {
      setFilters((prev) => ({ ...prev, tab: 'Buy' }));
      setAppliedFilters((prev) => ({ ...prev, tab: 'Buy' }));
      setActiveNavTab('buy');
    } else if (status === 'FOR RENT') {
      setFilters((prev) => ({ ...prev, tab: 'Rent' }));
      setAppliedFilters((prev) => ({ ...prev, tab: 'Rent' }));
      setActiveNavTab('rent');
    } else {
      handleResetFilters();
      setActiveNavTab('listings');
    }
  };

  const handleFooterNavigate = (section: string) => {
    if (section === 'Home') {
      setActiveNavTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'Buy') {
      setActiveNavTab('buy');
      handleFilterStatus('FOR SALE');
      const el = document.getElementById('featured-properties');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'Rent') {
      setActiveNavTab('rent');
      handleFilterStatus('FOR RENT');
      const el = document.getElementById('featured-properties');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'Listings') {
      setIsAllPropertiesOpen(true);
    } else if (section === 'About Us' || section === 'Our Agents') {
      setActiveNavTab('aboutUs');
      const el = document.getElementById('why-choose-us');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'Contact Us') {
      setActiveNavTab('contact');
      const el = document.getElementById('footer-contact');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsAllPropertiesOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#101827] flex flex-col font-sans selection:bg-[#082653] selection:text-white">
      {/* 1. Announcement Bar with EN-FR switcher */}
      <AnnouncementBar
        onOpenValuation={() => setIsValuationOpen(true)}
        lang={lang}
        setLang={setLang}
        t={t.announcement}
      />

      {/* 2. Navigation Bar */}
      <Navbar
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        onOpenListProperty={() => setIsListPropertyOpen(true)}
        onFilterStatus={handleFilterStatus}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenFavorites={() => {
          setAllPropertiesInitialFilter('all');
          setIsAllPropertiesOpen(true);
        }}
        onOpenMyListings={handleOpenMyListings}
        lang={lang}
        setLang={setLang}
        t={t.nav}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 3. Hero Section */}
        <HeroSection
          onExploreProperties={handleExploreProperties}
          onHowItWorks={() => setIsHowItWorksOpen(true)}
          t={t.hero}
        />

        {/* 4. Property Search Panel with Country Filter (overlapping lower hero) */}
        <PropertySearch
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onTabChange={(tab) => {
            if (tab === 'Buy') handleFilterStatus('FOR SALE');
            else if (tab === 'Rent') handleFilterStatus('FOR RENT');
          }}
          onOpenValuation={() => setIsValuationOpen(true)}
          lang={lang}
          t={t.search}
        />

        {/* 5. Benefits Row */}
        <BenefitsRow t={t.benefits} />

        {/* 6. Featured Properties (4 cards grid with working carousel control) */}
        <FeaturedProperties
          properties={displayedProperties}
          favorites={activeFavorites}
          onToggleFavorite={handleToggleFavorite}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
          onViewAll={() => {
            setAllPropertiesInitialFilter('all');
            setIsAllPropertiesOpen(true);
          }}
          onResetFilters={handleResetFilters}
          t={t.featured}
          currentUserId={user?.uid}
          onDeleteProperty={handleDeleteProperty}
        />

        {/* 7. Home Valuation Promotional Banner */}
        <HomeValuationBanner
          onOpenValuation={() => setIsValuationOpen(true)}
          t={t.valuationBanner}
        />

        {/* 8. Why Choose Us (4 columns) */}
        <WhyChooseUs t={t.whyChooseUs} />

        {/* 9. Newsletter Subscription */}
        <Newsletter t={t.newsletter} />
      </main>

      {/* 10. Multi-column Footer */}
      <Footer
        onNavigate={handleFooterNavigate}
        onOpenValuation={() => setIsValuationOpen(true)}
        lang={lang}
        t={t.footer}
        onTriggerAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        isFavorite={selectedProperty ? activeFavorites.has(selectedProperty.id) : false}
        onToggleFavorite={handleToggleFavorite}
        t={t.modals.propertyDetail}
        featuredT={t.featured}
        currentUserId={user?.uid}
        onDeleteProperty={handleDeleteProperty}
        lang={lang}
      />

      <ValuationModal
        isOpen={isValuationOpen}
        onClose={() => setIsValuationOpen(false)}
        t={t.modals.valuation}
      />

      <ListPropertyModal
        isOpen={isListPropertyOpen}
        onClose={() => setIsListPropertyOpen(false)}
        onAddProperty={handleAddProperty}
        lang={lang}
        t={t.modals.listProperty}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onExplore={handleExploreProperties}
        t={t.modals.howItWorks}
      />

      <AllPropertiesModal
        isOpen={isAllPropertiesOpen}
        onClose={() => setIsAllPropertiesOpen(false)}
        properties={propertiesList}
        favorites={activeFavorites}
        onToggleFavorite={handleToggleFavorite}
        onSelectProperty={(prop) => {
          setIsAllPropertiesOpen(false);
          setSelectedProperty(prop);
        }}
        lang={lang}
        t={t.modals.allProperties}
        featuredT={t.featured}
        searchT={t.search}
        currentUserId={user?.uid}
        currentUserEmail={user?.email || undefined}
        onDeleteProperty={handleDeleteProperty}
        initialFilter={allPropertiesInitialFilter}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        lang={lang}
      />

      {/* Hidden Master Admin Modal for the Owner */}
      <HiddenAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        properties={propertiesList}
        onAddProperty={handleAddProperty}
        onDeleteProperty={handleDeleteProperty}
        onSelectProperty={(prop) => {
          setSelectedProperty(prop);
        }}
        isAdminAuthenticated={isAdminAuthenticated}
        setIsAdminAuthenticated={setIsAdminAuthenticated}
        lang={lang}
      />

      {/* Discreet Floating Admin Indicator (Only visible if owner is authenticated) */}
      {isAdminAuthenticated && (
        <aside aria-label="Administration" className="fixed bottom-4 left-4 z-40 bg-[#020e20]/95 backdrop-blur-md text-white border border-amber-500/40 rounded-full px-3.5 py-1.5 shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 select-none">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-bold text-amber-300 text-[11px] tracking-wide">
            Console Propriétaire
          </span>
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Ouvrir
          </button>
          <button
            onClick={() => {
              setIsAdminAuthenticated(false);
              localStorage.removeItem('homeluxe_admin_auth');
              sessionStorage.removeItem('homeluxe_admin_auth');
              setIsAdminModalOpen(false);
            }}
            className="text-slate-400 hover:text-red-400 text-[11px] transition-colors cursor-pointer px-1"
            title="Verrouiller la session confidentielle"
          >
            🔒
          </button>
        </aside>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#082653] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-3 border border-slate-700 max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}
    </div>
  );
}
