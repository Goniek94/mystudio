import { cn } from "@/app/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-emerald-300/90">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-2xl font-semibold text-zinc-50 md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-pretty text-sm leading-7 text-zinc-300 md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
