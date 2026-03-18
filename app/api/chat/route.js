import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { users, events, registrations, logistics } from '@/db/schema';
import { eq, ne, count, and } from 'drizzle-orm';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// =====================================================================
// DOMAIN KNOWLEDGE - This is injected into every prompt so the LLM 
// fully understands the platform.
// =====================================================================
const DOMAIN_KNOWLEDGE = `
## Aarohan 2026 - Platform Knowledge Base

### What is Aarohan?
Aarohan is a college tech festival organized by NIT Durgapur. This platform ("Aarohan Hub") manages event registrations, user management, and logistics for the festival.

### Database Schema

#### 1. Users Table
Columns: id, full_name, email, password, role, created_at
Roles are one of: "external", "student", "volunteer", "organizer", "dba"

**CRITICAL ROLE TERMINOLOGY MAPPING:**
- "student" role = Internal Students (students of NIT Durgapur)
- "external" role = External Participants (from other colleges/outside)
- "volunteer" role = Festival Volunteers (staff who help run the event)
- "organizer" role = Event Organizers
- "dba" role = Database Administrator / Super Admin

When users say "internal students", they mean users with role="student".
When users say "external participants" or "outsiders", they mean users with role="external".
When users say "volunteers" or "staff", they mean users with role="volunteer".
When users say "admin", they mean users with role="dba".

#### 2. Events Table
Columns: id, title, description, schedule, winner_id
Events are festival competitions and workshops that participants can register for.

#### 3. Registrations Table (Many-to-Many)
Columns: id, user_id, event_id, is_volunteer
Links users to events. The is_volunteer flag indicates if they are volunteering for that event.
NOTE: Volunteers CANNOT register as participants for events. Only students and external users can register.

#### 4. Logistics Table
Columns: id, user_id, accommodation_details, food_coupon_provided
Stores accommodation and food coupon info. Only assigned to students and external participants, NOT to volunteers.

### Platform Rules
1. Volunteers manage logistics and view registrations, but cannot register for events themselves.
2. DBAs (admins) have full access to everything.
3. Students and External users can only see their own data.
4. The chatbot is READ-ONLY - it cannot create, modify, or delete any data.
`;

