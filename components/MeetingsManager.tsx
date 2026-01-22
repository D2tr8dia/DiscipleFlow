
import React, { useState } from 'react';
import { Meeting, Disciple, Discipler, UserRole } from '../types';
import { ICONS } from '../constants';

interface MeetingsManagerProps {
  meetings: Meeting[];
  onAddMeeting: (m: Meeting) => void;
  disciples: Disciple[];
  disciplers: Discipler[];
  currentRole: UserRole;
  currentUserId: string;
}

const MeetingsManager: React.FC<MeetingsManagerProps> = ({ 
  meetings, 
  onAddMeeting, 
  disciples, 
  disciplers,
  currentRole,
  currentUserId 
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({ 
    type: 'DISCIPLES',
    participantIds: [] 
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMeeting.date && newMeeting.agenda && newMeeting.participantIds?.length) {
      onAddMeeting({
        id: Math.random().toString(36).substr(2, 9),
        date: newMeeting.date,
        agenda: newMeeting.agenda,
        type: newMeeting.type as 'TEAM' | 'DISCIPLES',
        participantIds: newMeeting.participantIds,
        notifiedLevels: ['DEFINITION']
      });
      setShowAdd(false);
      setNewMeeting({ type: 'DISCIPLES', participantIds: [] });
    }
  };

  const toggleParticipant = (id: string) => {
    const current = newMeeting.participantIds || [];
    const updated = current.includes(id) 
      ? current.filter(pid => pid !== id) 
      : [...current, id];
    setNewMeeting({ ...newMeeting, participantIds: updated });
  };

  // Filtrar quem pode ser selecionado
  const availableParticipants = newMeeting.type === 'DISCIPLES' 
    ? (currentRole === UserRole.DISCIPLER 
        ? disciples.filter(d => d.disciplerId === currentUserId) 
        : disciples.filter(d => d.status === 'ATIVO'))
    : disciplers;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-slate-500">Cronograma de Encontros</p>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-200"
        >
          {ICONS.Plus} Agendar Encontro
        </button>
      </div>

      <div className="space-y-4">
        {meetings.map(m => (
          <div key={m.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 animate-in slide-in-from-top-2">
            <div className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-2xl min-w-[120px]">
              <span className="text-indigo-600 font-bold text-2xl">{new Date(m.date).getDate()}</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase">{new Date(m.date).toLocaleString('pt-BR', { month: 'short' })}</span>
              <span className="text-xs font-bold text-indigo-700 mt-1">{new Date(m.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${m.type === 'TEAM' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {m.type === 'TEAM' ? 'Equipe' : 'Discipulado'}
                    </span>
                    <h4 className="font-bold text-slate-900">Pauta</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{m.agenda}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2 items-center">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Participantes:</span>
                 {m.participantIds.map(pid => {
                    const person = m.type === 'DISCIPLES' ? disciples.find(d => d.id === pid) : disciplers.find(dr => dr.id === pid);
                    return (
                      <div key={pid} className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold">
                        {person?.name}
                      </div>
                    )
                 })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-6">Agendar Novo Encontro</h3>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Tipo</label>
                  <select 
                    value={newMeeting.type} 
                    onChange={e => setNewMeeting({...newMeeting, type: e.target.value as any, participantIds: []})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-sm font-bold"
                  >
                    <option value="DISCIPLES">Individual (Discípulos)</option>
                    <option value="TEAM">Equipe (Discipuladores)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Data e Hora</label>
                  <input required type="datetime-local" value={newMeeting.date || ''} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3">
                  Selecionar {newMeeting.type === 'DISCIPLES' ? 'Discípulos' : 'Discipuladores'}
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">
                  {availableParticipants.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleParticipant(p.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        newMeeting.participantIds?.includes(p.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${newMeeting.participantIds?.includes(p.id) ? 'bg-white/20' : 'bg-slate-100'}`}>
                        {newMeeting.participantIds?.includes(p.id) ? '✓' : p.name[0]}
                      </div>
                      <span className="text-[11px] font-bold truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Pauta</label>
                <textarea required placeholder="Sobre o que será o encontro?" value={newMeeting.agenda || ''} onChange={e => setNewMeeting({...newMeeting, agenda: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none h-24 resize-none text-sm" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100">Agendar e Notificar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsManager;
