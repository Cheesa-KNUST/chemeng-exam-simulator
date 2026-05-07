"use client";

import { useIsMounted } from "@/hooks/useIsMounted";

type Props = {
  children: React.ReactNode;
  height?: string;
};

export default function ChartWrapper({ children, height = "h-72" }: Props) {
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div
        className={`${height} w-full bg-slate-800/40 rounded-xl animate-pulse`}
      />
    );
  }

  return <>{children}</>;
}
