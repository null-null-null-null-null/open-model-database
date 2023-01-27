import { UpdateRequest } from './api';
import { Model, ModelId, Tag, TagId, User, UserId } from './schema';
import { lazy } from './util';

function assert200(res: Response): void {
    if (res.status !== 200) {
        throw new Error(res.statusText);
    }
}

export class DBWriter {
    async updateModels(updates: readonly UpdateRequest<ModelId, Model>[]): Promise<void> {
        return fetch('/api/models', { method: 'POST', body: JSON.stringify(updates) }).then(assert200);
    }

    async updateTags(updates: readonly UpdateRequest<TagId, Tag>[]): Promise<void> {
        return fetch('/api/tags', { method: 'POST', body: JSON.stringify(updates) }).then(assert200);
    }

    async updateUsers(updates: readonly UpdateRequest<UserId, User>[]): Promise<void> {
        return fetch('/api/users', { method: 'POST', body: JSON.stringify(updates) }).then(assert200);
    }
}

export const getWriter = lazy(async (): Promise<DBWriter | undefined> => {
    const writer = new DBWriter();
    // we do an empty update to test the waters
    return writer.updateTags([]).then(
        () => writer,
        () => undefined
    );
});

export const isInEditMode = getWriter().then((writer) => writer !== undefined);