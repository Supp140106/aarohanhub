'use server';

import { db } from '@/db';
import { queries, users } from '@/db/schema';
import { eq, or, and, isNotNull, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

async function getSession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) return null;
    return JSON.parse(sessionCookie.value);
}

export async function submitQuery(formData) {
    const session = await getSession();
    if (!session) return { error: "Unauthorized. Please log in first." };

    const question = formData.get('question');
    if (!question || question.trim().length === 0) {
        return { error: "Question cannot be empty." };
    }

    try {
        await db.insert(queries).values({
            userId: session.userId,
            question: question.trim()
        });
        revalidatePath('/support');
        return { success: true };
    } catch (e) {
        console.error("Submit Query Error:", e);
        return { error: "Failed to submit query. Please try again later." };
    }
}

export async function answerQuery(formData) {
    const session = await getSession();
    if (!session || (session.role !== 'dba' && session.role !== 'volunteer')) {
        return { error: "Unauthorized. Only staff can answer queries." };
    }

    const queryId = formData.get('queryId');
    const answer = formData.get('answer');

    if (!queryId || !answer || answer.trim().length === 0) {
        return { error: "Answer cannot be empty." };
    }

    try {
        await db.update(queries)
            .set({ 
                answer: answer.trim(),
                answeredById: session.userId 
            })
            .where(eq(queries.id, Number(queryId)));
            
        revalidatePath('/support');
        return { success: true };
    } catch (e) {
        console.error("Answer Query Error:", e);
        return { error: "Failed to post answer." };
    }
}

export async function fetchSupportQueries() {
    const session = await getSession();
    if (!session) return [];

    const isStaff = session.role === 'dba' || session.role === 'volunteer';

    try {
        let results;
        // Construct base query joining with 'users' for author details
        const baseQuery = db.select({
            id: queries.id,
            question: queries.question,
            answer: queries.answer,
            createdAt: queries.createdAt,
            authorName: users.fullName,
            authorRole: users.role,
        })
        .from(queries)
        .leftJoin(users, eq(queries.userId, users.id))
        .orderBy(desc(queries.createdAt));

        if (isStaff) {
            // Staff see everything
            results = await baseQuery;
        } else {
            // Regular users see Answered queries OR their own pending queries
            results = await baseQuery.where(
                or(
                    isNotNull(queries.answer),
                    eq(queries.userId, session.userId)
                )
            );
        }

        return results;
    } catch (e) {
        console.error("Fetch Queries Error:", e);
        return [];
    }
}
