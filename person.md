# Team Role Distribution - Backend & DBMS

This document outlines the distribution of the **Backend** and **DBMS (Database Management System)** tasks for the Aarohanhub platform. The backend workload has been divided into 10 key parts and assigned among the 9 team members to present during reviews.

*(Note: No frontend tasks are included in this distribution. As there are 9 members and 10 parts, Supprit has been assigned two parts to cover the entire scope.)*

## Task Assignments

### 1. Database Initialization & ORM Configurations
**Assigned to:** Aman(CSE)
* **DBMS:** Set up the main PostgreSQL database instance, configure the Drizzle ORM connection pool, and establish the base migration scripts.
* **Backend:** Implement database connection utility functions and manage backend environment variables securely.

### 2. User Schema & Authentication APIs (RBAC)
**Assigned to:** Ashok
* **DBMS:** Design the `Users` and `Roles` tables, ensuring correct relational structures and indexing for fast lookups.
* **Backend:** Build server actions and API routes to handle secure login, session token validation, and Strict Role-Based Access Control (RBAC) middleware for the 5 user categories.

### 3. Event Handling APIs & Schema
**Assigned to:** Ayush Chandra
* **DBMS:** Architect the `Events` table, detailing event attributes like timestamps, capacity, location, and organizer IDs.
* **Backend:** Develop robust API endpoints/server actions for the CRUD operations required by Organizers to manage festival events.

### 4. Participant Registration API & Models
**Assigned to:** Dheeraj Patel
* **DBMS:** Develop the `Registrations` relational junction table to map users to their selected events.
* **Backend:** Write backend logic to process secure event registrations, ensuring venue capacity checks and preventing duplicate sign-ups.

### 5. Accommodation Logistics & Allocation APIs
**Assigned to:** J.Sahana Sri
* **DBMS:** Construct the `Accommodations` database entity to track hostels, room availability, and allocation status.
* **Backend:** Build APIs that handle accommodation requests from external participants and backend scripts to process room distribution.

### 6. Food Logistics Schema & Verification APIs
**Assigned to:** Pallavi Kumari
* **DBMS:** Design the data structures (`FoodPasses`, `MealTracking`) needed to catalog meal provisions per user.
* **Backend:** Implement server-side validation logic that updates meal redemption metrics securely when participants claim their food passes.

### 7. Volunteer Database Management Logic
**Assigned to:** Ranjith
* **DBMS:** Build the schema extending student details to include `Volunteer` status and mapping them to specific tasks.
* **Backend:** Write backend logic enabling student-to-volunteer applications, and secure data-fetching routes for Organizers to assign volunteer tasks.

### 8. Real-Time Announcements Backend
**Assigned to:** Vamshi Reddy
* **DBMS:** Implement the `Announcements` table dedicated to storing official winner results safely.
* **Backend:** Engineer the backend infrastructure needed for live broadcasting (e.g., SSE or optimized API polling) to push winner updates across the platform instantly.

### 9. LLM (Groq) API Integrations
**Assigned to:** Supprit
* **DBMS:** Define safe read-only SQL views that safely expose necessary platform metrics to the AI integration.
* **Backend:** Implement the Groq SDK, format dynamic prompt queries, and build the dedicated server route connecting user AI queries with database context.

### 10. Dashboard Analytics & Data Optimization
**Assigned to:** Supprit
* **DBMS:** Formulate optimized, complex queries (joins/aggregations via Drizzle) to aggregate data needed for the Administrator and Organizer dashboards.
* **Backend:** Set up Next.js caching algorithms (unstable_cache or fetch caching) to minimize database load when rendering heavy analytics dashboards.
