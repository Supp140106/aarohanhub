This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Project Documentation: Aarohan 2026 Platform

## 1. Abstract
The Aarohan 2026 Platform is a comprehensive, AI-integrated web application designed to manage a university technical festival. Built to handle diverse user needs, the platform serves five distinct roles: External Participants, Student Registrants, Volunteers, Organizers, and Database Administrators. It streamlines everything from event registration and scheduling to logistics (accommodation and food) and real-time winner announcements. Utilizing a modern tech stack (Next.js, PostgreSQL) alongside integrated Machine Learning functionalities (LLM support via Groq API), the platform serves as a unified DBMS+ML solution to automate and elevate the management of a large-scale university festival.

## 2. Introduction
**Background and Purpose:** 
Managing a large-scale university technical festival involves coordinating thousands of participants, multiple simultaneous events, complex logistics, and dynamic roles. Traditional, disjointed methods often fall short in providing real-time updates and an engaging user experience. The Aarohan 2026 platform was developed to solve this by providing a unified, scalable digital infrastructure with integrated AI capabilities.

**Problem Statement:** 
To design and develop a web application for managing a university technical festival ('Aarohan'). The system must cater to five specific user roles: External Participants, Student Registrants, Volunteers, Event Organizers, and Database Administrators. It needs to provide role-specific functionalities such as event browsing, registration, real-time winner updates, logistics management (food and accommodation), and administrative controls. Additionally, the application must integrate a modern database with Machine Learning (LLM) functionalities to solve relevant data or interaction problems within the platform.

## 3. Objectives
*   **Role-Based Access Control:** Deliver tailored experiences and secure permissions for External Participants, Students, Volunteers, Organizers, and DB Admins.
*   **Centralized Event & Logistics Hub:** Allow users to browse schedules, register for events, and access accommodation and food logistics smoothly.
*   **Real-time Updates:** Push live updates of event winners so all participants stay informed in real time.
*   **DBMS + ML Integration:** Successfully integrate Large Language Model (LLM) capabilities with the underlying database as per the problem statement requirement.
*   **Administrative Robustness:** Enable DB Administrators to effortlessly add or delete users and maintain overall system integrity.

## 4. Methodology / Working
**System Flow:**
1.  **Onboarding & Role Selection:** Users arrive at the immersive landing page and create accounts representing their specific user type (External, Student, Organizer, etc.).
2.  **Dashboard Access & Capabilities:**
    *   *External Participants:* Browse/search events, register, view real-time winners, and view logistics (food/accommodation).
    *   *Student Registrants:* Similar to external participants, but with the added ability to apply/register as a volunteer.
    *   *Organizers:* Access restricted dashboards to browse event details, and view/search volunteer and logistics details.
    *   *DB Administrators:* Access a master panel to add or delete new generic users.
3.  **Data & ML Processing:** The frontend communicates with the Next.js backend, querying PostgreSQL. An integrated LLM (via Groq) processes complex data searches or provides automated insights from the database.

## 5. Technologies Used
*   **Next.js (React Framework):** Used for server-side rendering, routing, and building scalable full-stack web applications.
*   **PostgreSQL & Drizzle ORM:** A powerful relational database system coupled with a type-safe ORM to securely manage the complex data models (Users, Events, Logistics, Volunteers).
*   **Groq SDK (LLM Support):** Integrated ML functionalities to support the overarching DBMS+ML requirement.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development and responsive design.
*   **Framer Motion & Spline:** Used for crafting smooth visual transitions, scroll-reveals, and embedded interactive 3D elements.

## 6. Features
*   **Five Distinct User Portals:** Specialized access and dashboards designed distinctly for the needs of the 5 targeted user categories.
*   **Logistics Module:** Dedicated tracking and information provisions for accommodation and food.
*   **Volunteer Management:** Built-in flows for students to register as volunteers, giving organizers an easy way to view and assign manpower and logistics.
*   **Real-Time Announcements:** Live broadcasting of competition winners directly to the frontend.
*   **LLM-Powered DB Integrations:** Smart data interactions using machine learning functionalities paired alongside standard database queries.

## 7. Implementation
1.  **Database Design:** Crafting strict relational schemas in PostgreSQL for Users, Roles, Events, Registrations, Accommodations, and Logistics.
2.  **Project Setup:** Initializing the Next.js application, configuring Tailwind CSS, and setting up the file structure (App Router).
3.  **Authentication & Authorization:** Implementing secure login flows emphasizing Strict Role-Based Access Control (RBAC).
4.  **UI/UX Development:** Building reusable React components using high-contrast dark themes and animations.
5.  **ML Integration:** Connecting the Groq LLM API to process inputs against the database context.

## 8. Results / Output
The project delivers a fully-functional, role-based DBMS+ML application that fulfills all required criteria of managing 'Aarohan'. It effectively digitizes the complex logistical and event-management workload previously handled manually, running on a highly performant, visually striking modern web stack.

## 9. Advantages and Limitations
**Advantages:**
*   A true all-in-one solution handling everything from participant registrations to food and accommodation logistics.
*   Integrated ML provides a modern twist, fulfilling the specific DBMS+ML criteria.
*   Highly performant and SEO-friendly due to Next.js server-side rendering.

**Limitations:**
*   Managing complex Role-Based Access across 5 distinct roles requires rigorous security testing to ensure data isolation.
*   LLM integrations rely on external API latency (Groq) which requires internet connectivity.

## 10. Future Scope
*   **Mobile Application:** Developing native iOS and Android versions using React Native for offline access and push notifications.
*   **Predictive Logistics Allocation:** Expanding the ML aspect to predict accommodation and food requirements based on historical registration velocity.
*   **Live Chat / Networking:** Implementing WebSockets for real-time peer-to-peer communication between participants during hackathons.

## 11. Conclusion
The Aarohan 2026 web platform successfully solves the specific design brief for managing a university technical festival. By catering strictly to the five distinct user roles and integrating both robust DBMS architecture alongside LLM operations, the platform tackles modern logistical challenges while providing a premium, cutting-edge user experience.

## 12. References
*   Next.js Official Documentation: https://nextjs.org/docs
*   PostgreSQL Documentation: https://www.postgresql.org/docs/
*   Groq API Documentation: https://console.groq.com/docs/
*   Framer Motion Documentation: https://www.framer.com/motion/
