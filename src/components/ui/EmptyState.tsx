import { ReactNode } from "react";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="mb-4 w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
          {icon}
        </div>
      )}

      <h3 className="text-base font-semibold text-slate-700">{title}</h3>

      {description && (
        <p className="text-sm text-slate-400 mt-1 max-w-xs">{description}</p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
