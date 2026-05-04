"use client";

import Button from "@/components/ui/Button";

export function Errors({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;
  return (
    <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 space-y-1">
      {errors.map((e, i) => (
        <p key={i} className="text-sm text-red-500">
          {e}
        </p>
      ))}
    </div>
  );
}

export function Actions({
  onSave,
  onCancel,
}: {
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onSave}>
        Save Question
      </Button>
    </div>
  );
}
