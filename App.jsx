import React, { useState, useEffect } from 'react';
import { Trophy, Settings, Calculator, TrendingUp, Clock, Target, Edit3, Plus, Trash2, Zap, AlertCircle } from 'lucide-react';

// ==========================================
// WHITE LABEL CONFIGURATION
// Your customer can edit these values easily
// ==========================================
const APP_CONFIG = {
  name: "GREYHOUND PRO",       // Default App Name
  currency: "£",               // Currency Symbol
  primaryColor: "indigo",      // Theme Color (indigo, blue, slate, emerald)
  adminKey: "admin123"         // Default password to enter edit mode
};

const TRAP_COLORS = {
  1: { bg: 'bg-red-600', text: 'text-white' },
  2: { bg: 'bg-blue-600', text: 'text-white' },
  3: { bg: 'bg-white', text: 'text-slate-900', border: 'border-slate-300' },
  4: { bg: 'bg-slate-900', text: 'text-white' },
  5: { bg: 'bg-orange-500', text: 'text-white' },
  6: { bg: 'bg-white', text: 'text-slate-900', border: 'border-slate-900 border-dashed' }
};

const App = () => {
  const [activeTab, setActiveTab] = useState('tips');
  const [isAdmin, setIsAdmin] = useState(false);
  const [tips, setTips] = useState(() => {
    const saved = localStorage.getItem('owner_tips');
    return saved ? JSON.parse(saved) : [
      { id: 1, venue: "Sample Track", time: "19:00", dog: "Sample Runner", trap: 1, verdict: "Edit this in Admin mode.", odds: "2/1" }
    ];
  });

  const [analyzer, setAnalyzer] = useState({ trap: 1, avgTime: 29.5, splitTime: 4.4, classChange: 'Same' });
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    localStorage.setItem('owner_tips', JSON.stringify(tips));
  }, [tips]);

  const updateTip = (id, field, value) => setTips(tips.map(t => t.id === id ? { ...t, [field]: value } : t));
  const addTip = () => setTips([{ id: Date.now(), venue: "New Track", time: "00:00", dog: "New Dog", trap: 1, verdict: "Expert Verdict...", odds: "Evs" }, ...tips]);
  const deleteTip = (id) => setTips(tips.filter(t => t.id !== id));

  const calculateChance = () => {
    let score = 50 + (29.6 - analyzer.avgTime) * 50;
    setPrediction({ score: Math.min(100, Math.max(0, Math.round(score))) });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <header className={`bg-${APP_CONFIG.primaryColor}-800 text-white p-6 shadow-lg sticky top-0 z-20 flex justify-between items-center`}>
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-400" />
          <h1 className="font-black tracking-tighter text-xl uppercase">{APP_CONFIG.name}</h1>
        </div>
        <button onClick={() => setIsAdmin(!isAdmin)} className="opacity-50 hover:opacity-100 transition-opacity">
          <Settings size={20} />
        </button>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        {isAdmin && (
          <div className="mb-6 p-4 bg-amber-100 border-2 border-dashed border-amber-300 rounded-xl flex justify-between items-center">
            <span className="font-bold text-amber-900 text-sm">OWNER DASHBOARD (Update your tips here)</span>
            <button onClick={addTip} className="bg-amber-600 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
              <Plus size={14}/> NEW TIP
            </button>
          </div>
        )}

        <nav className="flex bg-white p-1 rounded-xl shadow-sm mb-6 border border-slate-200">
          <button onClick={() => setActiveTab('tips')} className={`flex-1 py-3 rounded-lg font-bold text-sm ${activeTab === 'tips' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>TIPS FEED</button>
          <button onClick={() => setActiveTab('analyzer')} className={`flex-1 py-3 rounded-lg font-bold text-sm ${activeTab === 'analyzer' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>ANALYZER</button>
        </nav>

        {activeTab === 'tips' ? (
          <div className="space-y-4">
            {tips.map(tip => (
              <div key={tip.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 relative group">
                {isAdmin && <button onClick={() => deleteTip(tip.id)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"><Trash2 size={12}/></button>}
                <div className="flex gap-4">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center font-black text-2xl border-2 ${TRAP_COLORS[tip.trap].bg} ${TRAP_COLORS[tip.trap].text} ${TRAP_COLORS[tip.trap].border || ''}`}>
                    {isAdmin ? (
                      <select value={tip.trap} onChange={(e) => updateTip(tip.id, 'trap', e.target.value)} className="bg-black/20 rounded outline-none">
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    ) : tip.trap}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        {isAdmin ? <div className="flex gap-1 mb-1"><input className="border text-[10px] w-20" value={tip.venue} onChange={(e) => updateTip(tip.id, 'venue', e.target.value)}/><input className="border text-[10px] w-12" value={tip.time} onChange={(e) => updateTip(tip.id, 'time', e.target.value)}/></div> : <p className="text-[10px] font-bold text-indigo-600 uppercase">{tip.venue} • {tip.time}</p>}
                        {isAdmin ? <input className="border font-bold w-full" value={tip.dog} onChange={(e) => updateTip(tip.id, 'dog', e.target.value)}/> : <h3 className="font-bold text-lg">{tip.dog}</h3>}
                      </div>
                      <div className="text-right">
                         {isAdmin ? <input className="border font-black w-12 text-center" value={tip.odds} onChange={(e) => updateTip(tip.id, 'odds', e.target.value)}/> : <p className="font-black text-xl">{tip.odds}</p>}
                      </div>
                    </div>
                    {isAdmin ? <textarea className="w-full text-xs mt-2 border" value={tip.verdict} onChange={(e) => updateTip(tip.id, 'verdict', e.target.value)}/> : <p className="text-xs text-slate-500 mt-2 italic bg-slate-50 p-2 rounded-lg">"{tip.verdict}"</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <h2 className="font-bold mb-4">Pro Logic Analyzer</h2>
            <button onClick={calculateChance} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl mb-4">GET CHANCE %</button>
            {prediction && <div className="text-5xl font-black text-indigo-600 animate-bounce">{prediction.score}%</div>}
          </div>
        )}

        <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2">
          <AlertCircle className="text-red-500 shrink-0" size={16}/>
          <p className="text-[10px] text-red-800 uppercase font-bold tracking-tight">18+ Only • Gamble Responsibly • No Guarantee of Profit</p>
        </div>
      </main>
    </div>
  );
};

export default App;