// =====================================================================
// DATA FETCHING - Role-gated data retrieval
// =====================================================================
async function getContextForRole(role, userId) {
    let context = '';

    // --- User Stats (available to everyone) ---
    const userCounts = await db
        .select({ role: users.role, count: count() })
        .from(users)
        .groupBy(users.role);

    const totalUsers = userCounts.reduce((sum, r) => sum + Number(r.count), 0);
    context += `### Platform Statistics\n`;
    context += `Total registered users: ${totalUsers}\n`;
    userCounts.forEach(r => {
        const label = r.role === 'student' ? 'Internal Students' :
            r.role === 'external' ? 'External Participants' :
                r.role === 'volunteer' ? 'Volunteers' :
                    r.role === 'organizer' ? 'Organizers' :
                        r.role === 'dba' ? 'Admins (DBA)' : r.role;
        context += `- ${label} (role="${r.role}"): ${r.count}\n`;
    });

    // --- Event Info (available to everyone) ---
    const allEvents = await db.select().from(events);
    context += `\n### Events (${allEvents.length} total)\n`;
    allEvents.forEach(e => {
        context += `- "${e.title}" (ID: ${e.id}) - ${e.description || 'No description'} - Scheduled: ${e.schedule ? new Date(e.schedule).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'TBA'}\n`;
    });

    // --- Registration counts per event (available to everyone) ---
    const regCounts = await db
        .select({ eventId: registrations.eventId, count: count() })
        .from(registrations)
        .groupBy(registrations.eventId);

    context += `\n### Registration Counts per Event\n`;
    for (const rc of regCounts) {
        const evt = allEvents.find(e => e.id === rc.eventId);
        context += `- "${evt?.title || 'Unknown'}" (Event ID ${rc.eventId}): ${rc.count} registrations\n`;
    }

    // --- Role-gated detailed data ---
    if (role === 'dba') {
        // DBA sees ALL users with full details
        const allUsers = await db.select({
            id: users.id,
            fullName: users.fullName,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
        }).from(users);

        context += `\n### All Users (${allUsers.length} total)\n`;
        allUsers.forEach(u => {
            const roleLabel = u.role === 'student' ? 'Internal Student' :
                u.role === 'external' ? 'External Participant' :
                    u.role === 'volunteer' ? 'Volunteer' :
                        u.role === 'organizer' ? 'Organizer' :
                            u.role === 'dba' ? 'Admin' : u.role;
            context += `- [ID:${u.id}] ${u.fullName} | Email: ${u.email} | Role: ${roleLabel} (${u.role}) | Joined: ${u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}\n`;
        });

        // DBA sees all registrations with user + event names
        const allRegs = await db.select({
            regId: registrations.id,
            userName: users.fullName,
            userEmail: users.email,
            userRole: users.role,
            eventTitle: events.title,
            eventId: registrations.eventId,
            isVolunteer: registrations.isVolunteer,
        }).from(registrations)
            .leftJoin(users, eq(registrations.userId, users.id))
            .leftJoin(events, eq(registrations.eventId, events.id));

        context += `\n### All Event Registrations (${allRegs.length} total)\n`;
        if (allRegs.length === 0) {
            context += `No registrations exist yet.\n`;
        } else {
            allRegs.forEach(r => {
                context += `- ${r.userName} (${r.userEmail}, ${r.userRole}) → registered for "${r.eventTitle}"${r.isVolunteer ? ' [as volunteer]' : ''}\n`;
            });
        }

        // DBA sees all logistics
        const allLogistics = await db.select({
            userName: users.fullName,
            userEmail: users.email,
            userRole: users.role,
            accommodationDetails: logistics.accommodationDetails,
            foodCouponProvided: logistics.foodCouponProvided,
        }).from(logistics)
            .leftJoin(users, eq(logistics.userId, users.id));

        context += `\n### All Logistics (${allLogistics.length} entries)\n`;
        if (allLogistics.length === 0) {
            context += `No logistics entries exist yet.\n`;
        } else {
            allLogistics.forEach(l => {
                context += `- ${l.userName} (${l.userEmail}): Accommodation: "${l.accommodationDetails || 'Not assigned'}"; Food Coupon: ${l.foodCouponProvided ? 'YES ✓' : 'NO ✗'}\n`;
            });
        }

    } else if (role === 'volunteer') {
        // Volunteer sees non-DBA users
        const visibleUsers = await db.select({
            id: users.id,
            fullName: users.fullName,
            email: users.email,
            role: users.role,
        }).from(users).where(ne(users.role, 'dba'));

        context += `\n### Visible Users (${visibleUsers.length}, excludes admins)\n`;
        visibleUsers.forEach(u => {
            const roleLabel = u.role === 'student' ? 'Internal Student' :
                u.role === 'external' ? 'External Participant' :
                    u.role === 'volunteer' ? 'Volunteer' : u.role;
            context += `- [ID:${u.id}] ${u.fullName} | ${u.email} | ${roleLabel} (${u.role})\n`;
        });

        // All registrations
        const allRegs = await db.select({
            userName: users.fullName,
            userRole: users.role,
            eventTitle: events.title,
        }).from(registrations)
            .leftJoin(users, eq(registrations.userId, users.id))
            .leftJoin(events, eq(registrations.eventId, events.id));

        context += `\n### All Event Registrations (${allRegs.length} total)\n`;
        if (allRegs.length === 0) {
            context += `No registrations exist yet.\n`;
        } else {
            allRegs.forEach(r => {
                context += `- ${r.userName} (${r.userRole}) → "${r.eventTitle}"\n`;
            });
        }

        // Logistics for non-volunteers
        const visibleLogistics = await db.select({
            userName: users.fullName,
            userRole: users.role,
            accommodationDetails: logistics.accommodationDetails,
            foodCouponProvided: logistics.foodCouponProvided,
        }).from(logistics)
            .leftJoin(users, eq(logistics.userId, users.id));
        const filtered = visibleLogistics.filter(l => l.userRole !== 'volunteer');

        context += `\n### Logistics (${filtered.length} entries, volunteers excluded)\n`;
        if (filtered.length === 0) {
            context += `No logistics entries exist yet.\n`;
        } else {
            filtered.forEach(l => {
                context += `- ${l.userName}: Accommodation: "${l.accommodationDetails || 'Not assigned'}"; Food Coupon: ${l.foodCouponProvided ? 'YES' : 'NO'}\n`;
            });
        }

    } else {
        // Student or External: only own data
        context += `\n### Your Data (you can only see your own information)\n`;

        // Own registrations
        const ownRegs = await db.select({
            eventTitle: events.title,
            schedule: events.schedule,
        }).from(registrations)
            .leftJoin(events, eq(registrations.eventId, events.id))
            .where(eq(registrations.userId, userId));

        context += `\n#### Your Event Registrations (${ownRegs.length})\n`;
        if (ownRegs.length === 0) {
            context += `You have not registered for any events yet.\n`;
        } else {
            ownRegs.forEach(r => {
                context += `- "${r.eventTitle}" - ${r.schedule ? new Date(r.schedule).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'TBA'}\n`;
            });
        }

        // Own logistics
        const ownLogistics = await db.select().from(logistics).where(eq(logistics.userId, userId));
        context += `\n#### Your Logistics\n`;
        if (ownLogistics.length > 0) {
            const l = ownLogistics[0];
            context += `- Accommodation: ${l.accommodationDetails || 'Not assigned yet'}\n`;
            context += `- Food Coupon: ${l.foodCouponProvided ? 'Provided ✓' : 'Not provided yet'}\n`;
        } else {
            context += `No logistics information assigned to you yet. Contact a volunteer for updates.\n`;
        }
    }

    return context;
}

