// app/components/data/RealProjectCode.ts

export const REAL_CODE_SNIPPETS = [
  {
    file: "Backend/socketService.js",
    type: "Real-time Architecture",
    insight: {
      pl: "Główna klasa Socket.IO zarządzająca połączeniami. Wykorzystuje wzorzec Connection Managera do śledzenia aktywnych użytkowników i obsługi zdarzeń w czasie rzeczywistym.",
      en: "Main Socket.IO class managing connections. Uses Connection Manager pattern to track active users and handle real-time events.",
    },
    // Poniżej Twój REALNY kod z pliku socketService.js
    code: `import { Server } from "socket.io";
import logger from "../utils/logger.js";
import config from "../config/index.js";
import SocketConnectionManager from "./socket/SocketConnectionManager.js";
import SocketConversationManager from "./socket/SocketConversationManager.js";

class SocketService {
  constructor() {
    this.io = null;
    this.connectionManager = new SocketConnectionManager();
    this.conversationManager = new SocketConversationManager();
    this.notificationManager = null;
  }

  initialize(server) {
    if (this.io) return this.io;

    this.io = new Server(server, {
      cors: {
        origin: config.security?.cors?.origin || ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
      },
      pingTimeout: 60000,
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
      },
    });

    this.io.on("connection", this.handleConnection.bind(this));
    return this.io;
  }

  handleConnection(socket) {
    const connectionAdded = this.connectionManager.addConnection(socket, this.io);
    if (!connectionAdded) return;

    socket.on("disconnect", () => {
      this.connectionManager.removeConnection(socket);
    });

    socket.on("conversation:opened", async (data) => {
      await this.conversationManager.handleConversationOpened(socket, data);
    });
  }
}`,
  },
  {
    file: "Backend/rateLimiting.js",
    type: "API Security & DDoS Protection",
    insight: {
      pl: "Zaawansowany middleware limitujący zapytania. Wykorzystuje hashowanie HMAC dla adresów email (zgodność z RODO/PII) i dynamiczne nagłówki Retry-After.",
      en: "Advanced rate-limiting middleware. Uses HMAC hashing for emails (GDPR/PII compliance) and dynamic Retry-After headers.",
    },
    // Poniżej Twój REALNY kod z pliku rateLimiting.js
    code: `import rateLimit from "express-rate-limit";
import crypto from "crypto";

const secret = process.env.RL_SECRET || "change-me-in-production";

// HMAC instead of plaintext email (GDPR/PII protection)
const hashEmail = (e = "") =>
  crypto.createHmac("sha256", secret).update(String(e).toLowerCase().trim()).digest("base64url");

const makeLimiter = ({ windowMs, max, keyGenerator, message }) =>
  rateLimit({
    windowMs,
    max,
    keyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      const retrySec = Math.ceil(req.rateLimit.resetTime - Date.now() / 1000);
      res.setHeader("Retry-After", String(retrySec));
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: retrySec,
      });
    },
  });

export const authLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 30,
  keyGenerator: (req) => \`\${req.ip}:\${hashEmail(req.body?.email)}\`,
  message: "Too many login attempts.",
});

export const apiLimiter = makeLimiter({
  windowMs: 60 * 1000,
  max: 600,
  keyGenerator: (req) => req.ip,
  message: "Too many requests.",
});`,
  },
  {
    file: "Backend/adController.js",
    type: "Search Algo & Business Logic",
    insight: {
      pl: "Logika wyszukiwania ogłoszeń z autorskim algorytmem punktacji (scoring). Priorytetyzuje ogłoszenia wyróżnione i te najlepiej dopasowane do kryteriów użytkownika.",
      en: "Ad search logic with proprietary scoring algorithm. Prioritizes featured listings and best matches based on user criteria.",
    },
    // Poniżej Twój REALNY kod z pliku adController.js
    code: `/**
 * Calculate relevance score for search results
 * Brand + Model match: 100 points
 * Price range match: 30 points
 */
function calculateMatchScore(ad, filters) {
  let score = 0;
  const normalize = (str) => typeof str === "string" ? str.trim().toLowerCase() : "";

  // Exact brand + model match (highest priority)
  if (
    filters.brand && filters.model &&
    normalize(ad.brand) === normalize(filters.brand) &&
    normalize(ad.model) === normalize(filters.model)
  ) {
    score += 100;
  }

  // Price range matching
  if (
    filters.minPrice && filters.maxPrice &&
    ad.price >= parseFloat(filters.minPrice) &&
    ad.price <= parseFloat(filters.maxPrice)
  ) {
    score += 30;
  }

  return score;
}

static async searchAds(req, res, next) {
  try {
    const { sortBy = "createdAt", order = "desc" } = req.query;
    const allAds = await Ad.find({ status: "active" });

    // Calculate match score & sort
    const adsWithScore = allAds.map((ad) => ({
      ...ad.toObject(),
      match_score: calculateMatchScore(ad, req.query),
      is_featured: ad.listingType === "wyróżnione" ? 1 : 0,
    }));

    adsWithScore.sort((a, b) => {
      // 1. Featured first
      if (b.is_featured !== a.is_featured) return b.is_featured - a.is_featured;
      // 2. Fallback to score
      return b.match_score - a.match_score;
    });

    res.status(200).json({ ads: adsWithScore });
  } catch (error) {
    next(error);
  }
}`,
  },
];
