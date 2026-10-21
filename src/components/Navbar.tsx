import React, { useState } from 'react';
import { ChevronDown, Menu, X, User as UserIcon, LogOut, Heart, Award, Globe } from 'lucide-react';
import { Language, Translations } from '../i18n/translations.ts';
import { useAuth } from '../contexts/AuthContext.tsx';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenListProperty: () => void;
  onFilterStatus?: (status: 'all' | 'FOR SALE' | 'FOR RENT') => void;
  onOpenAuth: () => void;
  onOpenFavorites?: () => void;
  onOpenMyListings?: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations['nav'];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenListProperty,
  onFilterStatus,
  onOpenAuth,
  onOpenFavorites,
  onOpenMyListings,
  lang,
  setLang,
  t,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);
  const [listingsDropdownOpen, setListingsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (tabKey: 'home' | 'buy' | 'sell' | 'rent' | 'listings' | 'aboutUs' | 'blog' | 'contact') => {
    setActiveTab(tabKey);
    setMobileMenuOpen(false);

    if ((tabKey === 'buy' || tabKey === 'sell') && onFilterStatus) {
      onFilterStatus('FOR SALE');
      const el = document.getElementById('featured-properties');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (tabKey === 'rent' && onFilterStatus) {
      onFilterStatus('FOR RENT');
      const el = document.getElementById('featured-properties');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (tabKey === 'listings' && onFilterStatus) {
      onFilterStatus('all');
      const el = document.getElementById('featured-properties');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (tabKey === 'home') {
      onFilterStatus?.('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabKey === 'aboutUs' || tabKey === 'contact') {
      const el = document.getElementById(tabKey === 'aboutUs' ? 'why-choose-us' : 'footer-contact');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[70px]">
          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            {/* Geometric House Outline Mark */}
            <div className="w-8 h-8 rounded border-2 border-[#082653] flex items-center justify-center relative p-1 transition-transform group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#082653"
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
              <span className="font-extrabold text-[#082653] text-[17px] tracking-tight leading-none">
                HOMELUXE
              </span>
              <span className="text-[9px] font-semibold text-slate-500 tracking-[0.25em] leading-tight uppercase mt-0.5">
                {lang === 'fr' ? 'IMMOBILIER' : 'REAL ESTATE'}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors relative py-1 cursor-pointer ${
                activeTab === 'home'
                  ? 'text-[#082653] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#082653]'
                  : 'hover:text-[#082653]'
              }`}
            >
              {t.home}
            </button>

            <div
              className="relative"
              onMouseEnter={() => setBuyDropdownOpen(true)}
              onMouseLeave={() => setBuyDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('buy')}
                className={`flex items-center gap-1 transition-colors relative py-1 cursor-pointer ${
                  activeTab === 'buy'
                    ? 'text-[#082653] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#082653]'
                    : 'hover:text-[#082653]'
                }`}
              >
                <span>{t.buy}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </button>

              {buyDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <button
                    onClick={() => handleNavClick('buy')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#082653]"
                  >
                    {t.residential}
                  </button>
                  <button
                    onClick={() => handleNavClick('buy')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#082653]"
                  >
                    {t.luxuryEstates}
                  </button>
                  <button
                    onClick={() => handleNavClick('buy')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#082653]"
                  >
                    {t.condos}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('sell')}
              className={`transition-colors relative py-1 cursor-pointer ${
                activeTab === 'sell'
                  ? 'text-[#082653] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#082653]'
                  : 'hover:text-[#082653]'
              }`}
            >
              {t.sell}
            </button>

            <button
              onClick={() => handleNavClick('rent')}
              className={`transition-colors relative py-1 cursor-pointer ${
                activeTab === 'rent'
                  ? 'text-[#082653] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#082653]'
                  : 'hover:text-[#082653]'
              }`}
            >
              {t.rent}
            </button>

            <div
              className="relative"
              onMouseEnter={() => setListingsDropdownOpen(true)}
              onMouseLeave={() => setListingsDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('listings')}
                className={`flex items-center gap-1 transition-colors relative py-1 cursor-pointer ${
                  activeTab === 'listings'
                    ? 'text-[#082653] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#082653]'
                    : 'hover:text-[#082653]'
                }`}
              >
                <span>{t.listings}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {listingsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <button
                    onClick={() => handleNavClick('listings')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#082653]"
                  >
                    {t.allListings}
                  </button>
                  <button
                    onClick={() => handleNavClick('buy')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#082653]"
                  >
                    {t.forSaleListings}
                  </button>
                  <button
                    onClick={() => handleNavClick('rent')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#082653]"
                  >
                    {t.forRentListings}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('aboutUs')}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'aboutUs'
                  ? 'text-[#082653] font-semibold'
                  : 'hover:text-[#082653]'
              }`}
            >
              {t.aboutUs}
            </button>

            <button
              onClick={() => handleNavClick('blog')}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'blog'
                  ? 'text-[#082653] font-semibold'
                  : 'hover:text-[#082653]'
              }`}
            >
              {t.blog}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'contact'
                  ? 'text-[#082653] font-semibold'
                  : 'hover:text-[#082653]'
              }`}
            >
              {t.contact}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 rounded-full border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50 cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#082653] text-white flex items-center justify-center text-xs font-bold">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {user.displayName || (user.isAnonymous ? (lang === 'fr' ? 'Invité' : 'Guest') : user.email?.split('@')[0])}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.displayName || (lang === 'fr' ? 'Utilisateur Homeluxe' : 'Homeluxe User')}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {user.email || (lang === 'fr' ? 'Mode invité' : 'Guest mode')}
                      </p>
                    </div>

                    {onOpenFavorites && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenFavorites();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer text-left"
                      >
                        <Heart className="w-3.5 h-3.5 text-red-500" />
                        <span>{t.myFavorites}</span>
                      </button>
                    )}

                    {onOpenMyListings && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenMyListings();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-amber-800 hover:bg-amber-50 cursor-pointer text-left"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{lang === 'fr' ? 'Mes annonces publiées' : 'My published listings'}</span>
                      </button>
                    )}

                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 cursor-pointer text-left border-t border-slate-100"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.signOut}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#082653] hover:text-[#16477F] px-3.5 py-2 border border-slate-200 hover:border-[#082653] rounded-md transition-colors cursor-pointer bg-white"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t.signIn}</span>
              </button>
            )}

            {/* Desktop Language Switcher (FR / EN) */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  lang === 'fr'
                    ? 'bg-[#082653] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Passer en Français"
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#082653] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            <button
              onClick={onOpenListProperty}
              className="bg-[#082653] hover:bg-[#16477F] text-white text-[13px] font-semibold px-4.5 py-2.5 rounded-md transition-colors shadow-sm cursor-pointer"
            >
              {t.listProperty}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden gap-1.5">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-7 h-7 rounded-full bg-[#082653] text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                  aria-label="Menu utilisateur"
                >
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.displayName || (lang === 'fr' ? 'Utilisateur Homeluxe' : 'Homeluxe User')}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {user.email || (lang === 'fr' ? 'Mode invité' : 'Guest mode')}
                      </p>
                    </div>

                    {onOpenFavorites && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenFavorites();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer text-left"
                      >
                        <Heart className="w-3.5 h-3.5 text-red-500" />
                        <span>{t.myFavorites}</span>
                      </button>
                    )}

                    {onOpenMyListings && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenMyListings();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-amber-800 hover:bg-amber-50 cursor-pointer text-left"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{lang === 'fr' ? 'Mes annonces publiées' : 'My published listings'}</span>
                      </button>
                    )}

                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 cursor-pointer text-left border-t border-slate-100"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.signOut}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-xs font-semibold px-2.5 py-1 text-[#082653] border border-slate-200 rounded"
              >
                {t.signIn}
              </button>
            )}

            {/* Mobile Language Switcher (FR / EN) */}
            <div className="flex items-center bg-slate-100 rounded border border-slate-200 p-0.5">
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                  lang === 'fr' ? 'bg-[#082653] text-white' : 'text-slate-600'
                }`}
                title="Passer en Français"
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                  lang === 'en' ? 'bg-[#082653] text-white' : 'text-slate-600'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {/* Mobile Drawer Language Row */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 mb-2">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#082653]" />
              <span>{lang === 'fr' ? 'Langue du site' : 'Site Language'}</span>
            </span>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-md border border-slate-200">
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-2 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                  lang === 'fr' ? 'bg-[#082653] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Français
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                  lang === 'en' ? 'bg-[#082653] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {user && (
            <div className="p-3 bg-slate-50 rounded-lg space-y-2 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{user.displayName || 'Utilisateur'}</p>
                  <p className="text-[10px] text-slate-500">{user.email || 'Invité'}</p>
                </div>
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                  }}
                  className="text-xs text-red-600 font-semibold cursor-pointer"
                >
                  {t.signOut}
                </button>
              </div>
              <div className="pt-2 border-t border-slate-200/70 flex items-center gap-2">
                {onOpenFavorites && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenFavorites();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-red-500" />
                    <span>{t.myFavorites}</span>
                  </button>
                )}
                {onOpenMyListings && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenMyListings();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-amber-800 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lang === 'fr' ? 'Mes annonces' : 'My Listings'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {(
            [
              ['home', t.home],
              ['buy', t.buy],
              ['sell', t.sell],
              ['rent', t.rent],
              ['listings', t.listings],
              ['aboutUs', t.aboutUs],
              ['blog', t.blog],
              ['contact', t.contact],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleNavClick(key)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === key
                  ? 'bg-[#082653] text-white'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}

          {!user && (
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full border border-[#082653] text-[#082653] text-center py-2 rounded-md text-xs font-semibold mb-2"
              >
                {t.signIn}
              </button>
            </div>
          )}

          <div className="pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenListProperty();
              }}
              className="w-full bg-[#082653] text-white text-center py-2.5 rounded-md text-sm font-semibold"
            >
              {t.listProperty}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
