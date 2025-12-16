export const portfolioData = {
  hero: {
    badge: "DOSTĘPNY DO PROJEKTÓW",
    title1: "Architekt",
    title2: "Rozwiązań Cyfrowych",
    description:
      "Specjalizuję się w tworzeniu zaawansowanych aplikacji webowych, gdzie wydajność spotyka się z cyber-estetyką. Twoja wizja, mój kod.",
  },
  services: [
    {
      title: "Frontend Engineering",
      desc: "Pixel-perfect interfejsy z użyciem React i nowoczesnych animacji.",
    },
    {
      title: "Backend Systems",
      desc: "Skalowalne API, mikroserwisy i bezpieczna architektura bazodanowa.",
    },
    {
      title: "Technical Audit",
      desc: "Analiza bezpieczeństwa i wydajności istniejących rozwiązań.",
    },
  ],
  projects: [
    {
      title: "E-commerce Platform B2B",
      desc: "Kompleksowa przebudowa systemu sprzedaży automotive. Integracja z SAP.",
      tags: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
      codeTitle: "Checkout_Logic.ts",
      codeLines: [
        "async function processOrder(cart) {",
        "  const inventory = await checkStock(cart);",
        "  if (!inventory.ok) throw new Error('OOS');",
        "  return payment.authorize(cart.total);",
        "}",
      ],
    },
    {
      title: "SaaS Analytics Dashboard",
      desc: "Panel analityczny przetwarzający dane w czasie rzeczywistym dla sektora FinTech.",
      tags: ["TypeScript", "D3.js", "AWS Lambda", "WebSockets"],
      codeTitle: "Data_Stream.py",
      codeLines: [
        "def analyze_stream(data):",
        "    risk_factor = model.predict(data)",
        "    if risk_factor > 0.8:",
        "        alert.trigger('CRITICAL_RISK')",
        "    return risk_factor",
      ],
    },
  ],
  contact: {
    email: "kontakt@twojadomena.pl",
    github: "github.com/twoj-profil",
  },
};
