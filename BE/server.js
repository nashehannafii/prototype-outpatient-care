const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3333;

// Allow CORS for simple testing
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Load data.json at startup
let data = [];
const dataPath = path.join(__dirname, '../DATA/data.json');
try {
  const raw = fs.readFileSync(dataPath, 'utf8');
  data = JSON.parse(raw);
} catch (err) {
  console.error('Failed to read or parse data.json:', err.message);
}

app.get('/', (req, res) => {
  res.send('Simple Express API — visit /data');
});

// Return full dataset
app.get('/data', (req, res) => {
  res.json(data);
});

// Return single item by numeric id
app.get('/data/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const item = data.find(d => d.id === id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
