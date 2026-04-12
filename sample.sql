-- ============================================================================
--  AarohanHub — Complete Database Schema & Drizzle Query Reference
--  Generated from: db/schema.js + app/actions/*.js
-- ============================================================================
--  This file documents:
--    1. All table definitions (CREATE TABLE statements)
--    2. All foreign key constraints with cascade / set-null rules
--    3. The equivalent raw SQL for every Drizzle ORM query used across
--       the entire application, grouped by feature module
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║                        TABLE  DEFINITIONS                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝


-- ────────────────────────────────────────────────────────────────────────────
--  1. USERS
--     Stores every person who interacts with the platform.
--     The 'role' column determines access level:
--       • external  – General public / guest
--       • student   – College students participating in events
--       • volunteer – Helpers who manage events on-site
--       • organizer – Event organisers
--       • dba       – Database admin / super-admin
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE "users" (
    "id"         SERIAL PRIMARY KEY NOT NULL,
    "full_name"  VARCHAR(255) NOT NULL,
    "email"      VARCHAR(255) NOT NULL,
    "password"   VARCHAR(255),                      -- Used for password-based login
    "role"       TEXT DEFAULT 'external',            -- One of: external, student, volunteer, organizer, dba
    "created_at" TIMESTAMP DEFAULT NOW(),
    CONSTRAINT "users_email_unique" UNIQUE ("email")
);


-- ────────────────────────────────────────────────────────────────────────────
--  2. EVENTS
--     Each row represents a single event at the fest.
--     winner_id points to the user who won (NULL until a winner is declared).
--     ON DELETE SET NULL — if the winning user is deleted, the column is
--     simply set to NULL instead of blocking the deletion.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE "events" (
    "id"          SERIAL PRIMARY KEY NOT NULL,
    "title"       VARCHAR(255) NOT NULL,
    "description" TEXT,
    "schedule"    TIMESTAMP,
    "winner_id"   INTEGER
);

ALTER TABLE "events"
    ADD CONSTRAINT "events_winner_id_users_id_fk"
    FOREIGN KEY ("winner_id")
    REFERENCES "public"."users"("id")
    ON DELETE SET NULL
    ON UPDATE NO ACTION;


-- ────────────────────────────────────────────────────────────────────────────
--  3. REGISTRATIONS  (Many-to-Many: Users ↔ Events)
--     Tracks which users have registered for which events.
--     • ON DELETE CASCADE on user_id — if a user is deleted, their
--       registrations are automatically removed.
--     • ON DELETE CASCADE on event_id — if an event is deleted, all of
--       its registrations are automatically cleaned up.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE "registrations" (
    "id"           SERIAL PRIMARY KEY NOT NULL,
    "user_id"      INTEGER,
    "event_id"     INTEGER,
    "is_volunteer" BOOLEAN DEFAULT FALSE
);

ALTER TABLE "registrations"
    ADD CONSTRAINT "registrations_user_id_users_id_fk"
    FOREIGN KEY ("user_id")
    REFERENCES "public"."users"("id")
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE "registrations"
    ADD CONSTRAINT "registrations_event_id_events_id_fk"
    FOREIGN KEY ("event_id")
    REFERENCES "public"."events"("id")
    ON DELETE CASCADE
    ON UPDATE NO ACTION;


-- ────────────────────────────────────────────────────────────────────────────
--  4. LOGISTICS  (Accommodation & Food)
--     One row per user; stores accommodation info and whether they were
--     issued a food coupon.
--     ON DELETE CASCADE — record is deleted when the user is removed.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE "logistics" (
    "id"                      SERIAL PRIMARY KEY NOT NULL,
    "user_id"                 INTEGER,
    "accommodation_details"   TEXT,
    "food_coupon_provided"    BOOLEAN DEFAULT FALSE
);

ALTER TABLE "logistics"
    ADD CONSTRAINT "logistics_user_id_users_id_fk"
    FOREIGN KEY ("user_id")
    REFERENCES "public"."users"("id")
    ON DELETE CASCADE
    ON UPDATE NO ACTION;


-- ────────────────────────────────────────────────────────────────────────────
--  5. VERIFICATION TOKENS  (Email OTP for registration flow)
--     Stores a 6-digit OTP sent to the user's email.
--     Deleted after successful verification.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE "verification_tokens" (
    "id"         SERIAL PRIMARY KEY NOT NULL,
    "email"      VARCHAR(255) NOT NULL,
    "token"      VARCHAR(6) NOT NULL,
    "expires_at" TIMESTAMP NOT NULL
);


-- ────────────────────────────────────────────────────────────────────────────
--  6. QUERIES  (User Support Q&A)
--     Users post questions; staff answer them.
--     • user_id   ON DELETE CASCADE  — questions deleted with the user.
--     • answered_by_id ON DELETE SET NULL — if the staff member who
--       answered is removed, the answer text is preserved but the
--       "answered by" link is NULLed.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE "queries" (
    "id"             SERIAL PRIMARY KEY NOT NULL,
    "user_id"        INTEGER NOT NULL,
    "question"       TEXT NOT NULL,
    "answer"         TEXT,                           -- NULL = unanswered
    "answered_by_id" INTEGER,                        -- Staff user who replied
    "created_at"     TIMESTAMP DEFAULT NOW()
);

ALTER TABLE "queries"
    ADD CONSTRAINT "queries_user_id_users_id_fk"
    FOREIGN KEY ("user_id")
    REFERENCES "public"."users"("id")
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE "queries"
    ADD CONSTRAINT "queries_answered_by_id_users_id_fk"
    FOREIGN KEY ("answered_by_id")
    REFERENCES "public"."users"("id")
    ON DELETE SET NULL
    ON UPDATE NO ACTION;



-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║                  DRIZZLE ORM QUERIES  →  RAW SQL                       ║
-- ║  Each query below is the SQL equivalent of a Drizzle call in the app   ║
-- ╚══════════════════════════════════════════════════════════════════════════╝


-- ============================================================================
--  MODULE: AUTH  (app/actions/auth.js)
-- ============================================================================

-- Q1: Check if a user with the given email already exists
--     Drizzle:  db.select().from(users).where(eq(users.email, $1))
--     Used in:  registerUser()  — prevents duplicate accounts
SELECT *
  FROM "users"
 WHERE "email" = $1;


-- Q2: Save a new verification OTP token
--     Drizzle:  db.insert(verificationTokens).values({ email, token, expiresAt })
--     Used in:  registerUser()  — after OTP is generated and emailed
INSERT INTO "verification_tokens" ("email", "token", "expires_at")
VALUES ($1, $2, $3);


-- Q3: Find matching OTP token for verification (most recent first)
--     Drizzle:  db.select().from(verificationTokens)
--                .where(and(eq(.email, $1), eq(.token, $2)))
--                .orderBy(verificationTokens.expiresAt, 'desc')
--     Used in:  verifyRegistrationOTP()
SELECT *
  FROM "verification_tokens"
 WHERE "email" = $1
   AND "token" = $2
 ORDER BY "expires_at" DESC;


-- Q4: Insert a new verified user and return the created row
--     Drizzle:  db.insert(users).values({ fullName, email, password, role }).returning()
--     Used in:  verifyRegistrationOTP()  — after OTP is valid
INSERT INTO "users" ("full_name", "email", "password", "role")
VALUES ($1, $2, $3, $4)
RETURNING *;


-- Q5: Clean up used OTP tokens for the email
--     Drizzle:  db.delete(verificationTokens).where(eq(.email, $1))
--     Used in:  verifyRegistrationOTP()  — post-successful verification
DELETE FROM "verification_tokens"
 WHERE "email" = $1;


-- Q6: Login — find user by email AND password
--     Drizzle:  db.select().from(users).where(and(eq(.email, $1), eq(.password, $2)))
--     Used in:  loginWithPassword()
SELECT *
  FROM "users"
 WHERE "email" = $1
   AND "password" = $2;


-- ============================================================================
--  MODULE: ADMIN  (app/actions/admin.js)
-- ============================================================================

-- Q7: Fetch all non-DBA users (for the admin user-management panel)
--     Drizzle:  db.select().from(users).where(ne(users.role, 'dba'))
--     Used in:  fetchAllUsers()
SELECT *
  FROM "users"
 WHERE "role" <> 'dba';


-- Q8: Delete all registrations belonging to a user (manual cleanup before delete)
--     Drizzle:  db.delete(registrations).where(eq(registrations.userId, $1))
--     Used in:  deleteUser()  — explicit step even though CASCADE now handles it
--     Note:     With ON DELETE CASCADE on the FK, this is technically redundant
--               but kept for safety / backward-compatibility.
DELETE FROM "registrations"
 WHERE "user_id" = $1;


-- Q9: Delete a user by ID
--     Drizzle:  db.delete(users).where(eq(users.id, $1))
--     Used in:  deleteUser()
--     Note:     CASCADE rules will auto-remove rows in registrations,
--               logistics, and queries (where user_id = this user).
--               SET NULL rules will NULL out events.winner_id and
--               queries.answered_by_id if they pointed to this user.
DELETE FROM "users"
 WHERE "id" = $1;


-- ============================================================================
--  MODULE: EVENTS  (app/actions/events.js)
-- ============================================================================

-- Q10: Fetch all events with winner info and optional registration status
--      Drizzle:  db.select({ ... }).from(events)
--                 .leftJoin(users, eq(events.winnerId, users.id))
--                 .leftJoin(registrations, and(eq(.eventId, events.id), eq(.userId, $1)))
--      Used in:  fetchEvents(userId)
SELECT e."id",
       e."title",
       e."description",
       e."schedule",
       r."id"        AS "is_registered",
       e."winner_id",
       u."full_name" AS "winner_name",
       u."email"     AS "winner_email"
  FROM "events" e
  LEFT JOIN "users" u
    ON e."winner_id" = u."id"
  LEFT JOIN "registrations" r
    ON r."event_id" = e."id"
   AND r."user_id"  = $1;             -- $1 = current user's ID (NULL-safe)


-- Q11: Insert a new event
--      Drizzle:  db.insert(events).values({ title, description, schedule })
--      Used in:  addEvent()
INSERT INTO "events" ("title", "description", "schedule")
VALUES ($1, $2, $3);


-- Q12: Delete all registrations for an event, then the event itself
--      Drizzle:  db.delete(registrations).where(eq(.eventId, $1))
--               db.delete(events).where(eq(events.id, $1))
--      Used in:  deleteEvent()
--      Note:     Manual cascade cleanup + row delete (CASCADE FK also covers this)
DELETE FROM "registrations" WHERE "event_id" = $1;
DELETE FROM "events"        WHERE "id"       = $1;


-- Q13: Update event title and description
--      Drizzle:  db.update(events).set({ title, description }).where(eq(events.id, $1))
--      Used in:  updateEvent()
UPDATE "events"
   SET "title"       = $2,
       "description" = $3
 WHERE "id" = $1;


-- Q14: Fetch a single event by ID (to check schedule & winner before registration)
--      Drizzle:  db.select().from(events).where(eq(events.id, $1))
--      Used in:  registerForEvent()
SELECT *
  FROM "events"
 WHERE "id" = $1;


-- Q15: Check if a user is already registered for an event
--      Drizzle:  db.select().from(registrations)
--                 .where(and(eq(.userId, $1), eq(.eventId, $2)))
--      Used in:  registerForEvent()
SELECT *
  FROM "registrations"
 WHERE "user_id"  = $1
   AND "event_id" = $2;


-- Q16: Insert a new event registration
--      Drizzle:  db.insert(registrations).values({ userId, eventId, isVolunteer })
--      Used in:  registerForEvent()
INSERT INTO "registrations" ("user_id", "event_id", "is_volunteer")
VALUES ($1, $2, $3);


-- Q17: Fetch all registrations for a specific event (joined with user details)
--      Drizzle:  db.select({ id, userId, fullName, email, role, isVolunteer })
--                 .from(registrations)
--                 .leftJoin(users, eq(registrations.userId, users.id))
--                 .where(eq(registrations.eventId, $1))
--      Used in:  fetchEventRegistrations()  — staff-only view
SELECT r."id",
       r."user_id",
       u."full_name",
       u."email",
       u."role",
       r."is_volunteer"
  FROM "registrations" r
  LEFT JOIN "users" u
    ON r."user_id" = u."id"
 WHERE r."event_id" = $1;


-- Q18: Declare / update the winner of an event
--      Drizzle:  db.update(events).set({ winnerId: $2 }).where(eq(events.id, $1))
--      Used in:  setEventWinner()
UPDATE "events"
   SET "winner_id" = $2
 WHERE "id" = $1;


-- Q19: Check if a user has won any event (returns true/false in the app)
--      Drizzle:  db.select({ id: events.id }).from(events).where(eq(events.winnerId, $1))
--      Used in:  checkIfWinner()
SELECT "id"
  FROM "events"
 WHERE "winner_id" = $1;


-- ============================================================================
--  MODULE: SUPPORT (Q&A)  (app/actions/support.js)
-- ============================================================================

-- Q20: Submit a new support question
--      Drizzle:  db.insert(queries).values({ userId, question })
--      Used in:  submitQuery()
INSERT INTO "queries" ("user_id", "question")
VALUES ($1, $2);


-- Q21: Answer a support question (staff only)
--      Drizzle:  db.update(queries)
--                 .set({ answer, answeredById })
--                 .where(eq(queries.id, $1))
--      Used in:  answerQuery()
UPDATE "queries"
   SET "answer"         = $2,
       "answered_by_id" = $3
 WHERE "id" = $1;


-- Q22: Fetch all support queries (staff sees everything)
--      Drizzle:  db.select({ id, question, answer, createdAt, authorName, authorRole })
--                 .from(queries)
--                 .leftJoin(users, eq(queries.userId, users.id))
--                 .orderBy(desc(queries.createdAt))
--      Used in:  fetchSupportQueries()  — staff branch
SELECT q."id",
       q."question",
       q."answer",
       q."created_at",
       u."full_name" AS "author_name",
       u."role"      AS "author_role"
  FROM "queries" q
  LEFT JOIN "users" u
    ON q."user_id" = u."id"
 ORDER BY q."created_at" DESC;


-- Q23: Fetch support queries — regular user view
--      Shows all answered queries + their own unanswered ones
--      Drizzle:  ... .where(or(isNotNull(queries.answer), eq(queries.userId, $1)))
--      Used in:  fetchSupportQueries()  — non-staff branch
SELECT q."id",
       q."question",
       q."answer",
       q."created_at",
       u."full_name" AS "author_name",
       u."role"      AS "author_role"
  FROM "queries" q
  LEFT JOIN "users" u
    ON q."user_id" = u."id"
 WHERE q."answer" IS NOT NULL
    OR q."user_id" = $1
 ORDER BY q."created_at" DESC;


-- Q24: Count unanswered support queries (shown as a badge in the sidebar)
--      Drizzle:  db.select({ value: count() }).from(queries).where(isNull(queries.answer))
--      Used in:  getUnansweredQueryCount()
SELECT COUNT(*) AS "value"
  FROM "queries"
 WHERE "answer" IS NULL;


-- ============================================================================
--  MODULE: LOGISTICS  (app/actions/logistics.js)
-- ============================================================================

-- Q25: Get logistics info for a specific user
--      Drizzle:  db.select().from(logistics).where(eq(logistics.userId, $1))
--      Used in:  getLogistics()
SELECT *
  FROM "logistics"
 WHERE "user_id" = $1;


-- Q26: Update existing logistics record for a user
--      Drizzle:  db.update(logistics)
--                 .set({ accommodationDetails, foodCouponProvided })
--                 .where(eq(logistics.userId, $1))
--      Used in:  updateLogistics()  — when record already exists
UPDATE "logistics"
   SET "accommodation_details" = $2,
       "food_coupon_provided"  = $3
 WHERE "user_id" = $1;


-- Q27: Insert new logistics record for a user
--      Drizzle:  db.insert(logistics).values({ userId, accommodationDetails, foodCouponProvided })
--      Used in:  updateLogistics()  — when no record exists yet (upsert pattern)
INSERT INTO "logistics" ("user_id", "accommodation_details", "food_coupon_provided")
VALUES ($1, $2, $3);


-- ============================================================================
--  END OF FILE
--  Total: 6 tables, 27 documented queries
-- ============================================================================
