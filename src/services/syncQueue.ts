import { storage } from './preferences';

interface QueueItem {
    type: 'create' | 'update' | 'delete';
    payload: any;
}

const KEY = 'sync_queue';

export const getQueue = (): QueueItem[] => {
    const data = storage.getString(KEY);

    return data ? JSON.parse(data) : [];
};

export const addToQueue = (item: QueueItem) => {
    const current = getQueue();

    current.push(item);

    storage.set(KEY, JSON.stringify(current));
};

export const removeFromQueue = (noteId: number) => {
    const queue = getQueue().filter(item => item.payload.id !== noteId);
    storage.set('sync_queue', JSON.stringify(queue));
};

export const isNoteQueued = (noteId: number): boolean => {
    return getQueue().some(item => Number(item.payload.id) === noteId);
};

export const processQueue = () => {
    const queue = getQueue();
    if (queue.length === 0) return;

    queue.forEach(item => {
        console.log(`Syncing ${item.type}:`, item.payload);
        removeFromQueue(item.payload.id);
    });
};