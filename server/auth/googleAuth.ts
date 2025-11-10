import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Express } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "../storage";
import type { User } from "../../shared/schema";

// Google OAuth Configuration
export function setupGoogleAuth(app: Express) {
  // Session configuration with PostgreSQL store
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  // Configure session middleware
  app.set("trust proxy", 1);
  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: sessionTtl,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      },
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Google OAuth Strategy
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("⚠️  Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables.");
  } else {
    // Get the base URL for callbacks
    const baseUrl = process.env.REPLIT_DOMAINS
      ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
      : "http://localhost:5000";

    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${baseUrl}/auth/google/callback`,
          scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Extract user info from Google profile
            const email = profile.emails?.[0]?.value;
            const firstName = profile.name?.givenName || "";
            const lastName = profile.name?.familyName || "";
            const profileImageUrl = profile.photos?.[0]?.value;

            if (!email) {
              return done(new Error("No email found in Google profile"));
            }

            // Upsert user in database
            const user = await storage.upsertUser({
              id: profile.id,
              email,
              firstName,
              lastName,
              profileImageUrl,
            });

            return done(null, user);
          } catch (error) {
            console.error("Error during Google OAuth:", error);
            return done(error as Error);
          }
        }
      )
    );
  }

  // Serialize user to session
  passport.serializeUser((user: Express.User, done) => {
    const u = user as User;
    done(null, u.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Optional auth - doesn't block but adds user info if logged in
export function optionalAuth(req: any, res: any, next: any) {
  // Just continue - user info will be in req.user if authenticated
  next();
}
