import {
  Globe,
  Zap,
  Search,
  Smartphone,
  Layout,
  MousePointer2,
  Layers,
  Music,
} from "lucide-react";

export const PROJECTS_DATA = {
  automotive: {
    id: "automotive",
    title: { en: "Automotive Marketplace", pl: "Automotive Marketplace" },
    subtitle: "COMMERCIAL PRODUCT",
    liveUrl: null,
    nda: true,
    desc: {
      pl: "Kompleksowa platforma ogłoszeniowa dla branży automotive. System łączy sprzedających i kupujących w jeden skalowalny ekosystem, obsługując pełny cykl życia ogłoszenia.",
      en: "A full-scale automotive marketplace platform designed and implemented from scratch. The system connects sellers and buyers in a single, scalable ecosystem.",
    },
    features: [
      {
        icon: Globe,
        title: "Modern SPA",
        desc: "React 18, TypeScript, Next.js",
      },
      { icon: Zap, title: "Real-time", desc: "Socket.IO chat & notifications" },
      {
        icon: Search,
        title: "Marketplace Core",
        desc: "Advanced listings & filters",
      },
      {
        icon: Smartphone,
        title: "Mobile First",
        desc: "PWA ready & responsive",
      },
    ],
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
          pl: "Główna klasa Socket.IO zarządzająca połączeniami. Wykorzystuje wzorzec Connection Managera do śledzenia aktywnych użytkowników.",
          en: "Main Socket.IO class managing connections. Uses Connection Manager pattern to track active users.",
        },
        code: `import { Server } from "socket.io";
import SocketConnectionManager from "./socket/SocketConnectionManager.js";

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
          pl: "Zaawansowany middleware limitujący zapytania. Wykorzystuje HMAC dla adresów email w celu ochrony danych osobowych.",
          en: "Advanced rate-limiting middleware. Uses HMAC for emails to protect personal data.",
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
      pl: "W pełni interaktywne portfolio będące funkcjonalną rekonstrukcją systemu Windows XP. Projekt demonstruje zaawansowaną inżynierię frontendową.",
      en: "A fully interactive web-based portfolio designed as a functional recreation of Windows XP. It demonstrates advanced frontend engineering.",
    },
    features: [
      {
        icon: Layout,
        title: "Window Manager",
        desc: "Custom Drag & Drop System",
      },
      {
        icon: MousePointer2,
        title: "UX Fidelity",
        desc: "Pixel-perfect XP recreation",
      },
      { icon: Layers, title: "Architecture", desc: "Component-based OS logic" },
      { icon: Music, title: "Winamp App", desc: "Functional audio player" },
    ],
    images: [
      {
        src: "/img/marketplace/Widok Siatkowy - ogłoszenia.png",
        title: "XP Desktop Environment",
      },
      {
        src: "/img/marketplace/Wiadomości.webp",
        title: "Messenger UI Integration",
      },
    ],
    codeSnippets: [
      {
        file: "src/hooks/useWindowManager.tsx",
        type: "System Logic",
        insight: {
          pl: "Zarządzanie stanem okien, ich pozycją (z-index) oraz cyklem życia aplikacji.",
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
