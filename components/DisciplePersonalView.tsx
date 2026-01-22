
import React, { useState } from 'react';
import { Disciple, DailyReport, Meeting } from '../types';
import { ICONS, LESSONS } from '../constants';

interface DisciplePersonalViewProps {
  disciple: Disciple;
  onSendReport: (report: Partial<DailyReport>) => void;
  myMeetings: Meeting[];
}

const DisciplePersonalView: React.FC<DisciplePersonalViewProps> = ({ disciple, onSendReport, myMeetings }) => {
  const [reportText, setReportText] = useState("");
  const [reportType, setReportType] = useState<'GOOD_NEWS' | 'DIFFICULTY'>('GOOD_NEWS');

  const lastEncounter = disciple.encounters && disciple.encounters.length > 0 
    ? disciple.encounters[disciple.encounters.length - 1] 
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportText.trim()) {
      onSendReport({
        type: reportType,
        content: reportText
      });
      setReportText("");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Resumo do Progresso */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-bold">Olá, {disciple.name}!</h2>
          <p className="text-indigo-100 opacity-80">Você já percorreu {disciple.progress}% da sua jornada de discipulado.</p>
          <div className="flex gap-4 pt-4">
             <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase opacity-60">Lições</p>
                <p className="font-bold text-xl">{disciple.completedLessons.length} / 12</p>
             </div>
             <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase opacity-60">Último Encontro</p>
                <p className="font-bold text-xl">{disciple.lastMeetingDate ? new Date(disciple.lastMeetingDate).toLocaleDateString('pt-BR') : '--'}</p>
             </div>
          </div>
        </div>
        
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/20" />
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * disciple.progress) / 100} className="text-white transition-all duration-1000" />
          </svg>
          <span className="absolute text-2xl font-bold">{disciple.progress}%</span>
        </div>
      </div>

      {/* Relatório Geral de Conclusão */}
      {disciple.finalReport && (
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-[2.5rem] p-10 border-2 border-emerald-200 shadow-xl animate-in zoom-in-95 duration-500">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
                {ICONS.Target}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-emerald-900">Carta de Conclusão</h3>
                <p className="text-emerald-600 text-sm font-bold uppercase tracking-widest">Relatório Geral da Jornada</p>
              </div>
           </div>
           <div className="prose prose-emerald prose-lg text-slate-700 italic leading-relaxed whitespace-pre-wrap">
             "{disciple.finalReport}"
           </div>
           <div className="mt-8 pt-8 border-t border-emerald-100 flex justify-between items-center text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              <span>Concluído em {new Date().toLocaleDateString('pt-BR')}</span>
              <span>DiscipleFlow Certified</span>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Agenda de Encontros */}
         <div className="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              {ICONS.Calendar} Minha Agenda
            </h3>
            <div className="space-y-4">
              {myMeetings.length > 0 ? myMeetings.map(m => (
                <div key={m.id} className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                   <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">{new Date(m.date).toLocaleString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}</p>
                   <p className="text-sm font-bold text-slate-800">{new Date(m.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                   <p className="text-xs text-slate-600 mt-2 line-clamp-2">{m.agenda}</p>
                </div>
              )) : (
                <div className="py-10 text-center text-slate-400 italic">
                  Nenhum encontro agendado.
                </div>
              )}
            </div>
         </div>

         <div className="lg:col-span-2 space-y-8">
            {/* Notas do Mentor */}
            {lastEncounter && !disciple.finalReport && (
              <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                  {ICONS.BookMarked}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-amber-900">Palavra do seu Mentor</h3>
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed italic">"{lastEncounter.summary}"</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Envio de Relatórios */}
              {disciple.progress < 100 && (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">{ICONS.Message} Como foi seu dia?</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setReportType('GOOD_NEWS')} className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all border ${reportType === 'GOOD_NEWS' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>🎉 Vitórias</button>
                      <button type="button" onClick={() => setReportType('DIFFICULTY')} className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all border ${reportType === 'DIFFICULTY' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>🆘 Lutas</button>
                    </div>
                    <textarea value={reportText} onChange={(e) => setReportText(e.target.value)} placeholder="Escreva aqui..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm h-32 outline-none focus:border-indigo-500 transition-all resize-none" />
                    <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-100">Enviar Relato</button>
                  </form>
                </div>
              )}

              {/* Histórico de Relatos */}
              <div className={`bg-white rounded-3xl p-8 border border-slate-100 shadow-sm max-h-[440px] overflow-y-auto ${disciple.progress === 100 ? 'md:col-span-2' : ''}`}>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">{ICONS.Clock} Histórico de Relatos</h3>
                <div className={`space-y-4 ${disciple.progress === 100 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
                  {disciple.reports.slice().reverse().map(r => (
                    <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase ${r.type === 'GOOD_NEWS' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{r.type === 'GOOD_NEWS' ? 'Vitória' : 'Luta'}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{new Date(r.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <p className="text-xs text-slate-700 italic">"{r.content}"</p>
                    </div>
                  ))}
                  {disciple.reports.length === 0 && (
                    <div className="py-10 text-center text-slate-400 italic text-sm">Nenhum relato no histórico.</div>
                  )}
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DisciplePersonalView;
