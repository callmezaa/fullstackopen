# Phonebook Backend 3.1-3.6 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Express backend in part3/phonebook-backend passing 3.1-3.6.

**Architecture:** Single-file Express app with in-memory persons array, JSON parsing, 5 routes, manual verification via browser/curl.

**Tech Stack:** Node v25.8.1, Express 5.x, nodemon, PowerShell 5.1 for verification.

## Global Constraints

- Location: `part3/phonebook-backend/index.js`
- Port: 3001, no Vite, `npm init` style backend.
- `node_modules` must be gitignored via `.gitignore` containing `node_modules`.
- `npm start` runs `node index.js`, `npm run dev` runs `nodemon index.js`.
- IDs are strings, POST id via `Math.random`.
- POST errors return 400 with `{ error: '...' }`.

---

### Task 1: Scaffold backend + GET all + info

**Files:**
- Create: `part3/phonebook-backend/package.json`
- Create: `part3/phonebook-backend/index.js`
- Create: `part3/phonebook-backend/.gitignore`
- Test: manual via `Invoke-WebRequest` in PowerShell

**Interfaces:**
- Consumes: none
- Produces: `GET /api/persons` -> 200 JSON array, `GET /info` -> 200 HTML, `app.listen(3001)`

- [ ] **Step 1: Create folder and init npm**

Run:
```bash
New-Item -ItemType Directory -Path "part3/phonebook-backend" -Force
npm init -y
npm install express
npm install --save-dev nodemon
```

Expected: `part3/phonebook-backend/package.json` exists, `express` in dependencies, `nodemon` in devDependencies.

- [ ] **Step 2: Set scripts and gitignore**

Edit `part3/phonebook-backend/package.json` scripts to:
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

Create `part3/phonebook-backend/.gitignore` with content:
```
node_modules
```

- [ ] **Step 3: Write minimal implementation**

Create `part3/phonebook-backend/index.js` with complete code:
```js
const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const count = persons.length
  const date = new Date()
  res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

- [ ] **Step 4: Run and verify it passes**

Run:
```bash
node index.js
```

In second terminal, run:
```powershell
Invoke-WebRequest -Uri http://localhost:3001/api/persons | Select-Object -ExpandProperty Content
Invoke-WebRequest -Uri http://localhost:3001/info | Select-Object -ExpandProperty Content
```

Expected: First returns JSON array with 4 names (Arto Hellas, Ada Lovelace, Dan Abramov, Mary Poppendieck). Second returns `Phonebook has info for 4 people` plus date string. Stop server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add part3/phonebook-backend/package.json part3/phonebook-backend/index.js part3/phonebook-backend/.gitignore
git commit -m "feat(part3): scaffold phonebook backend with GET all and info (3.1-3.2)"
```

### Task 2: GET single + DELETE

**Files:**
- Modify: `part3/phonebook-backend/index.js`
- Test: manual via `Invoke-WebRequest -Method Delete`

**Interfaces:**
- Consumes: `persons` array from Task 1
- Produces: `GET /api/persons/:id`, `DELETE /api/persons/:id` -> 204

- [ ] **Step 1: Verify failing behavior (404/DELETE missing)**

With Task 1 server running, run:
```powershell
Invoke-WebRequest -Uri http://localhost:3001/api/persons/1
```

Expected: FAIL — returns full array logic only, `/api/persons/1` returns 404 Cannot GET (Express default HTML). This confirms single-route missing.

- [ ] **Step 2: Write minimal implementation**

Add to `part3/phonebook-backend/index.js` before `app.listen`, exact code:
```js
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).json({ error: 'person not found' })
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})
```

Full file now contains: requires, express.json, persons array, GET all, GET info, GET single, DELETE, listen.

- [ ] **Step 3: Run and verify it passes**

Run:
```bash
node index.js
```

Verify:
```powershell
Invoke-WebRequest -Uri http://localhost:3001/api/persons/1 | Select-Object -ExpandProperty Content
Invoke-WebRequest -Uri http://localhost:3001/api/persons/9999 -SkipHttpErrorCheck | Select-Object StatusCode, Content
Invoke-WebRequest -Uri http://localhost:3001/api/persons/2 -Method Delete | Select-Object StatusCode
Invoke-WebRequest -Uri http://localhost:3001/api/persons | Select-Object -ExpandProperty Content
```

Expected: First returns Arto Hellas JSON. Second returns StatusCode 404 with `person not found`. Third returns 204. Fourth returns 3 persons (Ada removed). Restart server to reset to 4 for next task (Ctrl+C, `node index.js` again).

- [ ] **Step 4: Commit**

```bash
git add part3/phonebook-backend/index.js
git commit -m "feat(part3): add GET single and DELETE single (3.3-3.4)"
```

### Task 3: POST create + validation

**Files:**
- Modify: `part3/phonebook-backend/index.js`
- Test: manual via `Invoke-RestMethod -Method Post`

**Interfaces:**
- Consumes: `persons` array, `express.json()` from Task 1
- Produces: `POST /api/persons` -> 200 JSON new entry or 400 `{ error }`

- [ ] **Step 1: Verify failing behavior**

With Task 2 server running, run:
```powershell
Invoke-RestMethod -Uri http://localhost:3001/api/persons -Method Post -ContentType "application/json" -Body '{"name":"Test User","number":"123"}'
```

Expected: FAIL — 404 Cannot POST, confirms POST missing.

- [ ] **Step 2: Write minimal implementation**

Add to `part3/phonebook-backend/index.js` before `app.listen`, exact code:
```js
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const nameExists = persons.some(p => p.name === body.name)
  if (nameExists) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  res.json(person)
})
```

- [ ] **Step 3: Run and verify it passes**

Run:
```bash
npm run dev
```

Verify in second terminal:
```powershell
Invoke-RestMethod -Uri http://localhost:3001/api/persons -Method Post -ContentType "application/json" -Body '{"name":"Test User","number":"123-456"}'
Invoke-WebRequest -Uri http://localhost:3001/api/persons -Method Post -ContentType "application/json" -Body '{"number":"123"}' -SkipHttpErrorCheck | Select-Object StatusCode, Content
Invoke-WebRequest -Uri http://localhost:3001/api/persons -Method Post -ContentType "application/json" -Body '{"name":"Arto Hellas","number":"999"}' -SkipHttpErrorCheck | Select-Object StatusCode, Content
```

Expected: First returns new object with random id + Test User. Second returns 400 `name or number missing`. Third returns 400 `name must be unique`. Check terminal running `npm run dev` shows restart on save when you edit file.

Also verify `npm start` works:
```bash
node index.js
```

Expected: `Server running on port 3001`.

- [ ] **Step 4: Commit**

```bash
git add part3/phonebook-backend/index.js part3/phonebook-backend/package.json part3/phonebook-backend/package-lock.json
git commit -m "feat(part3): add POST with validation for missing and duplicate (3.5-3.6)"
```
