# Phonebook Backend 3.1-3.6 Design — 2026-09-11

## Context
- Repo: fullstackopen, part3 kosong, part2 selesai s/d 2.20.
- Node v25.8.1, npm 11.4.0.
- Spec fixed dari course Full Stack Open exercises 3.1-3.6.
- Lokasi disepakati: `part3/phonebook-backend`
- Stack disepakati: Express + nodemon.

## Architecture
- Single-file Express app `index.js` di `part3/phonebook-backend`.
- In-memory array `persons` hardcoded 4 entries awal (id string "1"-"4").
- `express.json()` untuk parse POST body.
- Port 3001, `app.listen`.
- Scripts: `npm start` -> `node index.js`, `npm run dev` -> `nodemon index.js`.
- `.gitignore` di root backend berisi `node_modules`.

## Components / Endpoints
1. `GET /api/persons` -> 200 JSON array full.
2. `GET /info` -> 200 HTML: `Phonebook has info for N people<br/>Date`.
3. `GET /api/persons/:id` -> 200 single object, 404 `{ error: 'person not found' }` jika miss.
4. `DELETE /api/persons/:id` -> 204, filter array. 204 juga jika id tidak ada (idempotent sederhana).
5. `POST /api/persons` -> buat `{ name, number }`, id via `Math.floor(Math.random()*1000000).toString()`.
   - Validasi: missing name/number -> 400 `{ error: 'name or number missing' }`.
   - Duplicate name -> 400 `{ error: 'name must be unique' }`.
   - Sukses -> 200/201 JSON entry baru.

## Data Flow
- Client (browser/Postman/VS REST) -> Express router -> in-memory array -> JSON response.
- Terminal running server jadi observability utama (log request).

## Error Handling
- 400 untuk validasi POST dengan pesan jelas.
- 404 untuk GET single miss.
- 204 untuk DELETE sukses.
- Tidak ada DB, tidak ada auth, YAGNI.

## Testing
- Manual: browser untuk GET, Postman / VS REST client untuk DELETE/POST.
- Verifikasi: `npm start` jalan di 3001, `npm run dev` restart on save.
- `node_modules` tidak ter-commit.

## Alternatives Considered
- B. Node http murni: no-dep tapi verbose, parsing manual — ditolak.
- C. Modular split routes/controllers: overkill untuk 6 exercise — ditolak.
- Dipilih A: single-file Express, selaras materi Part 3.

## Scope Check
- Hanya 3.1-3.6. Tidak termasuk 3.7 morgan, 3.8+ frontend build, deploy, MongoDB, lint.
