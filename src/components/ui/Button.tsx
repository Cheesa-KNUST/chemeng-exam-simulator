import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
};

const baseStyles =
  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
  secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    />
  );
}
