import Link from "next/link";
import { cn } from "@/app/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70";
  const variants: Record<Variant, string> = {
    primary:
      "bg-emerald-400 text-black hover:bg-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_0_24px_rgba(16,185,129,0.20)]",
    secondary:
      "bg-zinc-900 text-zinc-100 ring-1 ring-inset ring-emerald-400/25 hover:bg-zinc-800",
    ghost: "text-emerald-300 hover:text-emerald-200",
  };

  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
