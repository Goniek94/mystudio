import { cn } from "@/app/lib/cn";

type ContainerProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
};

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div
      // ZMIANA:
      // 1. max-w-[2000px] -> pozwala treści zająć prawie całą szerokość monitora
      // 2. px-6 md:px-12 lg:px-16 -> duże marginesy boczne, żeby treść nie "kleiła się" do krawędzi
      className={cn(
        "mx-auto w-full max-w-[2000px] px-6 md:px-12 lg:px-16",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
