import { ArrowDownLeft, ArrowUpRight, Scale, PiggyBank } from 'lucide-react';
import { money } from '../data.js';
const icons = { income:ArrowDownLeft, expenses:ArrowUpRight, net:Scale, rate:PiggyBank };
export default function StatCard({ type, title, value, note, currency, negative=false }) {
  const Icon=icons[type];
  return <article className="stat-card"><div className="stat-top"><div><p className="eyebrow">{title}</p><strong className={`stat-value ${type} ${negative?'negative':''}`}>{type==='rate'?`${value.toFixed(1)}%`:money(value,currency)}</strong></div><span className={`stat-icon ${type}`}><Icon size={19}/></span></div>
    {type==='rate'?<div className="progress-track"><div className="progress-fill indigo" style={{width:`${Math.min(100,value)}%`}}/></div>:<p className="stat-note">{note}</p>}</article>;
}
