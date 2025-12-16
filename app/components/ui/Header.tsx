// app/components/Header.tsx

import Link from "next/link";
import { Container } from "./Container"; // Zakładam, że masz już ten komponent
import { ButtonLink } from "./Button"; // Zakładam, że masz już ten komponent

const navItems = [
  { href: "/projects", label: "Projekty" },
  { href: "/about", label: "O mnie" },
  { href: "/contact", label: "Kontakt" },
];

export function Header() {
  return (
    <header className="relative z-10 w-full pt-8">
      <Container className="flex items-center justify-between">
        {/* Logo/Nazwa - Używamy Link do strony głównej */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-emerald-300 hover:text-emerald-200 transition"
        >
          MyStudio
        </Link>

        {/* Nawigacja desktopowa */}
        <nav className="hidden space-x-6 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-300 hover:text-emerald-300 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Przycisk CTA (Wycena) */}
        <ButtonLink
          href="/contact"
          variant="primary"
          className="ml-auto sm:ml-0"
        >
          Wycena
        </ButtonLink>

        {/* TODO: Dodać obsługę nawigacji mobilnej (Hamburger Menu) */}
      </Container>
    </header>
  );
}
