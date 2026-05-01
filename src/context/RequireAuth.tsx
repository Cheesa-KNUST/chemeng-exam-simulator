"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Loader from "@/components/ui/Loader";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (loading) return;

      if (!user) {
        router.replace("/");
        return;
      }

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          router.replace("/onboarding");
        } else {
          setCheckingProfile(false);
        }
      } catch (err) {
        console.error(err);
        router.replace("/");
      }
    };

    checkUserProfile();
  }, [user, loading, router]);

  if (loading || checkingProfile) {
    return <Loader label="Loading session..." fullPage />;
  }

  return <>{children}</>;
}
