
import React, { useState } from 'react';
import { Disciple, Discipler, DiscipleStatus, Gender } from '../types';
import { ICONS } from '../constants';
import { getPairingSuggestion } from '../services/geminiService';

interface DisciplesListProps {
  disciples: Disciple[];
  disciplers: Discipler[];
  onAddDisciple: (d: Disciple) => void;
  onPair: (discipleId: string, disciplerId: string) => void;
}

const DisciplesList: React.FC<DisciplesListProps> = ({ disciples, disciplers, onAddDisciple, onPair }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [pairingDisciple, setPairingDisciple] = useState<Disciple | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<{ disciplerId: string, reason: string } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  const [newDisciple, setNewDisciple] = useState<Partial<Disciple>>({ 
    gender: Gender.MALE,
    age: 20,
    interests: [],
    sensitiveTopics: []
  });
  const [interestInput, setInterestInput] = useState("");
  const [topicsInput, setTopicsInput] = useState("");

  const handleOpenPairing = async (d: Disciple) => {
    setPairingDisciple(d);
    setLoadingAi(true);
    // Filtrar primeiro por sexo e vaga
    const available = disciplers.filter(dr => dr.gender === d.gender && dr.currentDisciplesCount < dr.maxDisciples);
    const suggestion = await getPairingSuggestion(d, available);
    setAiSuggestion(suggestion);
    setLoadingAi(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDisciple.name) {
      // Fix: Added missing 'encounters' property to comply with Disciple interface
      onAddDisciple({
        id: 'd' + Math.random().toString(36).substr(2, 5),
        name: newDisciple.name,
        gender: newDisciple.gender as Gender,
        age: newDisciple.age || 20,
        interests: newDisciple.interests || [],
        sensitiveTopics: newDisciple.sensitiveTopics,
        joinedDate: new Date().toISOString().split('T')[0],
        status: DiscipleStatus.WAITING,
        progress: 0,
        completedLessons: [],
        reports: [],
        encounters: []
      });
      setShowAdd(false);
      setNewDisciple({ gender: Gender.MALE, age: 20, interests: [], sensitiveTopics: [] });
      setInterestInput("");
      setTopicsInput("");
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Gestão de Novos Membros</h2>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg"
        >
          {ICONS.UserAdd} Novo Membro
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Membro</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Critérios</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atenção Especial</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {disciples.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                      {d.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{d.name}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase">{d.gender} • {d.age} anos</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {d.interests.map((i, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded border border-slate-200 uppercase font-bold">
                        {i}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {d.sensitiveTopics && d.sensitiveTopics.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100 max-w-fit">
                      {ICONS.Warning}
                      <span className="text-[10px] font-bold uppercase">Complexo</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nenhuma</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    d.status === DiscipleStatus.WAITING ? 'bg-amber-100 text-amber-700' :
                    d.status === DiscipleStatus.ACTIVE ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {d.status === DiscipleStatus.WAITING ? (
                    <button 
                      onClick={() => handleOpenPairing(d)}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      Parear
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">Designado</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Cadastro */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Novo Membro</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nome</label>
                <input required type="text" value={newDisciple.name || ''} onChange={e => setNewDisciple({...newDisciple, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Idade</label>
                  <input required type="number" value={newDisciple.age || ''} onChange={e => setNewDisciple({...newDisciple, age: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Gênero</label>
                  <select value={newDisciple.gender} onChange={e => setNewDisciple({...newDisciple, gender: e.target.value as Gender})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none">
                    <option value={Gender.MALE}>Masculino</option>
                    <option value={Gender.FEMALE}>Feminino</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Interesses (vírgula)</label>
                <input 
                  type="text" 
                  value={interestInput}
                  onChange={e => {
                    setInterestInput(e.target.value);
                    setNewDisciple({...newDisciple, interests: e.target.value.split(',').map(i => i.trim()).filter(i => i !== "")});
                  }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-red-500 uppercase mb-1.5">Temas Delicados (opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Luto, Vícios, Crises de fé"
                  value={topicsInput}
                  onChange={e => {
                    setTopicsInput(e.target.value);
                    setNewDisciple({...newDisciple, sensitiveTopics: e.target.value.split(',').map(i => i.trim()).filter(i => i !== "")});
                  }}
                  className="w-full px-4 py-3 border border-red-100 bg-red-50 rounded-xl outline-none" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Pareamento IA Refinado */}
      {pairingDisciple && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Pareamento Estratégico</h3>
                <p className="text-slate-500 text-sm">Perfil: {pairingDisciple.name} ({pairingDisciple.age}a) • {pairingDisciple.interests.join(', ')}</p>
              </div>
              <button onClick={() => setPairingDisciple(null)} className="text-slate-400 text-2xl">×</button>
            </div>

            {pairingDisciple.sensitiveTopics && pairingDisciple.sensitiveTopics.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-white rounded-full text-red-600">{ICONS.Warning}</div>
                <div>
                  <p className="text-xs font-bold text-red-700 uppercase">Atenção Especial Necessária</p>
                  <p className="text-xs text-red-600">Este membro possui temas delicados: {pairingDisciple.sensitiveTopics.join(', ')}. Buscamos líderes ou pastores.</p>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                Sugestão da IA (Critério: Idade + Afinidade)
              </h4>
              {loadingAi ? (
                <div className="bg-indigo-50/50 rounded-2xl p-8 border border-indigo-100 flex flex-col items-center gap-4 animate-pulse">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium text-indigo-700">Calculando compatibilidade geracional...</p>
                </div>
              ) : aiSuggestion ? (
                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 font-bold text-2xl">
                      {disciplers.find(dr => dr.id === aiSuggestion.disciplerId)?.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-indigo-900 text-lg">
                        {disciplers.find(dr => dr.id === aiSuggestion.disciplerId)?.name}
                        {disciplers.find(dr => dr.id === aiSuggestion.disciplerId)?.isSpecialized && (
                          <span className="ml-2 text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded">LÍDER</span>
                        )}
                      </p>
                      <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Combinação Ideal</p>
                    </div>
                  </div>
                  <div className="bg-white/60 p-4 rounded-xl border border-indigo-100/50">
                    <p className="text-sm text-indigo-900/80 leading-relaxed italic">
                      "{aiSuggestion.reason}"
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      onPair(pairingDisciple.id, aiSuggestion.disciplerId);
                      setPairingDisciple(null);
                    }}
                    className="mt-6 w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                  >
                    Confirmar Pareamento
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Falha ao gerar sugestão.</p>
              )}
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Outros Disponíveis (Mesmo Sexo)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {disciplers
                  .filter(dr => dr.gender === pairingDisciple.gender && dr.currentDisciplesCount < dr.maxDisciples)
                  .map(dr => (
                    <button
                      key={dr.id}
                      onClick={() => {
                        onPair(pairingDisciple.id, dr.id);
                        setPairingDisciple(null);
                      }}
                      className="flex flex-col p-4 border border-slate-100 rounded-2xl hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-slate-800 text-sm">{dr.name} ({dr.age}a)</span>
                        {dr.isSpecialized && <span className="text-amber-500">{ICONS.Specialized}</span>}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {dr.interests.slice(0, 2).map((i, idx) => (
                          <span key={idx} className="text-[8px] bg-slate-100 px-1 py-0.5 rounded uppercase font-bold text-slate-500">{i}</span>
                        ))}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisciplesList;
