// src/context/AuthContext.jsx
// Provides Firebase auth state and helper functions to the entire component tree.
// Wrap your app root with <AuthProvider> (done in main.jsx).

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // true until Firebase responds

  // Subscribe to Firebase auth state (persists across reloads automatically)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch profile data
        const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data());
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe; // cleanup on unmount
  }, []);

  // ── Auth helpers ────────────────────────────────────────────────────────────

  /** Sign in with email + password */
  async function signInWithEmail(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  /**
   * Register with email + password.
   * @param {string} email
   * @param {string} password
   * @param {string} displayName - shown in the app (e.g. "Alex Johnson")
   * @param {object} additionalData - branch, gradYear, etc.
   * @param {boolean} sendVerification - send verification email after register
   */
  async function signUpWithEmail(email, password, displayName = '', additionalData = {}, sendVerification = true) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email,
      displayName,
      ...additionalData,
      createdAt: new Date().toISOString(),
    });

    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    if (sendVerification) {
      await sendEmailVerification(cred.user);
    }
    return cred.user;
  }

  /** Sign in / register via Google popup */
  async function signInWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  }

  /** Sign out the current user */
  async function logout() {
    await signOut(auth);
  }

  // ── Context value ───────────────────────────────────────────────────────────
  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
