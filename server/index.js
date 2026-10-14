import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, 'data');
mkdirSync(dataDir, { recursive: true });
const db = new Database(resolve(dataDir, 'smartbudget.sqlite'));
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS budget_items (
    id TEXT PRIMARY KEY, type TEXT NOT NULL CHECK(type IN ('income','expense')),
    name TEXT NOT NULL, amount REAL NOT NULL CHECK(amount >= 0), frequency TEXT NOT NULL,
    category TEXT NOT NULL, rule_class TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS savings_goals (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, target REAL NOT NULL CHECK(target >= 0),
    current REAL NOT NULL DEFAULT 0 CHECK(current >= 0), icon TEXT NOT NULL DEFAULT 'target'
  );
`);
const getSetting = db.prepare('SELECT value FROM settings WHERE key = ?');
if (!getSetting.get('currency')) db.prepare('INSERT INTO settings(key,value) VALUES (?,?)').run('currency', '$');
if (!getSetting.get('initialized')) {
  const seed = db.transaction(() => {
    const item = db.prepare('INSERT INTO budget_items(id,type,name,amount,frequency,category,rule_class) VALUES (?,?,?,?,?,?,?)');
    [
      ['inc-1','income','Primary Salary',4500,'monthly','Salary',null],
      ['inc-2','income','Freelance Design',800,'monthly','Freelance',null],
      ['exp-1','expense','Apartment Rent',1600,'monthly','Housing','need'],
      ['exp-2','expense','Utilities & Internet',250,'monthly','Utilities','need'],
      ['exp-3','expense','Groceries',550,'monthly','Food & Dining','need'],
      ['exp-4','expense','Car Payment & Gas',420,'monthly','Transportation','need'],
      ['exp-5','expense','Dining Out & Entertainment',350,'monthly','Entertainment','want'],
      ['exp-6','expense','Streaming Subscriptions',45,'monthly','Entertainment','want'],
      ['exp-7','expense','401k & Roth IRA',600,'monthly','Savings & Investments','savings'],
    ].forEach(row => item.run(...row));
    const goal = db.prepare('INSERT INTO savings_goals(id,name,target,current,icon) VALUES (?,?,?,?,?)');
    goal.run('goal-1','Emergency Reserve',10000,4500,'Shield');
    goal.run('goal-2','Japan Summer Vacation',4000,2200,'Plane');
    db.prepare('INSERT INTO settings(key,value) VALUES (?,?)').run('initialized','true');
  });
  seed();
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/budget', (_req, res) => {
  const items = db.prepare('SELECT id,type,name,amount,frequency,category,rule_class AS ruleClass FROM budget_items ORDER BY created_at,id').all();
  res.json({ currency: getSetting.get('currency')?.value ?? '$', incomes: items.filter(x => x.type === 'income'), expenses: items.filter(x => x.type === 'expense'), goals: db.prepare('SELECT * FROM savings_goals ORDER BY rowid').all().map(({id,name,target,current,icon}) => ({id,name,target,current,icon})) });
});
app.put('/api/budget', (req, res) => {
  const { currency, incomes, expenses, goals } = req.body ?? {};
  if (!Array.isArray(incomes) || !Array.isArray(expenses) || !Array.isArray(goals) || typeof currency !== 'string') return res.status(400).json({ error: 'Invalid budget payload.' });
  const write = db.transaction(() => {
    db.prepare('INSERT INTO settings(key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run('currency', currency);
    db.prepare('DELETE FROM budget_items').run(); db.prepare('DELETE FROM savings_goals').run();
    const item = db.prepare('INSERT INTO budget_items(id,type,name,amount,frequency,category,rule_class) VALUES (?,?,?,?,?,?,?)');
    for (const [type, list] of [['income',incomes],['expense',expenses]]) for (const x of list) item.run(x.id || randomUUID(), type, String(x.name ?? '').slice(0,120), Math.max(0,Number(x.amount)||0), x.frequency || 'monthly', String(x.category || 'Other').slice(0,80), type === 'expense' ? (x.ruleClass || 'need') : null);
    const goal = db.prepare('INSERT INTO savings_goals(id,name,target,current,icon) VALUES (?,?,?,?,?)');
    for (const x of goals) goal.run(x.id || randomUUID(), String(x.name ?? '').slice(0,120), Math.max(0,Number(x.target)||0), Math.max(0,Number(x.current)||0), String(x.icon || 'target').slice(0,40));
  });
  try { write(); res.json({ ok: true }); } catch (error) { res.status(400).json({ error: error.message }); }
});

const dist = resolve(here, '../dist');
app.use(express.static(dist));
app.get('*', (req, res, next) => req.path.startsWith('/api/') ? next() : res.sendFile(resolve(dist, 'index.html')));
const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`SmartBudget API listening on http://localhost:${port}`));
