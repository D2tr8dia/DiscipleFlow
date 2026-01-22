
import React from 'react';
import { ICONS } from '../constants';
import { Discipler, Disciple, DiscipleStatus } from '../types';

interface DashboardProps {
  disciplers: Discipler[];
  disciples: Disciple[];
}

const Dashboard: React.FC<DashboardProps> = ({ disciplers, disciples }) => {
  const stats = [
    { label: 'Discipuladores', value: disciplers.length, icon: <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">{ICONS.Disciplers}</div> },
    // Fix: Replaced invalid ICONS.UserCheck with ICONS.Disciplers which utilizes the UserCheck icon from lucide-react
    { label: 'Discípulos Ativos', value: disciples.filter(d => d.status === DiscipleStatus.ACTIVE).length, icon: <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">{ICONS.Disciplers}</div> },
    { label: 'Aguardando Pareamento', value: disciples.filter(d => d.status === DiscipleStatus.WAITING).length, icon: <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">{ICONS.Search}</div> },
    { label: 'Concluíram o Ciclo', value: disciples.filter(d => d.status === DiscipleStatus.COMPLETED).length, icon: <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">{ICONS.Target}</div> },
  ];

  const recentDisciples = [...disciples].sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()).slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
            {stat.icon}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Members */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Novos Membros</h3>
            <button className="text-indigo-600 text-sm font-semibold hover:underline">Ver todos</button>
          </div>
          <div className="space-y-4">
            {recentDisciples.map(disciple => (
              <div key={disciple.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                    {disciple.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{disciple.name}</p>
                    <p className="text-xs text-slate-500">{new Date(disciple.joinedDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  disciple.status === DiscipleStatus.WAITING ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {disciple.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Média de Crescimento</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * 65) / 100} className="text-indigo-600 transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">65%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Geral</span>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-slate-500 px-4">
              Seus discípulos estão avançando nas etapas do discipulado com consistência. Continue incentivando as reuniões semanais!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
