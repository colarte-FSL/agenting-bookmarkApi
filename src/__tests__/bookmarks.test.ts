import request from 'supertest';
import app from '../app';
import { getDb } from '../repositories/db';
import { runMigrations } from '../repositories/migrate';

let accessToken: string;

beforeAll(async () => {
  runMigrations();
  const res = await request(app).post('/auth/token');
  accessToken = res.body.accessToken as string;
});

beforeEach(() => {
  getDb().exec('DELETE FROM bookmarks');
});

// ── Helpers ──────────────────────────────────────────────────────────────────

async function createBookmark(overrides = {}) {
  return request(app)
    .post('/bookmarks')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ title: 'Test', url: 'https://example.com', tags: ['test'], ...overrides });
}

// ── POST /bookmarks ───────────────────────────────────────────────────────────

describe('POST /bookmarks', () => {
  it('creates a bookmark and returns 201', async () => {
    const res = await createBookmark({
      title: 'TypeScript',
      url: 'https://typescriptlang.org',
      description: 'TS docs',
      tags: ['typescript', 'docs'],
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      title: 'TypeScript',
      url: 'https://typescriptlang.org',
      description: 'TS docs',
      tags: ['typescript', 'docs'],
    });
  });

  it('returns 400 when title is missing and url is invalid', async () => {
    const res = await request(app)
      .post('/bookmarks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ url: 'not-a-url' });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ httpStatus: 400 });
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});

// ── GET /bookmarks ────────────────────────────────────────────────────────────

describe('GET /bookmarks', () => {
  it('returns all bookmarks', async () => {
    await createBookmark({ title: 'A', tags: ['x'] });
    await createBookmark({ title: 'B', tags: ['y'] });

    const res = await request(app).get('/bookmarks').set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('filters by tag and returns only matching bookmarks', async () => {
    await createBookmark({ title: 'TS', tags: ['typescript'] });
    await createBookmark({ title: 'Node', tags: ['nodejs'] });

    const res = await request(app).get('/bookmarks?tag=typescript').set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('TS');
  });
});

// ── GET /bookmarks/:id ────────────────────────────────────────────────────────

describe('GET /bookmarks/:id', () => {
  it('returns the bookmark for a valid id', async () => {
    const created = await createBookmark({ title: 'Find Me' });
    const { id } = created.body;

    const res = await request(app).get(`/bookmarks/${id}`).set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id, title: 'Find Me' });
  });

  it('returns 404 when bookmark does not exist', async () => {
    const res = await request(app).get('/bookmarks/999').set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ httpStatus: 404 });
  });
});

// ── PUT /bookmarks/:id ────────────────────────────────────────────────────────

describe('PUT /bookmarks/:id', () => {
  it('updates and returns the bookmark', async () => {
    const created = await createBookmark({ title: 'Before' });
    const { id } = created.body;

    const res = await request(app)
      .put(`/bookmarks/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'After', url: 'https://updated.com', tags: ['new'] });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id, title: 'After', url: 'https://updated.com', tags: ['new'] });
  });

  it('returns 404 when bookmark does not exist', async () => {
    const res = await request(app)
      .put('/bookmarks/999')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'X', url: 'https://example.com' });

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ httpStatus: 404 });
  });
});

// ── DELETE /bookmarks/:id ─────────────────────────────────────────────────────

describe('DELETE /bookmarks/:id', () => {
  it('deletes the bookmark and returns 204', async () => {
    const created = await createBookmark();
    const { id } = created.body;

    const res = await request(app).delete(`/bookmarks/${id}`).set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(204);
  });

  it('returns 404 when bookmark does not exist', async () => {
    const res = await request(app).delete('/bookmarks/999').set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ httpStatus: 404 });
  });
});

// ── GET /health ───────────────────────────────────────────────────────────────

describe('GET /health', () => {
  it('returns db ok when database is reachable', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ db: 'ok' });
  });
});
