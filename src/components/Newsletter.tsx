import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { Translations } from '../i18n/translations.ts';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';

interface NewsletterProps {
  t: Translations['newsletter'];
}

export const Newsletter: React.FC<NewsletterProps> = ({ t }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorMessage(t.error);
      return;
    }

    try {
      const subId = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
      await setDoc(doc(db, 'newsletter_subscribers', subId), {
        email: email.trim(),
        subscribedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Newsletter firestore error:', err);
    }

    setStatus('success');
    setEmail('');
    setTimeout(() => {
      setStatus('idle');
    }, 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-[#EAF3FF] rounded-2xl border border-[#D5E5FA] p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left Side Info */}
        <div className="flex items-center gap-4">
          {/* Circular Dark Navy Icon with Mail Outline */}
          <div className="w-11 h-11 rounded-full bg-[#082653] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Mail className="w-5 h-5" strokeWidth={1.8} />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#101827] leading-snug">
              {t.title}
            </h3>
            <p className="text-xs text-slate-600 leading-normal mt-0.5">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full lg:w-auto">
          {status === 'success' ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#26965A] bg-white/80 px-4 py-2.5 rounded-lg border border-emerald-200">
              <CheckCircle className="w-4 h-4" />
              <span>{t.success}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder={t.placeholder}
                  className="w-full sm:w-72 lg:w-80 px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#082653] focus:border-[#082653]"
                  required
                />
                {status === 'error' && (
                  <span className="absolute -bottom-4 left-0 text-[10px] text-red-500">
                    {errorMessage}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="bg-[#082653] hover:bg-[#16477F] text-white text-xs font-semibold px-6 py-2.5 rounded-md transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                {t.button}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
