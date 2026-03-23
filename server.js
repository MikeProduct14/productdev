import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const DB_FILE = 'leads.json';

// Инициализация JSON базы
if (!existsSync(DB_FILE)) {
  writeFileSync(DB_FILE, JSON.stringify([]));
}

function getLeads() {
  return JSON.parse(readFileSync(DB_FILE, 'utf8'));
}

function saveLeads(leads) {
  writeFileSync(DB_FILE, JSON.stringify(leads, null, 2));
}

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API для приёма заявок
app.post('/api/leads', (req, res) => {
  const { name, phone, company, task } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Имя обязательно' });
  }

  const leads = getLeads();
  const newLead = {
    id: leads.length + 1,
    name,
    phone: phone || '',
    company: company || '',
    task: task || '',
    created_at: new Date().toISOString()
  };
  
  leads.push(newLead);
  saveLeads(leads);
  
  res.json({ success: true, id: newLead.id });
});

// API для получения всех заявок
app.get('/api/leads', (req, res) => {
  const leads = getLeads().reverse();
  res.json(leads);
});

// Админка
app.get('/admin', (req, res) => {
  res.sendFile(join(__dirname, 'admin.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Сервер запущен на порту ${PORT}`);
  console.log(`✓ Админка: /admin`);
});
