
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { AppTab, UserRole, AppNotification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  currentRole, 
  setCurrentRole,
  notifications,
  onMarkRead,
  onClearAll
}) => {
  const [showNotifs, setShowNotifs] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ICONS.Dashboard, roles: [UserRole.MANAGER] },
    { id: 'disciplers', label: 'Discipuladores', icon: ICONS.Disciplers, roles: [UserRole.MANAGER] },
    { id: 'disciples', label: 'Membros', icon: ICONS.Disciples, roles: [UserRole.MANAGER] },
    { id: 'monitoring', label: 'Monitoramento', icon: ICONS.Monitoring, roles: [UserRole.MANAGER] },
    { id: 'my-mentoring', label: 'Minha Mentoria', icon: ICONS.MyMentoring, roles: [UserRole.DISCIPLER] },
    { id: 'my-journey', label: 'Minha Jornada', icon: ICONS.MyJourney, roles: [UserRole.DISCIPLE] },
    { id: 'materials', label: 'Materiais', icon: ICONS.Materials, roles: [UserRole.MANAGER, UserRole.DISCIPLER, UserRole.DISCIPLE] },
    { id: 'meetings', label: 'Reuniões', icon: ICONS.Meetings, roles: [UserRole.MANAGER, UserRole.DISCIPLER] },
    { id: 'settings', label: 'Rede', icon: ICONS.Settings, roles: [UserRole.MANAGER] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentRole));
  const unreadCount = notifications.filter(n => !n.read && (n.targetRole === currentRole || currentRole === UserRole.MANAGER)).length;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen z-50">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">DF</div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            DiscipleFlow
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Menu {currentRole}</p>
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AppTab)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Simular Perfil</label>
            <select 
              value={currentRole}
              onChange={(e) => {
                setCurrentRole(e.target.value as UserRole);
                setShowNotifs(false);
              }}
              className="w-full text-xs font-bold bg-slate-100 border-none rounded-lg p-2 outline-none cursor-pointer"
            >
              <option value={UserRole.MANAGER}>🛡️ Gestor</option>
              <option value={UserRole.DISCIPLER}>✨ Discipulador</option>
              <option value={UserRole.DISCIPLE}>👤 Discipulando</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto bg-[#F8FAFC]">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-6 z-40 justify-between">
           <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
             {navItems.find(n => n.id === activeTab)?.label || 'Painel'}
           </h2>
           
           <div className="flex items-center gap-4 relative">
              <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
              >
                {ICONS.Bell}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Centro de Notificações Popover */}
              {showNotifs && (
                <div className="absolute top-14 right-0 w-80 bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Notificações</h3>
                    <button onClick={onClearAll} className="text-[10px] font-bold text-indigo-600 hover:underline">Limpar</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.filter(n => n.targetRole === currentRole || currentRole === UserRole.MANAGER).length > 0 ? (
                      notifications
                        .filter(n => n.targetRole === currentRole || currentRole === UserRole.MANAGER)
                        .map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => onMarkRead(n.id)}
                          className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors flex gap-3 ${!n.read ? 'bg-indigo-50/30' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            n.type === 'report' ? 'bg-amber-100 text-amber-600' :
                            n.type === 'meeting' ? 'bg-indigo-100 text-indigo-600' :
                            n.type === 'lesson' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {n.type === 'report' ? ICONS.Message : n.type === 'meeting' ? ICONS.Calendar : ICONS.BookMarked}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{n.title}</p>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{n.message}</p>
                            <p className="text-[9px] text-slate-400 mt-1.5 font-medium">{new Date(n.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center text-slate-400">
                        <p className="text-sm">Tudo em paz por aqui!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold">
                {currentRole[0]}
              </div>
           </div>
        </header>
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
