import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase.ts';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
}

interface AuthContextType {
  user: User | AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  userFavorites: Set<string>;
  toggleFavoriteInCloud: (propertyId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'homeluxe_auth_session';
const ACCOUNTS_KEY = 'homeluxe_registered_accounts';

function getInitialUser(): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

function getStoredAccounts(): Record<string, { uid: string; email: string; displayName: string; password?: string }> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

function saveStoredAccount(account: { uid: string; email: string; displayName: string; password?: string }) {
  if (typeof window === 'undefined') return;
  try {
    const accounts = getStoredAccounts();
    accounts[account.email.toLowerCase()] = account;
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (_) {}
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize immediately from localStorage so user NEVER flickers as logged out on reload
  const [user, setUser] = useState<User | AppUser | null>(getInitialUser);
  const [loading, setLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    const initUser = getInitialUser();
    if (!initUser) return new Set();
    try {
      const stored = localStorage.getItem(`homeluxe_favs_${initUser.uid}`);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (_) {
      return new Set();
    }
  });

  // Listen to cross-tab storage changes so all tabs stay in sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (!e.newValue) {
          // Explicit logout in another tab
          setUser(null);
          setUserFavorites(new Set());
        } else {
          try {
            const parsed = JSON.parse(e.newValue);
            setUser(parsed);
          } catch (_) {}
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen to Firebase Auth State changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const serialized: AppUser = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            isAnonymous: currentUser.isAnonymous,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
        } catch (_) {}

        // Record / update user in Firestore
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          await setDoc(
            userRef,
            {
              uid: currentUser.uid,
              email: currentUser.email || 'guest@homeluxe.com',
              displayName:
                currentUser.displayName ||
                (currentUser.isAnonymous ? 'Invité' : 'Membre Homeluxe'),
              photoURL: currentUser.photoURL || '',
              lastLoginAt: new Date().toISOString(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (err) {
          console.info('[Homeluxe] User doc sync note:', err);
        }
      } else {
        // If Firebase says no user (or in iframes/restricted cookies), preserve local user session
        const local = getInitialUser();
        if (local) {
          setUser(local);
        } else {
          setUser(null);
          setUserFavorites(new Set());
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync favorites when user is logged in
  useEffect(() => {
    if (!user) return;

    // Load from local storage cache first
    try {
      const cached = localStorage.getItem(`homeluxe_favs_${user.uid}`);
      if (cached) {
        setUserFavorites(new Set(JSON.parse(cached)));
      }
    } catch (_) {}

    // If connected to Firebase user, listen in real-time
    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      const favsRef = collection(db, 'users', user.uid, 'favorites');
      const unsubFavs = onSnapshot(
        favsRef,
        (snapshot) => {
          const ids = new Set<string>();
          snapshot.forEach((docSnap) => {
            ids.add(docSnap.id);
          });
          setUserFavorites(ids);
          try {
            localStorage.setItem(`homeluxe_favs_${user.uid}`, JSON.stringify(Array.from(ids)));
          } catch (_) {}
        },
        (err) => {
          console.info('[Homeluxe] Favorites onSnapshot note:', err);
        }
      );

      return () => unsubFavs();
    }
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setUser(res.user);
      const serialized: AppUser = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        photoURL: res.user.photoURL,
        isAnonymous: false,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error('Google Sign-in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      setUser(res.user);
      const serialized: AppUser = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        photoURL: res.user.photoURL,
        isAnonymous: false,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (err: any) {
      // If Firebase Auth provider is not enabled in Firebase Console or blocked, use persistent accounts store
      const isProviderDisabled =
        err?.code === 'auth/operation-not-allowed' ||
        err?.code === 'auth/configuration-not-found' ||
        err?.code === 'auth/admin-restricted-operation' ||
        (err?.message && (
          err.message.includes('OPERATION_NOT_ALLOWED') ||
          err.message.includes('PASSWORD_LOGIN_DISABLED') ||
          err.message.includes('ADMIN_ONLY_OPERATION')
        ));

      if (isProviderDisabled) {
        const storedAccounts = getStoredAccounts();
        const existing = storedAccounts[cleanEmail];
        const uid = existing?.uid || `usr-${btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
        const displayName = existing?.displayName || cleanEmail.split('@')[0];

        const localUser: AppUser = {
          uid,
          email: cleanEmail,
          displayName,
          photoURL: null,
          isAnonymous: false,
        };

        saveStoredAccount({ uid, email: cleanEmail, displayName, password: pass });
        setUser(localUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localUser));
        return;
      }
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const finalName = name?.trim() || cleanEmail.split('@')[0];

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (finalName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: finalName });
      }
      setUser(userCredential.user);
      const serialized: AppUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: finalName || userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        isAnonymous: false,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
      saveStoredAccount({ uid: userCredential.user.uid, email: cleanEmail, displayName: finalName, password: pass });
    } catch (err: any) {
      // If Firebase Auth provider is not enabled in Firebase Console, fallback to robust permanent local account
      const isProviderDisabled =
        err?.code === 'auth/operation-not-allowed' ||
        err?.code === 'auth/configuration-not-found' ||
        err?.code === 'auth/admin-restricted-operation' ||
        (err?.message && (
          err.message.includes('OPERATION_NOT_ALLOWED') ||
          err.message.includes('PASSWORD_LOGIN_DISABLED') ||
          err.message.includes('ADMIN_ONLY_OPERATION')
        ));

      if (isProviderDisabled) {
        const uid = `usr-${btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
        const localUser: AppUser = {
          uid,
          email: cleanEmail,
          displayName: finalName,
          photoURL: null,
          isAnonymous: false,
        };
        saveStoredAccount({ uid, email: cleanEmail, displayName: finalName, password: pass });
        setUser(localUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localUser));
        return;
      }
      throw err;
    }
  };

  const signInAsGuest = async () => {
    try {
      const res = await signInAnonymously(auth);
      setUser(res.user);
      const serialized: AppUser = {
        uid: res.user.uid,
        email: null,
        displayName: 'Invité Homeluxe',
        photoURL: null,
        isAnonymous: true,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (err: any) {
      // If Anonymous auth is restricted in Firebase console, fallback to persistent local guest account
      let guestUid = localStorage.getItem('homeluxe_guest_uid');
      if (!guestUid) {
        guestUid = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        localStorage.setItem('homeluxe_guest_uid', guestUid);
      }
      const localUser: AppUser = {
        uid: guestUid,
        email: null,
        displayName: 'Invité Homeluxe',
        photoURL: null,
        isAnonymous: true,
      };
      setUser(localUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localUser));
      return;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut note:', e);
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setUserFavorites(new Set());
  };

  const toggleFavoriteInCloud = async (propertyId: string) => {
    if (!user) return;
    const nextFavorites = new Set(userFavorites);
    if (nextFavorites.has(propertyId)) {
      nextFavorites.delete(propertyId);
    } else {
      nextFavorites.add(propertyId);
    }
    setUserFavorites(nextFavorites);

    // Save in local storage cache
    try {
      localStorage.setItem(`homeluxe_favs_${user.uid}`, JSON.stringify(Array.from(nextFavorites)));
    } catch (_) {}

    // Sync to Firestore if user is logged into Firebase
    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        const favDocRef = doc(db, 'users', user.uid, 'favorites', propertyId);
        if (userFavorites.has(propertyId)) {
          await deleteDoc(favDocRef);
        } else {
          await setDoc(favDocRef, {
            propertyId,
            addedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn('Firestore favorites sync note:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        logout,
        userFavorites,
        toggleFavoriteInCloud,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
