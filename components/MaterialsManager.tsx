
import React, { useState } from 'react';
import { Material, MaterialVisibility } from '../types';
import { ICONS } from '../constants';

const MaterialsManager: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', title: 'Guia do Discipulador - Vol 1', description: 'Manual prático para novos mentores.', visibility: MaterialVisibility.DISCIPLER_ONLY, category: 'Guia' },
    { id: '2', title: 'Planilha de Leitura Bíblica', description: 'Plano anual para o discípulo.', visibility: MaterialVisibility.PUBLIC, category: 'Estudo' }
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({ visibility: MaterialVisibility.PUBLIC });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMaterial.title) {
      setMaterials([...materials, {
        id: Math.random().toString(36).substr(2, 9),
        title: newMaterial.title,
        description: newMaterial.description || '',
        visibility: newMaterial.visibility as MaterialVisibility,
        category: newMaterial.category || 'Geral'
      }]);
      setShowAdd(false);
      setNewMaterial({ visibility: MaterialVisibility.PUBLIC });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-slate-500">Repositório de Lições e Conteúdos</p>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200"
        >
          {ICONS.Plus} Novo Material
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map(m => (
          <div key={m.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl text-indigo-600">{ICONS.Book}</div>
              <span className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase ${m.visibility === MaterialVisibility.PUBLIC ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {m.visibility === MaterialVisibility.PUBLIC ? ICONS.Eye : ICONS.EyeOff}
                {m.visibility}
              </span>
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{m.title}</h4>
            <p className="text-xs text-slate-500 mb-4 h-8 line-clamp-2">{m.description}</p>
            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded">{m.category}</span>
              <button className="text-indigo-600 text-xs font-bold hover:underline">Baixar PDF</button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Cadastrar Material</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Título</label>
                <input required type="text" value={newMaterial.title || ''} onChange={e => setNewMaterial({...newMaterial, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Visibilidade</label>
                <select value={newMaterial.visibility} onChange={e => setNewMaterial({...newMaterial, visibility: e.target.value as MaterialVisibility})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none">
                  <option value={MaterialVisibility.PUBLIC}>Público (Todos)</option>
                  <option value={MaterialVisibility.DISCIPLER_ONLY}>Somente Discipuladores</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Descrição</label>
                <textarea value={newMaterial.description || ''} onChange={e => setNewMaterial({...newMaterial, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none h-20 resize-none" />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 border border-slate-200 rounded-xl font-bold text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsManager;
