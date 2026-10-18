import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Language } from '../i18n/translations.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, lang }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err: unknown) {
      const code = err instanceof Error ? err.message : '';
      if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
        setErrorMsg(lang === 'fr' ? 'Email ou mot de passe incorrect.' : 'Invalid email or password.');
      } else if (code.includes('email-already-in-use')) {
        setErrorMsg(lang === 'fr' ? 'Un compte existe déjà avec cette adresse email.' : 'An account already exists with this email.');
      } else if (code.includes('weak-password')) {
        setErrorMsg(lang === 'fr' ? 'Le mot de passe doit comporter au moins 6 caractères.' : 'Password should be at least 6 characters.');
      } else {
        setErrorMsg(lang === 'fr' ? 'Une erreur est survenue lors de la connexion.' : 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(lang === 'fr' ? 'Échec de la connexion avec Google.' : 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await signInAsGuest();
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(lang === 'fr' ? 'Impossible de se connecter en invité.' : 'Failed to sign in as guest.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#082653] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            {isRegister
              ? (lang === 'fr' ? 'Créer un compte Homeluxe' : 'Create a Homeluxe Account')
              : (lang === 'fr' ? 'Connexion à votre espace' : 'Welcome to Homeluxe')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'fr'
              ? 'Sauvegardez vos favoris et gérez vos publications immobilières mondiales.'
              : 'Save favorites and manage your global real estate listings.'}
          </p>
        </div>

        {/* Social Google Login Button */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-2.5 transition-colors shadow-2xs cursor-pointer mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>
            {lang === 'fr' ? 'Continuer avec Google' : 'Continue with Google'}
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[11px] text-slate-400 uppercase font-medium">
            {lang === 'fr' ? 'ou par email' : 'or with email'}
          </span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {lang === 'fr' ? 'Nom complet' : 'Full Name'}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={lang === 'fr' ? 'Alexandre Dumas' : 'John Doe'}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#082653]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              {lang === 'fr' ? 'Adresse email' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#082653]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              {lang === 'fr' ? 'Mot de passe' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#082653]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#082653] hover:bg-[#16477F] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer mt-2"
          >
            {loading
              ? (lang === 'fr' ? 'Chargement...' : 'Loading...')
              : isRegister
              ? (lang === 'fr' ? 'Créer mon compte' : 'Create Account')
              : (lang === 'fr' ? 'Se connecter' : 'Sign In')}
          </button>
        </form>

        {/* Toggle Sign in / Register */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
            }}
            className="text-xs text-[#1D58A7] hover:underline font-medium cursor-pointer"
          >
            {isRegister
              ? (lang === 'fr' ? 'Déjà un compte ? Connectez-vous' : 'Already have an account? Sign In')
              : (lang === 'fr' ? 'Pas encore de compte ? Créer un compte' : "Don't have an account? Sign Up")}
          </button>

          <button
            type="button"
            onClick={handleGuest}
            disabled={loading}
            className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            {lang === 'fr' ? 'Accéder rapidement en mode Invité' : 'Quick access as Guest'}
          </button>
        </div>
      </div>
    </div>
  );
};
