"use client";

import { useGlobalError } from "@/context/ErrorContext";

export function GlobalErrorDisplay() {
  const { error, clearError } = useGlobalError();

  if (!error) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg z-50">
      <p className="mb-2">{error.message}</p>
      <button onClick={clearError} className="text-sm underline">
        Dismiss
      </button>
    </div>
  );
}
