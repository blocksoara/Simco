import React, { useState } from 'react';
import { X, Home, TrendingUp, CheckCircle, Calculator, MapPin } from 'lucide-react';
import { Translations } from '../i18n/translations.ts';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';

interface ValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations['modals']['valuation'];
}

export const ValuationModal: React.FC<ValuationModalProps> = ({ isOpen, onClose, t }) => {
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState('Single Family');
  const [beds, setBeds] = useState('3');
  const [baths, setBaths] = useState('2');
  const [approxSqft, setApproxSqft] = useState('2200');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [calculatedEstimate, setCalculatedEstimate] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCalculateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    const sqftNum = parseInt(approxSqft) || 2000;
    const baseRatePerSqft = propertyType === 'Condo' ? 420 : 390;
    const estimated = Math.round((sqftNum * baseRatePerSqft + 150000) / 5000) * 5000;
    setCalculatedEstimate(estimated);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'valuation_requests', `val-${Date.now()}`), {
        address,
        propertyType,
        beds,
        baths,
        approxSqft,
        ownerName,
        ownerEmail,
        ownerPhone,
        calculatedEstimate,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Error saving valuation request to Firestore:', err);
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setAddress('');
    setCalculatedEstimate(null);
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#EAF3FF] flex items-center justify-center text-[#082653]">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {t.title}
            </h3>
            <p className="text-xs text-slate-500">
              {t.subtitle}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-[#26965A] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              {t.successTitle}
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {t.successDesc} ({address})
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="bg-[#082653] text-white text-xs font-semibold px-6 py-2.5 rounded-lg cursor-pointer hover:bg-[#16477F]"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Step 1: Address and Specs */}
            <form onSubmit={handleCalculateEstimate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.addressLabel}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={t.addressPlaceholder}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#082653]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {t.typeLabel}
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  >
                    <option value="Single Family">Single Family Home</option>
                    <option value="Condo">Condo / Apt</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Luxury Villa">Luxury Villa</option>
                    <option value="Land / Plot">{t.landPlot}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {t.bedsLabel}
                  </label>
                  <select
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {t.bathsLabel}
                  </label>
                  <select
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {t.sqftLabel}
                  </label>
                  <input
                    type="number"
                    value={approxSqft}
                    onChange={(e) => setApproxSqft(e.target.value)}
                    placeholder="2200"
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {!calculatedEstimate && (
                <button
                  type="submit"
                  className="w-full bg-[#082653] hover:bg-[#16477F] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Calculator className="w-4 h-4" />
                  <span>{t.calculateBtn}</span>
                </button>
              )}
            </form>

            {/* Calculated Preview Box */}
            {calculatedEstimate && (
              <div className="bg-[#EAF3FF] rounded-xl p-4 border border-[#D0E3FA] space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-600 block">
                      {t.estimatedTitle}
                    </span>
                    <span className="text-2xl font-extrabold text-[#082653] tracking-tight">
                      ${calculatedEstimate.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center text-xs font-bold text-[#26965A]">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                      {t.marketTrend}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 italic border-t border-blue-200/60 pt-2">
                  {t.disclaimer}
                </p>

                {/* Final Contact Form to receive full report */}
                <form onSubmit={handleFinalSubmit} className="pt-2 space-y-3">
                  <h5 className="text-xs font-bold text-slate-900">
                    {t.sendDossierTitle}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder={t.namePlaceholder}
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder={t.emailPlaceholder}
                      required
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      className="bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder={t.phonePlaceholder}
                      required
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#082653] hover:bg-[#16477F] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {t.submitBtn}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