// =====================================================================
// SYSTEM PROMPT BUILDER
// =====================================================================
function buildSystemPrompt(role, userName, dataContext) {
    const roleLabel = role === 'student' ? 'Internal Student' :
        role === 'external' ? 'External Participant' :
            role === 'volunteer' ? 'Volunteer' :
                role === 'dba' ? 'Admin (DBA)' : role;

    const accessDescription = role === 'dba'
        ? 'You have FULL access to all platform data including all users, events, registrations, and logistics.'
        : role === 'volunteer'
            ? 'You can see all non-admin users, all event registrations, and logistics for participants (not volunteers). You CANNOT see admin/DBA user details.'
            : 'You can ONLY see your own registrations and logistics, plus general event and platform statistics. You CANNOT see other users\' data. If asked about other users, politely explain they need a higher access level.';

    return `You are **Aarohan Assistant**, the official AI chatbot for the Aarohan 2026 Tech Festival Hub at NIT Durgapur.

${DOMAIN_KNOWLEDGE}

## Current User Session
- Name: ${userName}
- Role: **${roleLabel}** (raw: "${role}")
- Access Level: ${accessDescription}

## LIVE DATA FROM DATABASE
The following is REAL, LIVE data queried directly from the database. Use ONLY this data to answer questions. Do NOT make up or assume any data that is not listed here.

${dataContext}

## Rules
1. **BE BEAUTIFUL.** Use rich Markdown. Use tables for lists of users or registrations. Use headers for different sections.
2. **Double-verify counts.** If you see 3 internal students in the data, say exactly 3.
3. **Be concise.** Don't repeat the context back to the user unless they ask for a list.
4. If data is not in the context above, say "I don't have that live information."
5. Never reveal passwords, tokens, or sensitive auth data.
6. Use emojis sparingly but effectively to make the chat feel alive.
7. Format responses for maximum readability (Bold headers, clear bullet points, clean tables).
8. **You are READ-ONLY.** You cannot create, delete, or modify anything. If asked to do so, politely explain.
9. **Count carefully.** When asked "how many", count from the actual data above. Double check your count.
10. **For greetings and casual chat**, respond naturally like a friendly assistant. You don't need data for "hi", "how are you", etc.
11. **If data has 0 entries** (e.g., "No registrations exist yet"), report that honestly. Don't say you can't find it - say there are none.`;
}

// =====================================================================
// API HANDLER
// =====================================================================
export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');

        if (!sessionCookie) {
            return NextResponse.json({ error: 'Please log in to use the chatbot.' }, { status: 401 });
        }

        const session = JSON.parse(sessionCookie.value);
        const { message, history = [] } = await request.json();

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
        }

        // Fetch live role-gated context from DB
        const dataContext = await getContextForRole(session.role, session.userId);
        const systemPrompt = buildSystemPrompt(session.role, session.name, dataContext);

        // Build messages for Groq - keep last 10 exchanges for memory
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-10),
            { role: 'user', content: message.trim() },
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1, // Very low temperature to minimize hallucination
            max_tokens: 1024,
            top_p: 0.9,
            stream: true,
        });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of chatCompletion) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
            },
        });
    } catch (error) {
        console.error('Chatbot API Error:', error);

        if (error?.message?.includes('API key') || error?.status === 401) {
            return NextResponse.json({ error: 'Groq API key is not configured or is invalid. Please check GROQ_API_KEY in your .env file.' }, { status: 500 });
        }
        if (error?.status === 429) {
            return NextResponse.json({ error: 'Rate limit reached. Please wait a moment and try again.' }, { status: 429 });
        }

        return NextResponse.json({ error: 'Something went wrong with the chatbot. Please try again.' }, { status: 500 });
    }
}
