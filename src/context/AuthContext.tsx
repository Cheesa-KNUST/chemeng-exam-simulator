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
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  uid: null,
  profile: null,
  isAdmin: false,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);

      unsubscribeProfile?.();
      unsubscribeProfile = null;

      if (!u) {
        setProfile(null);
        setLoading(false);
        return;
      }

      unsubscribeProfile = getUserProfile(u.uid, (data) => {
        setProfile(data);
        setLoading(false);
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
        user,
        uid: user?.uid ?? null,
        profile,
        isAdmin: profile?.isAdmin === true,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
