# Simple Express API — `data.json`

This is a minimal Express API that serves the `data.json` file.

Quick start:

```bash
cd BE
npm install
npm start
```

Endpoints:

- `GET /` — basic message
- `GET /data` — full JSON array from `data.json`
- `GET /data/:id` — single entry by numeric `id`

Example:

```bash
curl http://localhost:3000/data | jq
curl http://localhost:3000/data/1 | jq
```

Notes:

- The server reads `data.json` at startup. Restart to pick up file changes.
- For development install `nodemon` and run `npm run dev`.
