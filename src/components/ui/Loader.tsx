type Props = {
  label?: string;
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
};

const sizes = {
  sm: "w-4 h-4 border-2",
  md: "w-7 h-7 border-2",
  lg: "w-10 h-10 border-[3px]",
};

export default function Loader({
  label,
  size = "md",
  fullPage = false,
}: Props) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400 animate-spin`}
      />
      {label && (
        <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
          {label}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">{spinner}</div>
  );
}
