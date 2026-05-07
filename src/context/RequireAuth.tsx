"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/ui/Loader";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, loggingOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/");
      return;
    }

    if (profile === null) {
      router.replace("/onboarding");
    }
  }, [user, profile, loading, router]);

  if (loggingOut) {
    return <Loader label="Logging out..." fullPage size="lg" />;
  }

  if (loading || (user && profile === null)) {
    return <Loader label="Loading session..." fullPage />;
  }

  if (!user) return null;

  return <>{children}</>;
}
