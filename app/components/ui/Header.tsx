import Link from "next/link";
import { Container } from "./Container";
import { ButtonLink } from "./Button";

const navItems = [
  { href: "/projects", label: "Projekty" },
  { href: "/about", label: "Studio" },
  { href: "/contact", label: "Kontakt" },
];

export function Header() {
  return (
    // STYL TEMPORAL:
    // fixed top-0 -> Przyklejony do góry
    // w-full -> Pełna szerokość
    // backdrop-blur-md -> Efekt matowego szkła
    // bg-zinc-950/80 -> Ciemne tło, ale z 80% przezroczystością
    // border-b -> Subtelna linia oddzielająca
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-500/10 bg-zinc-950/80 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        {/* LOGO (Lewa strona) */}
        <Link
          href="/"
          className="group flex items-center gap-3 text-xl font-bold tracking-widest text-emerald-400 hover:text-emerald-300 transition uppercase"
        >
          <span className="text-white group-hover:text-emerald-400 transition-colors">
            MyStudio
          </span>
          {/* Opcjonalny "Badge" wersji - bardzo techniczny detal */}
          <span className="hidden sm:block text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-500 border border-emerald-500/20 font-mono">
            V2.0
          </span>
        </Link>

        {/* NAWIGACJA (Środek - tylko desktop) */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors tracking-[0.2em] uppercase group"
            >
              {item.label}
              {/* Animowana linia podkreślająca */}
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* PRAWA STRONA (Status + Przycisk) */}
        <div className="flex items-center gap-6">
          {/* Status Online - widoczny na dużych ekranach */}
          <div className="hidden lg:flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System: Online
          </div>

          <ButtonLink
            href="/contact"
            variant="primary"
            className="h-9 px-6 text-xs tracking-widest border border-emerald-500/50"
          >
            Wycena_
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
