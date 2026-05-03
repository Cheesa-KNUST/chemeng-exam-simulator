import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function SectionTitle({ title, description, action }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
