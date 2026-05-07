"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, UserProfile } from "@/context/userService";

type AuthContextType = {
  user: User | null;
  uid: string | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loggingOut: boolean;
  setLoggingOut: (v: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  uid: null,
  profile: null,
  isAdmin: false,
  loading: true,
  loggingOut: false,
  setLoggingOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
  }>({ user: null, profile: null, loading: true });

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      unsubscribeProfile?.();
      unsubscribeProfile = null;

      if (!u) {
        setAuthState({ user: null, profile: null, loading: false });
        setLoggingOut(false);
        return;
      }
      unsubscribeProfile = getUserProfile(u.uid, (data) => {
        setAuthState({ user: u, profile: data, loading: false });
      });
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile?.();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        uid: authState.user?.uid ?? null,
        profile: authState.profile,
        isAdmin: authState.profile?.isAdmin === true,
        loading: authState.loading,
        loggingOut,
        setLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
