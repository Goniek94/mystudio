import { cn } from "@/app/lib/cn";

// Pozwalamy na przyjęcie wszystkich standardowych propsów diva (id, style, onClick itp.)
type ContainerProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
};

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-6", className)}
      {...props} // Przekazujemy id i inne propsy niżej
    >
      {children}
    </div>
  );
}
