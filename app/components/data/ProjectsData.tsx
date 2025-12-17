import {
  Globe,
  Zap,
  Search,
  Smartphone,
  Layout,
  MousePointer2,
  Layers,
  Music,
  ShieldAlert,
  Server,
  Code2,
  Database,
  Lock,
} from "lucide-react";

export const PROJECTS_DATA = {
  automotive: {
    id: "automotive",
    title: { en: "Automotive Marketplace", pl: "Automotive Marketplace" },
    subtitle: "COMMERCIAL PRODUCT",
    liveUrl: null,
    nda: true,
    desc: {
      pl: "Kompleksowa platforma ogłoszeniowa dla branży automotive. System łączy sprzedających i kupujących w jeden skalowalny ekosystem.",
      en: "A full-scale automotive marketplace platform designed and implemented from scratch.",
    },
    fullDetails: {
      about: {
        title: { pl: "O PROJEKCIE", en: "ABOUT PROJECT" },
        content: {
          pl: "Zaawansowana platforma e-commerce (B2C/C2C) tworzona przez 12 miesięcy dla klienta prywatnego. System obsługuje pełny cykl życia ogłoszenia — od weryfikacji pojazdu po finalizację transakcji. Projekt zrealizowany end-to-end, włączając architekturę, bazę danych i wdrożenie produkcyjne.",
          en: "Advanced e-commerce platform (B2C/C2C) developed over 12 months for a private client. The system covers the full listing lifecycle. Developed end-to-end including architecture, database, and deployment.",
        },
        legalNotice: {
          pl: "⚠️ PROJEKT OBJĘTY NDA: Ze względu na umowę o poufności, pełny kod źródłowy nie jest publiczny. Prezentowane fragmenty są realnym kodem produkcyjnym, wyselekcjonowanym tak, aby demonstrować architekturę bez ujawniania logiki biznesowej.",
          en: "⚠️ NDA PROTECTED: Due to a non-disclosure agreement, the full source code is not public. Presented fragments are real production code, selected to demonstrate architecture without disclosing business logic.",
        },
        businessFeatures: [
          {
            pl: "Zaawansowane ogłoszenia z danymi technicznymi",
            en: "Advanced listings with technical automotive data",
          },
          {
            pl: "Wieloetapowy kreator ogłoszeń z uploadem zdjęć",
            en: "Multi-step listing wizard with image uploads",
          },
          {
            pl: "Promowanie ogłoszeń i systemy płatności",
            en: "Listing promotion and payment systems",
          },
          {
            pl: "System weryfikacji użytkowników (Email/SMS)",
            en: "User verification system (Email/SMS)",
          },
        ],
      },
      frontend: {
        title: { pl: "FRONTEND", en: "FRONTEND" },
        description: {
          pl: "Nowoczesna aplikacja SPA zorientowana na wydajność i interakcje w czasie rzeczywistym.",
          en: "Modern SPA focused on performance and real-time interactions.",
        },
        highlights: [
          "React 18 + Hooks (custom auth, sockets, notifications)",
          "Context API – zarządzanie stanem autoryzacji i cyklem życia WebSocket",
          "Socket.IO Client – obsługa czatu i powiadomień bez przeładowania",
          "PWA-ready – wsparcie offline i instalacja jako aplikacja natywna",
          "Tailwind CSS – responsywny interfejs zoptymalizowany pod Mobile",
        ],
      },
      backend: {
        title: { pl: "BACKEND", en: "BACKEND" },
        description: {
          pl: "Skalowalne REST API z dwukierunkową komunikacją WebSocket i architekturą middleware.",
          en: "Scalable REST API with bi-directional WebSocket communication.",
        },
        highlights: [
          "Node.js + Express (architektura MVC)",
          "MongoDB + Mongoose (elastyczne modelowanie danych pojazdów)",
          "JWT Authentication – Access & Refresh Tokens w HttpOnly cookies",
          "Socket.IO – system powiadomień i czat w czasie rzeczywistym",
          "Ochrona API: Rate limiting, walidacja requestów, Auth Guards",
        ],
      },
      stack: {
        title: { pl: "TECH STACK", en: "TECH STACK" },
        groups: [
          {
            name: "Frontend",
            items: [
              "React 18",
              "TypeScript",
              "Tailwind CSS",
              "Socket.IO Client",
              "PWA",
            ],
          },
          {
            name: "Backend",
            items: [
              "Node.js",
              "Express",
              "MongoDB",
              "Mongoose",
              "JWT",
              "Socket.IO",
            ],
          },
          {
            name: "DevOps",
            items: [
              "VPS (Linux)",
              "NGINX (Reverse Proxy)",
              "PM2",
              "SSL/TLS (Let's Encrypt)",
            ],
          },
          {
            name: "Architecture",
            items: [
              "MVC (Backend)",
              "Component-based UI",
              "Event-driven real-time comms",
            ],
          },
        ],
      },
    },
    images: [
      { src: "/img/marketplace/Ogłoszenia.webp", title: "Main Listings Grid" },
      {
        src: "/img/marketplace/Panel - Admina Dashboard.webp",
        title: "Admin Dashboard",
      },
      { src: "/img/marketplace/Formularz.webp", title: "Listing Wizard" },
      { src: "/img/marketplace/Wiadomości.webp", title: "Live Chat" },
    ],
    codeSnippets: [
      {
        file: "src/modules/socket/socket.service.ts",
        type: "Real-time Architecture",
        insight: {
          pl: "Główna klasa Socket.IO zarządzająca połączeniami. Wykorzystuje wzorzec Connection Managera do śledzenia aktywnych sesji.",
          en: "Main Socket.IO class managing connections. Uses Connection Manager pattern to track active sessions.",
        },
        code: `import { Server } from "socket.io";
import SocketConnectionManager from "./socket/SocketConnectionManager.js";

// Real-time Messaging Architecture
class SocketService {
  initialize(server) {
    this.io = new Server(server, {
      cors: { origin: process.env.CLIENT_URL },
      pingTimeout: 60000,
    });

    this.io.use(SocketAuth.authMiddleware);
    this.io.on("connection", (socket) => {
      this.connectionManager.addConnection(socket, this.io);
      socket.on("disconnect", () => this.connectionManager.removeConnection(socket));
    });
  }
}`,
      },
      {
        file: "src/middleware/rate-limiter.ts",
        type: "API Security",
        insight: {
          pl: "Middleware limitujący zapytania (Rate Limiting). Wykorzystuje HMAC dla adresów email, aby chronić dane osobowe przed wyciekiem w kluczach cache.",
          en: "Rate-limiting middleware. Uses HMAC for emails to protect personal data from leaking in cache keys.",
        },
        code: `import rateLimit from "express-rate-limit";
import crypto from "crypto";

const hashEmail = (e = "") =>
  crypto.createHmac("sha256", process.env.RL_SECRET)
    .update(String(e).toLowerCase().trim())
    .digest("base64url");

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => \`\${req.ip}:\${hashEmail(req.body?.email)}\`,
  message: "Too many login attempts.",
});`,
      },
    ],
  },
  xp: {
    id: "xp",
    title: { en: "Portfolio XP", pl: "Portfolio XP" },
    subtitle: "INTERACTIVE WEB OS",
    liveUrl: "https://mateusz-goszczycki-portfolio.vercel.app/",
    nda: false,
    desc: {
      pl: "W pełni interaktywna rekonstrukcja systemu Windows XP w przeglądarce. Projekt demonstrujący zaawansowaną inżynierię frontendu.",
      en: "A fully interactive web-based recreation of Windows XP. A project demonstrating advanced frontend engineering.",
    },
    fullDetails: {
      about: {
        title: { pl: "O PROJEKCIE", en: "ABOUT PROJECT" },
        content: {
          pl: "Eksperymentalny projekt odtwarzający interfejs i funkcjonalność systemu Windows XP. Skupia się na skomplikowanym zarządzaniu stanem okien, systemie plików oraz pixel-perfect designie.",
          en: "Experimental project recreating the Windows XP interface. Focused on complex window management, file system, and pixel-perfect design.",
        },
        features: [
          {
            pl: "Własny Window Manager (Drag & Drop, Z-Index)",
            en: "Custom Window Manager (Drag & Drop, Z-Index)",
          },
          {
            pl: "Funkcjonalny odtwarzacz Winamp",
            en: "Functional Winamp player",
          },
          {
            pl: "Emulacja menu Start i paska zadań",
            en: "Start menu and Taskbar emulation",
          },
        ],
      },
      frontend: {
        title: { pl: "INŻYNIERIA", en: "ENGINEERING" },
        highlights: [
          "Zaawansowany State Management (Context API + Reducers)",
          "Framer Motion dla płynnych animacji systemowych",
          "Custom Hooks do obsługi cyklu życia aplikacji",
          "Architektura komponentowa OS-like",
        ],
      },
    },
    images: [
      {
        src: "/img/marketplace/Widok Siatkowy - ogłoszenia.png",
        title: "Desktop Environment",
      },
    ],
    codeSnippets: [
      {
        file: "src/hooks/useWindowManager.tsx",
        type: "System Logic",
        insight: {
          pl: "Zarządzanie stanem okien, ich pozycją w stosie (z-index) oraz cyklem życia aplikacji.",
          en: "Managing window states, stacking order (z-index), and app lifecycle.",
        },
        code: `export const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowAppState[]>([]);

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: Date.now() } : w
    ));
  };

  return { windows, focusWindow };
};`,
      },
    ],
  },
};
