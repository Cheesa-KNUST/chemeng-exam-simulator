"use client";

import RequireAuth from "@/context/RequireAuth";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
