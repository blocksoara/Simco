import React, { useState, useEffect } from 'react';
import {
  X,
  Home,
  TrendingUp,
  CheckCircle,
  Calculator,
  MapPin,
  Globe,
  Coins,
  Building2,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { Translations, Language, getAllCountriesList } from '../i18n/translations.ts';
import {
  CURRENCIES,
  getDefaultCurrencyForCountry,
  getCurrency,
} from '../data/currencies.ts';
import {
  calculatePropertyValuation,
  ValuationResult,
} from '../utils/valuation.ts';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';

interface ValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations['modals']['valuation'];
  lang?: Language;
  defaultCountry?: string;
}

export const ValuationModal: React.FC<ValuationModalProps> = ({
  isOpen,
  onClose,
  t,
  lang = 'fr',
  defaultCountry,
}) => {
  const countryList = getAllCountriesList(lang);

  const initialCountry =
    defaultCountry && defaultCountry !== 'all'
      ? defaultCountry
      : lang === 'fr'
      ? 'Congo'
      : 'United States';

  const [country, setCountry] = useState(initialCountry);
  const [currency, setCurrency] = useState(() => getDefaultCurrencyForCountry(initialCountry));
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState('Single Family Home');
  const [surface, setSurface] = useState('150');
  const [surfaceUnit, setSurfaceUnit] = useState<'m2' | 'sqft'>(() =>
    initialCountry === 'United States' ? 'sqft' : 'm2'
  );
  const [beds, setBeds] = useState('3');
  const [baths, setBaths] = useState('2');
  const [condition, setCondition] = useState<'standard' | 'renovated' | 'luxury'>('standard');

  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');

  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sync default country if prop changes
  useEffect(() => {
    if (defaultCountry && defaultCountry !== 'all') {
      setCountry(defaultCountry);
      const suggestedCurrency = getDefaultCurrencyForCountry(defaultCountry);
      setCurrency(suggestedCurrency);
      setSurfaceUnit(defaultCountry === 'United States' ? 'sqft' : 'm2');
    }
  }, [defaultCountry]);

  if (!isOpen) return null;

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const suggestedCurrency = getDefaultCurrencyForCountry(newCountry);
    setCurrency(suggestedCurrency);
    if (newCountry === 'United States') {
      setSurfaceUnit('sqft');
      if (surface === '150') setSurface('1600');
    } else {
      setSurfaceUnit('m2');
      if (surface === '1600') setSurface('150');
    }
    // If an estimate is already shown, recalculate live
    if (valuationResult) {
      const res = calculatePropertyValuation({
        country: newCountry,
        city,
        propertyType,
        surface: parseFloat(surface) || 120,
        surfaceUnit: newCountry === 'United States' ? 'sqft' : 'm2',
        beds: parseInt(beds, 10) || 3,
        baths: parseInt(baths, 10) || 2,
        condition,
        currencyCode: suggestedCurrency,
      });
      setValuationResult(res);
    }
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    if (valuationResult) {
      const res = calculatePropertyValuation({
        country,
        city,
        propertyType,
        surface: parseFloat(surface) || 120,
        surfaceUnit,
        beds: parseInt(beds, 10) || 3,
        baths: parseInt(baths, 10) || 2,
        condition,
        currencyCode: newCurrency,
      });
      setValuationResult(res);
    }
  };

  const handleCalculateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSurface = parseFloat(surface) || (surfaceUnit === 'sqft' ? 1500 : 120);

    const result = calculatePropertyValuation({
      country,
      city,
      propertyType,
      surface: parsedSurface,
      surfaceUnit,
      beds: parseInt(beds, 10) || 3,
      baths: parseInt(baths, 10) || 2,
      condition,
      currencyCode: currency,
    });

    setValuationResult(result);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, 'valuation_requests', `val-${Date.now()}`), {
        country,
        city: city.trim(),
        address: address.trim(),
        propertyType,
        surface: parseFloat(surface) || 0,
        surfaceUnit,
        beds: parseInt(beds, 10) || 0,
        baths: parseInt(baths, 10) || 0,
        condition,
        currency,
        estimatedAverage: valuationResult?.estimatedAverage || 0,
        estimatedLow: valuationResult?.estimatedLow || 0,
        estimatedHigh: valuationResult?.estimatedHigh || 0,
        formattedAverage: valuationResult?.formattedAverage || '',
        formattedRange: valuationResult?.formattedRange || '',
        formattedPricePerUnit: valuationResult?.formattedPricePerUnit || '',
        ownerName: ownerName.trim(),
        ownerEmail: ownerEmail.trim(),
        ownerPhone: ownerPhone.trim(),
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Error saving valuation request to Firestore:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setAddress('');
    setCity('');
    setValuationResult(null);
    setSubmitted(false);
    onClose();
  };

  const isLand =
    propertyType === 'Land / Plot' ||
    propertyType.toLowerCase().includes('terrain') ||
    propertyType.toLowerCase().includes('parcelle');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-5 sm:p-7 relative"
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#082653] shrink-0 shadow-2xs">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#082653] tracking-tight">
              {t.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.subtitle}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-[#26965A] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              {t.successTitle}
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {t.successDesc}{' '}
              {city || country ? (
                <span className="font-semibold text-slate-800">
                  ({[city, country].filter(Boolean).join(', ')})
                </span>
              ) : null}
            </p>
            <div className="pt-3">
              <button
                onClick={handleReset}
                className="bg-[#082653] text-white text-xs font-bold px-7 py-3 rounded-xl cursor-pointer hover:bg-[#16477F] transition-all shadow-sm"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Main Form */}
            <form onSubmit={handleCalculateEstimate} className="space-y-4">
              {/* Row 1: Geographic Country & Currency (The core user request) */}
              <div className="p-4 bg-gradient-to-r from-blue-50/70 via-slate-50 to-blue-50/40 rounded-xl border border-blue-100/80 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#082653] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#1D58A7]" />
                    Localisation géographique & Devise du calcul
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Country Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.countryLabel}
                    </label>
                    <div className="relative">
                      <select
                        value={country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#082653] cursor-pointer"
                      >
                        {countryList.map((c) => (
                          <option key={c.value} value={c.value}>
                            {lang === 'fr' ? c.labelFr : c.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Currency Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>{t.currencyLabel}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        (Auto-adaptée au pays)
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        value={currency}
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-[#082653] cursor-pointer"
                      >
                        {CURRENCIES.map((currOpt) => (
                          <option key={currOpt.code} value={currOpt.code}>
                            {lang === 'fr' ? currOpt.labelFr : currOpt.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* City / Area & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.cityLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={t.cityPlaceholder}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#082653]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.addressLabel}
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={t.addressPlaceholder}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#082653]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Property Type & Surface Area with Units */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Property Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.typeLabel}
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none"
                  >
                    <option value="Single Family Home">
                      {lang === 'fr' ? 'Maison individuelle' : 'Single Family Home'}
                    </option>
                    <option value="Condo / Apartment">
                      {lang === 'fr' ? 'Appartement / Condo' : 'Condo / Apartment'}
                    </option>
                    <option value="Luxury Villa">
                      {lang === 'fr' ? 'Villa de prestige / Domaine' : 'Luxury Villa / Estate'}
                    </option>
                    <option value="Coastal Villa">
                      {lang === 'fr' ? 'Villa côtière / Bord de l’eau' : 'Coastal Villa'}
                    </option>
                    <option value="Land / Plot">
                      {lang === 'fr' ? 'Terrain / Parcelle constructible' : 'Land / Buildable Plot'}
                    </option>
                  </select>
                </div>

                {/* Surface area & Unit selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>{t.surfaceLabel}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Unité : {surfaceUnit === 'm2' ? 'm²' : 'sq ft'}
                    </span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      required
                      min="5"
                      value={surface}
                      onChange={(e) => setSurface(e.target.value)}
                      placeholder={surfaceUnit === 'm2' ? '150' : '1600'}
                      className="flex-1 p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none"
                    />
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSurfaceUnit('m2')}
                        className={`px-2.5 py-1.5 text-xs font-bold rounded cursor-pointer transition-all ${
                          surfaceUnit === 'm2'
                            ? 'bg-[#082653] text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        m²
                      </button>
                      <button
                        type="button"
                        onClick={() => setSurfaceUnit('sqft')}
                        className={`px-2.5 py-1.5 text-xs font-bold rounded cursor-pointer transition-all ${
                          surfaceUnit === 'sqft'
                            ? 'bg-[#082653] text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        sq ft
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Rooms (if not bare land) & Standing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {!isLand && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.bedsLabel}
                      </label>
                      <select
                        value={beds}
                        onChange={(e) => setBeds(e.target.value)}
                        className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.bathsLabel}
                      </label>
                      <select
                        value={baths}
                        onChange={(e) => setBaths(e.target.value)}
                        className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
                      </select>
                    </div>
                  </>
                )}

                <div className={isLand ? 'sm:col-span-3' : ''}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.standingLabel}
                  </label>
                  <select
                    value={condition}
                    onChange={(e) =>
                      setCondition(e.target.value as 'standard' | 'renovated' | 'luxury')
                    }
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none font-medium"
                  >
                    <option value="standard">{t.standingStandard}</option>
                    <option value="renovated">{t.standingRenovated}</option>
                    <option value="luxury">{t.standingLuxury}</option>
                  </select>
                </div>
              </div>

              {/* Action Button: Calculate */}
              {!valuationResult && (
                <button
                  type="submit"
                  className="w-full bg-[#082653] hover:bg-[#16477F] text-white text-xs sm:text-sm font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>{t.calculateBtn}</span>
                </button>
              )}
            </form>

            {/* Calculated Result Display with Currency and Country Breakdown */}
            {valuationResult && (
              <div className="bg-gradient-to-br from-[#041a38] to-[#0a2e5c] text-white rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in">
                {/* Result Top Badge Row */}
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t.estimatedTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-white/15 px-2.5 py-0.5 rounded-full font-bold text-slate-200">
                      {country} • {valuationResult.currencyCode}
                    </span>
                    <span className="inline-flex items-center text-[11px] font-bold text-emerald-300">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                      {t.marketTrend}
                    </span>
                  </div>
                </div>

                {/* Big Estimated Price */}
                <div>
                  <h4 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    {valuationResult.formattedAverage}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-2">
                    <span>
                      <strong className="text-slate-100">{t.estimatedRangeTitle}</strong>{' '}
                      {valuationResult.formattedRange}
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-100">{t.pricePerUnitTitle}</strong>{' '}
                      {valuationResult.formattedPricePerUnit}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-300/80 italic border-t border-white/10 pt-2.5 leading-relaxed">
                  {t.disclaimer}
                </p>

                {/* Contact form to receive comprehensive report */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{t.sendDossierTitle}</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => setValuationResult(null)}
                      className="text-[11px] text-amber-300 hover:text-amber-200 font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t.recalculateBtn}</span>
                    </button>
                  </div>

                  <form onSubmit={handleFinalSubmit} className="space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder={t.namePlaceholder}
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="bg-white/95 border border-white/30 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none"
                      />
                      <input
                        type="email"
                        placeholder={t.emailPlaceholder}
                        required
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        className="bg-white/95 border border-white/30 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none"
                      />
                      <input
                        type="tel"
                        placeholder={t.phonePlaceholder}
                        required
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        className="bg-white/95 border border-white/30 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-amber-400 hover:bg-amber-300 text-[#082653] text-xs font-extrabold py-3 rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <span>
                        {isSubmitting ? 'Envoi du dossier...' : t.submitBtn}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
