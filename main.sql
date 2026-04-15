-- AarohanHub MySQL Complete Schema + Queries

-- =========================
-- TABLES
-- =========================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    role TEXT DEFAULT 'external',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    schedule TIMESTAMP,
    winner_id INT,
    organizer_id INT,
    FOREIGN KEY (winner_id) REFERENCES users(id)
        ON DELETE SET NULL,
    FOREIGN KEY (organizer_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    event_id INT,
    is_volunteer TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE logistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    accommodation_details TEXT,
    food_coupon_provided TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE verification_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    answered_by_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (answered_by_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =========================
-- SAMPLE QUERIES
-- =========================

-- AUTH
SELECT * FROM users WHERE email = ?;
INSERT INTO verification_tokens (email, token, expires_at) VALUES (?, ?, ?);
SELECT * FROM verification_tokens WHERE email = ? AND token = ? ORDER BY expires_at DESC;
INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?);
DELETE FROM verification_tokens WHERE email = ?;
SELECT * FROM users WHERE email = ? AND password = ?;

-- ADMIN
SELECT * FROM users WHERE role <> 'dba';
DELETE FROM registrations WHERE user_id = ?;
DELETE FROM users WHERE id = ?;

-- EVENTS
SELECT e.id, e.title, e.description, e.schedule,
       r.id AS is_registered,
       e.winner_id,
       u.full_name AS winner_name,
       u.email AS winner_email
FROM events e
LEFT JOIN users u ON e.winner_id = u.id
LEFT JOIN registrations r ON r.event_id = e.id AND r.user_id = ?;

INSERT INTO events (title, description, schedule) VALUES (?, ?, ?);
DELETE FROM registrations WHERE event_id = ?;
DELETE FROM events WHERE id = ?;
UPDATE events SET title = ?, description = ? WHERE id = ?;
SELECT * FROM events WHERE id = ?;
SELECT * FROM registrations WHERE user_id = ? AND event_id = ?;
INSERT INTO registrations (user_id, event_id, is_volunteer) VALUES (?, ?, ?);

SELECT r.id, r.user_id, u.full_name, u.email, u.role, r.is_volunteer
FROM registrations r
LEFT JOIN users u ON r.user_id = u.id
WHERE r.event_id = ?;

UPDATE events SET winner_id = ? WHERE id = ?;
SELECT id FROM events WHERE winner_id = ?;

-- SUPPORT
INSERT INTO queries (user_id, question) VALUES (?, ?);
UPDATE queries SET answer = ?, answered_by_id = ? WHERE id = ?;

SELECT q.id, q.question, q.answer, q.created_at,
       u.full_name AS author_name,
       u.role AS author_role
FROM queries q
LEFT JOIN users u ON q.user_id = u.id
ORDER BY q.created_at DESC;

SELECT q.id, q.question, q.answer, q.created_at,
       u.full_name AS author_name,
       u.role AS author_role
FROM queries q
LEFT JOIN users u ON q.user_id = u.id
WHERE q.answer IS NOT NULL OR q.user_id = ?
ORDER BY q.created_at DESC;

SELECT COUNT(*) AS value FROM queries WHERE answer IS NULL;

-- LOGISTICS
SELECT * FROM logistics WHERE user_id = ?;
UPDATE logistics SET accommodation_details = ?, food_coupon_provided = ? WHERE user_id = ?;
INSERT INTO logistics (user_id, accommodation_details, food_coupon_provided) VALUES (?, ?, ?);
