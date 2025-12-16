// app/components/data/content.ts

export const portfolioData = {
  hero: {
    title1: "FULLSTACK",
    title2: "DEVELOPER",
    description:
      "Specjalista od nowoczesnych rozwiązań webowych. Łączę technologię z designem, tworząc systemy odporne na przyszłość. Skupiam się na wydajności, skalowalności i doświadczeniach użytkownika.",
  },
  projects: [
    {
      title: "AUTOSELL_MARKETPLACE",
      desc: "Zaawansowana platforma e-commerce (B2C/C2C) tworzona przez 12 miesięcy dla klienta prywatnego (NDA). System integruje dane z CEPiK (weryfikacja pojazdów), obsługuje komunikację w czasie rzeczywistym (WebSocket), płatności oraz generowanie faktur PDF. Aplikacja typu PWA z pełnym wsparciem offline.",
      tags: [
        "React 18",
        "Node.js",
        "Socket.IO",
        "MongoDB",
        "Supabase",
        "PWA",
        "CEPiK API",
      ],
      codeTitle: "SocketServer.ts",
      codeLines: [
        "// Real-time Messaging Architecture",
        "io.use(authorizeUser); // JWT Middleware",
        "",
        "io.on('connection', (socket) => {",
        "  socket.on('join_room', async ({ roomId }) => {",
        "    await validateAccess(socket.user.id, roomId);",
        "    socket.join(roomId);",
        "    // Real-time notifications push",
        "    socket.to(roomId).emit('user_active', { id: socket.user.id });",
        "  });",
        "});",
      ],
    },
    {
      title: "PORTFOLIO_XP_OS",
      desc: "Interaktywne portfolio emulujące system Windows XP w przeglądarce. Pełna obsługa okien, system plików, odtwarzacz Winamp oraz 'Blue Screen of Death'. Projekt demonstrujący zaawansowane zarządzanie stanem globalnym i animacje.",
      tags: [
        "React",
        "TypeScript",
        "Framer Motion",
        "Context API",
        "Styled Components",
      ],
      codeTitle: "WindowManager.tsx",
      codeLines: [
        "const handleWindowOpen = (appId: string) => {",
        "  setWindows(prev => [",
        "    ...prev,",
        "    { id: appId, zIndex: getMaxZIndex() + 1, minimized: false }",
        "  ]);",
        "  playSystemSound('startup.mp3');",
        "};",
      ],
    },
    {
      title: "NEXUS_DASHBOARD",
      desc: "Panel analityczny czasu rzeczywistego dla aplikacji SaaS. Wizualizacja dużych zbiorów danych, obsługa płatności Stripe i zarządzanie subskrypcjami użytkowników. Architektura oparta na mikroserwisach.",
      tags: ["React", "Node.js", "Stripe API", "Recharts", "MongoDB"],
      codeTitle: "Analytics.ts",
      codeLines: [
        "socket.on('data_stream', (metrics) => {",
        "  updateCharts(metrics.revenue, metrics.users);",
        "  if (metrics.errorRate > 0.5) triggerAlert();",
        "});",
      ],
    },
  ],
  services: [
    {
      title: "Fullstack Development",
      desc: "Kompleksowe tworzenie aplikacji od zera. Backend w Node.js/Express, Frontend w React/Next.js. Integracje API, bazy danych (SQL/NoSQL) i wdrażanie na produkcję (VPS/Cloud).",
    },
    {
      title: "Real-time Systems",
      desc: "Projektowanie systemów komunikacji w czasie rzeczywistym przy użyciu WebSocket (Socket.IO). Czaty, powiadomienia, systemy śledzenia na żywo.",
    },
    {
      title: "PWA & Mobile Web",
      desc: "Tworzenie progresywnych aplikacji webowych (PWA), które działają jak aplikacje natywne – z obsługą offline, powiadomieniami push i instalacją na ekranie głównym.",
    },
    {
      title: "API Integrations",
      desc: "Integracja zewnętrznych usług: systemy płatności (Stripe), mapy, systemy rządowe (CEPiK), generowanie dokumentów (PDFKit) i magazyny danych (Supabase).",
    },
  ],
  contact: {
    email: "kontakt@mystudio.dev",
    github: "github.com/goniek94",
    linkedin: "linkedin.com/in/goniek94",
  },
};
