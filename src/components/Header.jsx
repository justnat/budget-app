import { Moon, Sun, Wallet, Download, RotateCcw, Sparkles } from 'lucide-react';
import { currencies } from '../data.js';

export default function Header({ currency, setCurrency, dark, setDark, onDemo, onReset, state }) {
  const exportData = () => {
    const file = new Blob([JSON.stringify(state, null, 2)], { type:'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(file);
    link.download = `smartbudget_export_${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(link.href);
  };
  return <header className="topbar"><div className="brand"><div className="brand-mark"><Wallet size={21}/></div><div><h1>SmartBudget</h1><p>Interactive Financial Dashboard</p></div></div>
    <div className="top-actions"><select aria-label="Currency" value={currency} onChange={e=>setCurrency(e.target.value)}>{currencies.map(c=><option key={c} value={c}>{c.trim()==='SAR'?'SAR (SR)':`${c} Currency`}</option>)}</select>
      <button className="quiet-button demo" onClick={onDemo}><Sparkles size={15}/> Demo Data</button><button className="icon-button" title="Export budget" onClick={exportData}><Download size={17}/><span>Export</span></button><button className="icon-button danger" title="Reset budget" onClick={onReset}><RotateCcw size={16}/><span>Reset</span></button><button className="icon-button theme-toggle" title="Toggle dark mode" onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button>
    </div></header>;
}
