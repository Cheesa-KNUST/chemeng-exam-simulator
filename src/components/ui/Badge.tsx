type Variant = "blue" | "green" | "yellow" | "red" | "slate" | "purple";

type Props = {
  text: string;
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  yellow: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-600",
  slate: "bg-slate-100 text-slate-600",
  purple: "bg-violet-100 text-violet-700",
};

export default function Badge({ text, variant = "blue" }: Props) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${styles[variant]}`}
    >
      {text}
    </span>
  );
}
