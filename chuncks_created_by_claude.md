# Bookmark Service — Development Chunks

---

## Chunk 1 — Project Setup
- Init Node.js project with TypeScript and Express
- Install core dependencies (express, typescript, ts-node, dotenv, etc.)
- Configure `tsconfig.json` and `package.json` scripts (`dev`, `build`, `start`)
- Create `.env` and config module that reads `PORT`, `DB_PATH` from environment
- Scaffold folder structure for the 3 layers:
  - `src/routes`
  - `src/services`
  - `src/repositories`

---

## Chunk 2 — Database Setup
- Install SQLite driver (`better-sqlite3` or `sqlite3`)
- Create DB connection module (reads path from config)
- Write migration that creates the `bookmarks` table:
  - `id` (PK autoincrement)
  - `title` VARCHAR(100)
  - `url` VARCHAR(200)
  - `description` VARCHAR(500)
  - `tags` VARCHAR(500)
  - `createdAt`
  - `updatedAt`
- Run migration on app startup

---

## Chunk 3 — Error Handling Middleware
- Create custom exception classes:
  - `BadRequestException` (400)
  - `BookmarkNotFoundException` (404)
  - `BookmarkException` (configurable status)
- Each accepts `string | string[]` as `errors` param
- Create error middleware:
  - Catches custom exceptions
  - Logs the original error
  - Returns shape:  
    `{ detail, httpStatus, errors[] }`
- Wire middleware into Express as the last middleware

---

## Chunk 4 — Add Bookmark  
### POST /bookmarks
- Define request validation:
  - `title` required
  - `url` must be valid URL
  - `description` optional
  - `tags` optional `string[]`
- Repository:
  - `insert` method (serialize tags as comma‑separated string)
- Service:
  - Call repository
  - Return created bookmark (deserialize tags back to `string[]`)
- Route handler:
  - validate → service → return **201**

---

## Chunk 5 — List Bookmarks  
### GET /bookmarks?tag={tagName}
- Repository:
  - `findAll(tag?: string)`  
  - If tag provided → filter with `LIKE` on the `tags` column
- Service:
  - Call repository
  - Deserialize tags for each result
- Route handler:
  - Read optional `tag` query param → service → return **200**

---

## Chunk 6 — Get Bookmark by ID  
### GET /bookmarks/:id
- Repository:
  - `findById(id)` — returns `null` if not found
- Service:
  - Call repository
  - Throw `BookmarkNotFoundException` if null
  - Deserialize tags
- Route handler:
  - service → return **200**

---

## Chunk 7 — Update Bookmark  
### PUT /bookmarks/:id
- Reuse same request validation as Chunk 4 (all fields, title and url required)
- Service:
  - Check existence (throw `BookmarkNotFoundException` if not found)
  - Then update
- Repository:
  - `update(id, data)` method
- Route handler:
  - validate → service → return **200**

---

## Chunk 8 — Delete Bookmark  
### DELETE /bookmarks/:id
- Service:
  - Check existence (throw `BookmarkNotFoundException` if not found)
  - Then delete
- Repository:
  - `deleteById(id)` method
- Route handler:
  - service → return **204 (no content)**

---

## Chunk 9 — Health Check  
### GET /health
- Single route, no service/repository needed
- Returns `{ "db": "ok" }` if db is working  **200**

---

## Suggested Implementation Order
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9  
- Chunks **3–9** depend on **1 and 2**  
- Chunks **4–9** are independent once **3** is ready
