'use client';

/**
 * AuthContext — FLOW.AI
 *
 * Centralized Firebase Authentication layer.
 * Follows the same provider/hook pattern as LanguageContext.js.
 *
 * Provides:
 *   user            — Firebase User object, or null when signed out
 *   loading         — true while Firebase determines auth state on first load
 *   isAuthenticated — derived boolean (!!user); use this for gate checks
 *   signIn()        — triggers Google Sign-In popup
 *   signOut()       — signs the current user out
 *
 * Usage in any client component:
 *   import { useAuth } from '@/context/AuthContext';
 *   const { isAuthenticated, loading, signIn, signOut, user } = useAuth();
 *
 * Architecture:
 *   FLOW.AI UI → useAuth() → AuthContext → firebase.js → Firebase SDK
 *
 * The chatbot (and any future gated feature) should check `isAuthenticated`
 * via useAuth() without importing Firebase APIs directly.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

// ---------------------------------------------------------------------------
// Context — default value mirrors the shape provided by AuthProvider
// ---------------------------------------------------------------------------
const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }) {
  /**
   * Initialize loading: true so that components waiting on auth state do not
   * flash an unauthenticated UI before Firebase has responded.
   * This is intentional and differs from LanguageContext where a default value
   * ('en') is always safe to render on the server without hydration issues.
   *
   * loading becomes false exactly once — after onAuthStateChanged fires the
   * first time (either with a user or with null).
   */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth state changes.
    // onAuthStateChanged returns an unsubscribe function for cleanup.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ---------------------------------------------------------------------------
  // signIn — Google OAuth popup
  // ---------------------------------------------------------------------------
  const signIn = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will update `user` state automatically after success.
    } catch (error) {
      // Ignore popup-closed-by-user errors; surface anything unexpected.
      if (error.code !== 'auth/popup-closed-by-user' &&
          error.code !== 'auth/cancelled-popup-request') {
        console.error('[AuthContext] signIn error:', error.code, error.message);
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // signOut
  // ---------------------------------------------------------------------------
  const signOutUser = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set user → null automatically.
    } catch (error) {
      console.error('[AuthContext] signOut error:', error.message);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Context value — stable shape for consumers
  // ---------------------------------------------------------------------------
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signOut: signOutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useAuth() {
  return useContext(AuthContext);
}
