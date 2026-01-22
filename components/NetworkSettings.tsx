
import React from 'react';
import { NetworkSettings } from '../types';
import { ICONS } from '../constants';

interface SettingsProps {
  settings: NetworkSettings;
  onUpdate: (s: NetworkSettings) => void;
}

const NetworkSettingsComponent: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="max-w-2xl bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-600 text-white rounded-2xl">{ICONS.Settings}</div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Configurações da Rede</h3>
          <p className="text-sm text-slate-500">Defina os parâmetros globais do discipulado.</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-slate-700 mb-1 block">Duração-Alvo do Ciclo (Semanas)</span>
            <span className="text-xs text-slate-500 mb-3 block">Isso altera como o monitoramento calcula se um discípulo está atrasado.</span>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="4" 
                max="24" 
                value={settings.targetDurationWeeks}
                onChange={e => onUpdate({...settings, targetDurationWeeks: parseInt(e.target.value)})}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="w-12 h-10 flex items-center justify-center bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded-xl">{settings.targetDurationWeeks}</span>
            </div>
          </label>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resumo do Perfil Gestor</h4>
          <ul className="space-y-3">
            {[
              "Capacidade de definir metas de tempo",
              "Gestão de visibilidade de materiais",
              "Controle de pautas e reuniões",
              "Visão macro do progresso da rede"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <div className="text-indigo-600">{ICONS.Check}</div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4">
           <p className="text-[10px] text-center text-slate-400 italic">As alterações são aplicadas instantaneamente a todos os cálculos de monitoramento.</p>
        </div>
      </div>
    </div>
  );
};

export default NetworkSettingsComponent;
