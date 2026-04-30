"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ErrorType = {
  message: string;
  code?: string;
};

type ErrorContextType = {
  error: ErrorType | null;
  setError: (error: ErrorType | null) => void;
  clearError: () => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<ErrorType | null>(null);

  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useGlobalError() {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error("useGlobalError must be used within ErrorProvider");
  return ctx;
}
