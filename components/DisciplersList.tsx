
import React, { useState } from 'react';
import { Discipler, Gender } from '../types';
import { ICONS } from '../constants';

interface DisciplersListProps {
  disciplers: Discipler[];
  onAddDiscipler: (d: Discipler) => void;
}

const DisciplersList: React.FC<DisciplersListProps> = ({ disciplers, onAddDiscipler }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newDiscipler, setNewDiscipler] = useState<Partial<Discipler>>({ 
    gender: Gender.MALE, 
    maxDisciples: 3,
    isSpecialized: false,
    interests: []
  });
  const [interestInput, setInterestInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDiscipler.name) {
      onAddDiscipler({
        id: Math.random().toString(36).substr(2, 9),
        name: newDiscipler.name,
        gender: newDiscipler.gender as Gender,
        age: newDiscipler.age || 30,
        interests: newDiscipler.interests || [],
        isSpecialized: !!newDiscipler.isSpecialized,
        since: new Date().toISOString().split('T')[0],
        maxDisciples: newDiscipler.maxDisciples || 3,
        currentDisciplesCount: 0,
        bio: newDiscipler.bio || ''
      });
      setShowAdd(false);
      setNewDiscipler({ gender: Gender.MALE, maxDisciples: 3, isSpecialized: false, interests: [] });
    }
  };

  const getCapacityStatus = (current: number, max: number) => {
    const ratio = current / max;
    if (ratio >= 1) return { label: 'Lotado', color: 'bg-red-100 text-red-700 border-red-200', bar: 'bg-red-500' };
    if (ratio >= 0.75) return { label: 'Últimas Vagas', color: 'bg-amber-100 text-amber-700 border-amber-200', bar: 'bg-amber-500' };
    return { label: 'Disponível', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' };
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            {ICONS.Search}
          </div>
          <input 
            type="text" 
            placeholder="Buscar discipulador..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          {ICONS.Plus}
          Adicionar Discipulador
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {disciplers.map((d) => {
          const status = getCapacityStatus(d.currentDisciplesCount, d.maxDisciples);
          return (
            <div key={d.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden">
              {/* Indicador Lateral de Status */}
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rotate-45 opacity-10 ${status.bar}`} />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl font-bold shadow-inner">
                  {d.name[0]}
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${status.color}`}>
                    {status.label}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${d.gender === Gender.MALE ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                    {d.gender}
                  </span>
                </div>
              </div>
              
              <div className="relative z-10">
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {d.name} <span className="text-xs font-medium text-slate-400">({d.age} anos)</span>
                </h4>
                
                {d.isSpecialized && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 mt-1">
                    {ICONS.Specialized} ESPECIALIZADO
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1.5 mt-4 mb-4">
                {d.interests.slice(0, 3).map((int, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-500 text-[9px] font-bold px-2 py-1 rounded-lg border border-slate-100">
                    {int}
                  </span>
                ))}
              </div>

              <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1 leading-relaxed">{d.bio || 'Sem biografia disponível.'}</p>
              
              {/* Seção de Capacidade Proeminente */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mt-auto">
                <div className="flex justify-between items-center mb-2.5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacidade</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-lg font-black text-slate-900">{d.currentDisciplesCount}</span>
                      <span className="text-xs font-bold text-slate-400">/ {d.maxDisciples}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ocupação</span>
                    <p className={`text-xs font-black mt-0.5 ${d.currentDisciplesCount >= d.maxDisciples ? 'text-red-600' : 'text-slate-600'}`}>
                      {Math.round((d.currentDisciplesCount / d.maxDisciples) * 100)}%
                    </p>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${status.bar}`}
                    style={{ width: `${(d.currentDisciplesCount / d.maxDisciples) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Cadastrar Discipulador</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Nome Completo</label>
                <input required type="text" value={newDiscipler.name || ''} onChange={e => setNewDiscipler({...newDiscipler, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Idade</label>
                  <input required type="number" value={newDiscipler.age || ''} onChange={e => setNewDiscipler({...newDiscipler, age: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Capacidade (Vagas)</label>
                  <input required type="number" min="1" max="10" value={newDiscipler.maxDisciples || ''} onChange={e => setNewDiscipler({...newDiscipler, maxDisciples: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Gênero</label>
                <select value={newDiscipler.gender} onChange={e => setNewDiscipler({...newDiscipler, gender: e.target.value as Gender})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option value={Gender.MALE}>Masculino</option>
                  <option value={Gender.FEMALE}>Feminino</option>
                </select>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <input type="checkbox" checked={!!newDiscipler.isSpecialized} onChange={e => setNewDiscipler({...newDiscipler, isSpecialized: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                <label className="text-sm font-semibold text-slate-700">Discipulador Especializado (Líder/Pastor)</label>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Interesses (separados por vírgula)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Futebol, Leitura, Música"
                  value={interestInput}
                  onChange={e => {
                    setInterestInput(e.target.value);
                    setNewDiscipler({...newDiscipler, interests: e.target.value.split(',').map(i => i.trim()).filter(i => i !== "")});
                  }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-colors">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisciplersList;
