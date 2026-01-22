
import React, { useState } from 'react';
import { Disciple, Discipler, DiscipleStatus, NetworkSettings } from '../types';
import { ICONS, LESSONS } from '../constants';
import { getDiscipleshipCoachAdvice } from '../services/geminiService';

interface MonitoringProps {
  disciples: Disciple[];
  disciplers: Discipler[];
  settings: NetworkSettings;
  onToggleLesson: (id: string, lessonIndex: number) => void;
}

const Monitoring: React.FC<MonitoringProps> = ({ disciples, disciplers, settings, onToggleLesson }) => {
  const [selectedDisciple, setSelectedDisciple] = useState<Disciple | null>(null);
  const [showLessonsModal, setShowLessonsModal] = useState<Disciple | null>(null);
  const [coachingAdvice, setCoachingAdvice] = useState<string | null>(null);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [notes, setNotes] = useState("");

  const activeDisciples = disciples.filter(d => d.status === DiscipleStatus.ACTIVE);
  const targetWeeks = settings.targetDurationWeeks;

  const calculateWeeksElapsed = (startDate?: string) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  };

  const getStatusColor = (disciple: Disciple) => {
    const weeks = calculateWeeksElapsed(disciple.startDate);
    const progress = disciple.completedLessons.length;
    // Baseado na duração alvo configurada pelo gestor
    if (progress >= weeks) return 'text-emerald-500';
    if (progress >= (weeks * 0.7)) return 'text-amber-500';
    return 'text-red-500';
  };

  const handleOpenCoach = async (d: Disciple) => {
    setSelectedDisciple(d);
    setCoachingAdvice(null);
    setNotes("");
  };

  const generateAdvice = async () => {
    if (!selectedDisciple) return;
    setLoadingCoach(true);
    const advice = await getDiscipleshipCoachAdvice(selectedDisciple, notes);
    setCoachingAdvice(advice);
    setLoadingCoach(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-indigo-600 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold">Saúde da Rede</h3>
          <p className="text-indigo-100 text-xs">Comparando progresso real com a meta de {targetWeeks} semanas.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase opacity-70">Aguardando</p>
            <p className="text-xl font-bold">{disciples.filter(d => d.status === DiscipleStatus.WAITING).length}</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase opacity-70">Ativos</p>
            <p className="text-xl font-bold">{activeDisciples.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeDisciples.map(d => {
          const discipler = disciplers.find(dr => dr.id === d.disciplerId);
          const weeksElapsed = calculateWeeksElapsed(d.startDate);
          const completedCount = d.completedLessons.length;
          const isBehind = (completedCount < weeksElapsed) || (weeksElapsed > targetWeeks && completedCount < 12);

          return (
            <div key={d.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shadow-inner">
                    {d.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{d.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Mentor: {discipler?.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleOpenCoach(d)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  title="Conselho Pastoral IA"
                >
                  ✨
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ritmo</span>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mt-0.5">
                        {ICONS.Clock} {weeksElapsed} / {targetWeeks} sem.
                      </span>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aulas</span>
                      <span className={`text-xs font-bold flex items-center gap-1 justify-end mt-0.5 ${getStatusColor(d)}`}>
                        {completedCount} / 12
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-slate-400 opacity-20 transition-all duration-700"
                      style={{ width: `${Math.min((weeksElapsed / targetWeeks) * 100, 100)}%` }}
                    />
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${isBehind ? 'bg-amber-500' : 'bg-indigo-600'}`}
                      style={{ width: `${(completedCount / 12) * 100}%` }}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setShowLessonsModal(d)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-600 rounded-xl text-xs font-bold transition-all"
                >
                  {ICONS.Book} Detalhar Lições
                </button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-medium text-slate-400">
                <span className="flex items-center gap-1 uppercase tracking-tighter">{ICONS.Calendar} {d.startDate ? new Date(d.startDate).toLocaleDateString('pt-BR') : '--'}</span>
                {isBehind && <span className="text-red-500 font-bold uppercase tracking-tighter flex items-center gap-1">{ICONS.Warning} ATRASADO</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Detalhes das Lições */}
      {showLessonsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{showLessonsModal.name}</h3>
                <p className="text-xs text-slate-500 font-medium">Ciclo de {targetWeeks} semanas</p>
              </div>
              <button onClick={() => setShowLessonsModal(null)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {LESSONS.map((lesson, index) => {
                const lessonNum = index + 1;
                const isCompleted = showLessonsModal.completedLessons.includes(lessonNum);
                return (
                  <button
                    key={index}
                    onClick={() => onToggleLesson(showLessonsModal.id, lessonNum)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${isCompleted ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-white border-slate-100 text-slate-600'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{lessonNum}</div>
                    <span className="flex-1 font-semibold text-sm">{lesson}</span>
                    {isCompleted && <div className="text-emerald-500">{ICONS.Check}</div>}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setShowLessonsModal(null)} className="mt-6 w-full py-3 bg-slate-900 text-white font-bold rounded-xl">Concluído</button>
          </div>
        </div>
      )}

      {/* Modal de Aconselhamento Pastoral IA */}
      {selectedDisciple && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Mentor IA de Discipulado</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Conselho Estratégico para {selectedDisciple.name}</p>
              </div>
              <button onClick={() => setSelectedDisciple(null)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Observações Adicionais</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Dificuldades financeiras, desânimo com as lições, falta de tempo..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm h-24 resize-none outline-none focus:border-indigo-500"
                />
              </div>

              {!coachingAdvice && !loadingCoach && (
                <button 
                  onClick={generateAdvice}
                  className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  ✨ Gerar Recomendações Pastorais
                </button>
              )}

              {loadingCoach && (
                <div className="py-8 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium text-slate-500">O Mentor está analisando o progresso...</p>
                </div>
              )}

              {coachingAdvice && (
                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-500">
                  <h4 className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest mb-4">Sabedoria do Mentor</h4>
                  <div className="prose prose-sm prose-indigo whitespace-pre-wrap text-indigo-900 leading-relaxed font-medium italic text-sm">
                    {coachingAdvice}
                  </div>
                  <button 
                    onClick={() => setSelectedDisciple(null)}
                    className="mt-6 w-full py-2 bg-white border border-indigo-200 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    Entendido
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Monitoring;
