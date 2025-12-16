import { cn } from "@/app/lib/cn";

export function CodeWindow({
  title,
  lines,
  className,
}: {
  title: string;
  lines: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-emerald-400/20 bg-zinc-950/60 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_0_48px_rgba(16,185,129,0.08)] backdrop-blur",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-emerald-400/15 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
        <span className="ml-2 text-xs font-medium text-zinc-300">{title}</span>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6 text-zinc-200">
        <code>
          {lines.map((l, i) => (
            <div key={i} className="flex gap-4">
              <span className="select-none text-zinc-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="whitespace-pre">{l}</span>
            </div>
          ))}
          <span className="inline-block h-4 w-2 translate-y-[3px] animate-pulse bg-emerald-300/70" />
        </code>
      </pre>
    </div>
  );
}
