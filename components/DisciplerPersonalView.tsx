
import React, { useState } from 'react';
import { Disciple, Discipler, Encounter } from '../types';
import { LESSONS_DETAIL as LESSONS_DATA, ICONS } from '../constants';
import { generateJourneySummary } from '../services/geminiService';

interface DisciplerPersonalViewProps {
  discipler: Discipler;
  myDisciples: Disciple[];
  onToggleLesson: (id: string, index: number) => void;
  onRegisterEncounter: (discipleId: string, encounter: Partial<Encounter>) => void;
  onFinishDiscipleship: (discipleId: string, finalReport: string) => void;
}

const DisciplerPersonalView: React.FC<DisciplerPersonalViewProps> = ({ 
  discipler, 
  myDisciples, 
  onToggleLesson,
  onRegisterEncounter,
  onFinishDiscipleship
}) => {
  const [selectedDisciple, setSelectedDisciple] = useState<Disciple | null>(null);
  const [showEncounterModal, setShowEncounterModal] = useState(false);
  const [showFinalReportModal, setShowFinalReportModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Estados do formulário de encontro
  const [encounterDate, setEncounterDate] = useState(new Date().toISOString().split('T')[0]);
  const [encounterSummary, setEncounterSummary] = useState("");
  const [encounterPrayers, setEncounterPrayers] = useState("");
  const [selectedLessons, setSelectedLessons] = useState<number[]>([]);

  // Estados do relatório final
  const [finalReportText, setFinalReportText] = useState("");

  const handleOpenEncounter = () => {
    setEncounterDate(new Date().toISOString().split('T')[0]);
    setEncounterSummary("");
    setEncounterPrayers("");
    setSelectedLessons([]);
    setShowEncounterModal(true);
  };

  const handleToggleFormLesson = (index: number) => {
    setSelectedLessons(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleSaveEncounter = () => {
    if (!selectedDisciple) return;
    onRegisterEncounter(selectedDisciple.id, {
      date: encounterDate,
      summary: encounterSummary,
      prayerRequests: encounterPrayers,
      lessonsCovered: selectedLessons
    });
    setShowEncounterModal(false);
  };

  const handleOpenFinalReport = () => {
    setFinalReportText(selectedDisciple?.finalReport || "");
    setShowFinalReportModal(true);
  };

  const handleGenerateAISummary = async () => {
    if (!selectedDisciple) return;
    setIsGenerating(true);
    const summary = await generateJourneySummary(selectedDisciple);
    setFinalReportText(summary || "");
    setIsGenerating(false);
  };

  const handleSaveFinalReport = () => {
    if (!selectedDisciple) return;
    onFinishDiscipleship(selectedDisciple.id, finalReportText);
    setShowFinalReportModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">Paz, {discipler.name}!</h3>
          <p className="text-slate-500">Acompanhando <span className="text-indigo-600 font-bold">{myDisciples.length}</span> discípulos em sua jornada.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-2xl text-xs font-bold">
           {ICONS.Zap} Gestão de Mentoria Ativa
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Meus Discípulos */}
        <div className="lg:col-span-1 space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Meus Discípulos</h4>
          {myDisciples.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDisciple(d)}
              className={`w-full text-left p-5 rounded-3xl border transition-all ${
                selectedDisciple?.id === d.id 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-1' 
                  : 'bg-white border-slate-100 text-slate-900 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                  selectedDisciple?.id === d.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
                }`}>
                  {d.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm truncate">{d.name}</p>
                    {d.progress === 100 && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold">FECHADO</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-current opacity-20 rounded-full overflow-hidden">
                      <div className="h-full bg-current" style={{ width: `${d.progress}%` }} />
                    </div>
                    <p className="text-[9px] font-bold uppercase whitespace-nowrap">{d.progress}%</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          {myDisciples.length === 0 && (
             <div className="p-8 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-sm">Nenhum discípulo vinculado a você.</p>
             </div>
          )}
        </div>

        {/* Painel Central do Discípulo Selecionado */}
        <div className="lg:col-span-2">
          {selectedDisciple ? (
            <div className="space-y-6">
              {/* Celebração de Conclusão */}
              {selectedDisciple.progress === 100 && !selectedDisciple.finalReport && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl animate-in zoom-in-95 duration-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl text-white">
                      {ICONS.Target}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">Ciclo Concluído!</h4>
                      <p className="text-emerald-50 text-sm">Todas as 12 lições foram finalizadas com sucesso.</p>
                    </div>
                  </div>
                  <p className="text-sm opacity-90 leading-relaxed mb-6">
                    {selectedDisciple.name} chegou ao final desta jornada. Agora, como mentor, seu papel é emitir um Relatório Geral da Jornada para documentar esse crescimento e oficializar a conclusão.
                  </p>
                  <button 
                    onClick={handleOpenFinalReport}
                    className="w-full sm:w-auto px-8 py-3 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 transition-colors shadow-lg"
                  >
                    Emitir Relatório Geral
                  </button>
                </div>
              )}

              {/* Cabeçalho do Discípulo */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-4">
                   <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                     {selectedDisciple.name[0]}
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-slate-900">{selectedDisciple.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">Ciclo iniciado em {new Date(selectedDisciple.startDate || '').toLocaleDateString('pt-BR')}</p>
                   </div>
                </div>
                <div className="flex gap-2">
                  {selectedDisciple.finalReport && (
                    <button 
                      onClick={handleOpenFinalReport}
                      className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all flex items-center gap-2"
                    >
                      {ICONS.BookMarked} Ver Relatório Geral
                    </button>
                  )}
                  {selectedDisciple.progress < 100 && (
                    <button 
                      onClick={handleOpenEncounter}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                      {ICONS.Register} Registrar Encontro
                    </button>
                  )}
                </div>
              </div>

              {/* Grid de Informações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Relatos Recentes */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    {ICONS.Message} Relatos Recentes
                  </h5>
                  <div className="space-y-3">
                    {selectedDisciple.reports.length > 0 ? (
                      selectedDisciple.reports.slice(-2).reverse().map(r => (
                        <div key={r.id} className={`p-4 rounded-2xl border ${r.type === 'DIFFICULTY' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-bold uppercase">{r.type === 'DIFFICULTY' ? 'Luta/Dificuldade' : 'Vitória/Alegria'}</span>
                            <span className="text-[9px] opacity-60 font-bold">{new Date(r.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <p className="text-xs leading-relaxed italic line-clamp-2">"{r.content}"</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic text-center py-4">Nenhum relato enviado ainda.</p>
                    )}
                  </div>
                </div>

                {/* Histórico de Encontros */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    {ICONS.History} Últimas Reuniões
                  </h5>
                  <div className="space-y-3">
                    {selectedDisciple.encounters && selectedDisciple.encounters.length > 0 ? (
                      selectedDisciple.encounters.slice(-2).reverse().map(e => (
                        <div key={e.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-indigo-600">{new Date(e.date).toLocaleDateString('pt-BR')}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">{e.lessonsCovered.length} Lição(ões)</span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{e.summary}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 border-2 border-dashed border-slate-100 rounded-2xl">
                        <p className="text-xs text-slate-400 italic">Nenhum encontro registrado.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Guia de Lições */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                 <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    {ICONS.BookMarked} Checklist da Jornada
                 </h5>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LESSONS_DATA.map((lesson, idx) => {
                    const num = idx + 1;
                    const isDone = selectedDisciple.completedLessons.includes(num);
                    return (
                      <div key={idx} className={`p-4 rounded-2xl border transition-all ${isDone ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 hover:border-indigo-100'}`}>
                        <div className="flex items-start gap-3">
                          <button 
                            onClick={() => onToggleLesson(selectedDisciple.id, num)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 transition-all ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                          >
                            {isDone ? ICONS.Check : num}
                          </button>
                          <div className="flex-1">
                            <h6 className={`font-bold text-xs ${isDone ? 'text-emerald-900' : 'text-slate-900'}`}>{lesson.title}</h6>
                            <p className="text-[10px] text-slate-500 mt-1 leading-tight">{lesson.goal}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-10 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-indigo-400">
                {ICONS.Disciples}
              </div>
              <h4 className="text-lg font-bold text-slate-700">Painel de Acompanhamento</h4>
              <p className="text-sm max-w-sm mt-2 leading-relaxed">
                Selecione um de seus discípulos à esquerda para gerenciar encontros, monitorar progressos e ler relatos.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Registro de Encontro */}
      {showEncounterModal && selectedDisciple && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Registrar Encontro</h3>
                <p className="text-sm text-slate-500">Documentando a reunião com {selectedDisciple.name}</p>
              </div>
              <button onClick={() => setShowEncounterModal(false)} className="text-slate-400 hover:text-slate-600 text-3xl">×</button>
            </div>

            <div className="space-y-6">
              {/* Data e Notas Rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Data da Reunião</label>
                  <input 
                    type="date" 
                    value={encounterDate}
                    onChange={(e) => setEncounterDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Pedidos de Oração</label>
                  <input 
                    type="text" 
                    value={encounterPrayers}
                    onChange={(e) => setEncounterPrayers(e.target.value)}
                    placeholder="Algo para interceder?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Seleção de Lições */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3">Quais lições foram estudadas hoje?</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                  {LESSONS_DATA.map((l, idx) => {
                    const num = idx + 1;
                    const alreadyDone = selectedDisciple.completedLessons.includes(num);
                    const isSelected = selectedLessons.includes(num);
                    return (
                      <button
                        key={idx}
                        disabled={alreadyDone}
                        onClick={() => handleToggleFormLesson(num)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          alreadyDone ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' :
                          isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          isSelected || alreadyDone ? 'bg-white/20' : 'bg-slate-100'
                        }`}>
                          {alreadyDone ? '✓' : num}
                        </div>
                        <span className="text-[11px] font-bold truncate">{l.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resumo Pastoral */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Resumo Pastoral / Observações</label>
                <textarea 
                  value={encounterSummary}
                  onChange={(e) => setEncounterSummary(e.target.value)}
                  placeholder="Como foi o tempo juntos? Algum ponto de atenção?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm h-32 outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                 <button 
                  onClick={() => setShowEncounterModal(false)}
                  className="flex-1 py-4 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveEncounter}
                  className="flex-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-slate-100 hover:bg-slate-800 transition-all"
                >
                  Salvar Registro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Relatório Final / Geral */}
      {showFinalReportModal && selectedDisciple && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-3xl p-10 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-bold text-slate-900">Relatório Geral da Jornada</h3>
                <p className="text-slate-500 mt-1">Conclusão do discipulado de {selectedDisciple.name}</p>
              </div>
              <button onClick={() => setShowFinalReportModal(false)} className="text-slate-400 hover:text-slate-600 text-3xl">×</button>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                 <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resumo da Jornada</h5>
                    <button 
                      onClick={handleGenerateAISummary}
                      disabled={isGenerating}
                      className="flex items-center gap-2 text-indigo-600 text-xs font-bold bg-white px-4 py-2 rounded-xl border border-indigo-100 hover:bg-indigo-50 transition-all disabled:opacity-50"
                    >
                      {isGenerating ? <span className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /> : '✨'} 
                      {isGenerating ? 'Analisando...' : 'Gerar Draft com IA'}
                    </button>
                 </div>
                 <textarea 
                  value={finalReportText}
                  onChange={(e) => setFinalReportText(e.target.value)}
                  placeholder="Escreva um resumo simples mas completo sobre a jornada espiritual, marcos de crescimento e próximos passos..."
                  className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-sm h-64 outline-none focus:border-indigo-500 transition-all resize-none shadow-inner"
                 />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowFinalReportModal(false)}
                  className="flex-1 py-4 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                >
                  Fechar sem salvar
                </button>
                <button 
                  onClick={handleSaveFinalReport}
                  className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  {ICONS.Check} Finalizar e Salvar Relatório
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisciplerPersonalView;
