type Props = {
  title: string;
  description?: string;
};

export default function SectionTitle({ title, description }: Props) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
          {description}
        </p>
      )}
    </div>
  );
}
