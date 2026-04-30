import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/40 border border-transparent dark:border-slate-700/50 p-6 ${className}`}
    >
      {children}
    </div>
  );
}
