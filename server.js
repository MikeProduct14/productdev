import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const db = new Database('leads.db');

// Создание таблицы
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    task TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API для приёма заявок
app.post('/api/leads', (req, res) => {
  const { name, phone, company, task } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Имя обязательно' });
  }

  const stmt = db.prepare('INSERT INTO leads (name, phone, company, task) VALUES (?, ?, ?, ?)');
  const result = stmt.run(name, phone || '', company || '', task || '');
  
  res.json({ success: true, id: result.lastInsertRowid });
});

// API для получения всех заявок
app.get('/api/leads', (req, res) => {
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  res.json(leads);
});

// Админка
app.get('/admin', (req, res) => {
  res.sendFile(join(__dirname, 'admin.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Сервер запущен: http://localhost:${PORT}`);
  console.log(`✓ Админка: http://localhost:${PORT}/admin`);
});
