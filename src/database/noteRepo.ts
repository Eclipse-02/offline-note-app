import { SQLiteDatabase } from 'expo-sqlite';
import { addToQueue } from '@/services/syncQueue';
import { Note } from '@/types/note';

export const createNote = async (title: string, content: string, db: SQLiteDatabase) => {
    const now = new Date().toISOString();

    const result = await db.runAsync(
        `INSERT INTO notes (title, content, created_at, updated_at)
        VALUES (?, ?, ?, ?)`,
        [title, content, now, now]
    );

    addToQueue({
        type: 'create',
        payload: {
            id: String(result.lastInsertRowId),
            title,
            content,
            created_at: now,
            updated_at: now,
        },
    });
};

export const getNotes = async (db: SQLiteDatabase): Promise<Note[]> => {
    const data = await db.getAllAsync<Note>(
        `SELECT * FROM notes ORDER BY updated_at DESC`
    );

    return data ?? [];
};

export const getNoteById = async (id: number, db: SQLiteDatabase): Promise<Note | null> => {
    const result = await db.getFirstAsync<Note>(
        `SELECT * FROM notes WHERE id = ?`,
        [id]
    );

    return result ?? null;
};

export const updateNote = async (id: number, title: string, content: string, db: SQLiteDatabase) => {
    const now = new Date().toISOString();

    await db.runAsync(
        `UPDATE notes
        SET title = ?, content = ?, updated_at = ?
        WHERE id = ?`,
        [title, content, now, id]
    );

    addToQueue({
        type: 'update',
        payload: {
            id: String(id),
            title,
            content,
            updated_at: now,
        },
    });
};

export const deleteNote = async (id: number, db: SQLiteDatabase) => {
    await db.runAsync(
        `DELETE FROM notes WHERE id = ?`,
        [id]
    );

    addToQueue({
        type: 'delete',
        payload: {
            id: String(id),
        },
    });
};

export const searchNotes = async (keyword: string, db: SQLiteDatabase): Promise<Note[]> => {
    return await db.getAllAsync<Note>(
        `SELECT * FROM notes
        WHERE title LIKE ?
        OR content LIKE ?
        ORDER BY updated_at DESC`,
        [`%${keyword}%`, `%${keyword}%`]
    );
};