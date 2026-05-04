"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/ui/Loader";

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(isAdmin ? "/admin" : "/student");
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return <Loader label="Checking session..." fullPage size="lg" />;
  }

  if (user) return null;

  return <>{children}</>;
}
