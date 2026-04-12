import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// 1. Users Table (Handles all 5 roles)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }), // Added for DBA password login
  role: text("role")
    .$type("external" | "student" | "volunteer" | "organizer" | "dba")
    .default("external"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. Events Table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  schedule: timestamp("schedule"),
  winnerId: integer("winner_id").references(() => users.id, { onDelete: "set null" }), // Real-time winner tracking
});

// 3. Registrations (Many-to-Many relationship)
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  eventId: integer("event_id").references(() => events.id, { onDelete: "cascade" }),
  isVolunteer: boolean("is_volunteer").default(false),
});

// 4. Logistics (Accommodation & Food)
export const logistics = pgTable("logistics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  accommodationDetails: text("accommodation_details"),
  foodCouponProvided: boolean("food_coupon_provided").default(false),
});

// 5. Verification Tokens (For Role-Based Auth)
export const verificationTokens = pgTable("verification_tokens", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  token: varchar("token", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

// 6. User Support Queries / Q&A
export const queries = pgTable("queries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(), // Participant who asked
  question: text("question").notNull(),
  answer: text("answer"), // Null means unanswered
  answeredById: integer("answered_by_id").references(() => users.id, { onDelete: "set null" }), // Staff who answered
  createdAt: timestamp("created_at").defaultNow(),
});
