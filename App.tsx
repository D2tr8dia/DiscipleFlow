
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DisciplersList from './components/DisciplersList';
import DisciplesList from './components/DisciplesList';
import Monitoring from './components/Monitoring';
import MaterialsManager from './components/MaterialsManager';
import MeetingsManager from './components/MeetingsManager';
import NetworkSettingsComponent from './components/NetworkSettings';
import DisciplerPersonalView from './components/DisciplerPersonalView';
import DisciplePersonalView from './components/DisciplePersonalView';
import { ICONS } from './constants';
import { 
  AppTab, 
  Discipler, 
  Disciple, 
  DiscipleStatus,
  NetworkSettings,
  UserRole,
  DailyReport,
  Encounter,
  AppNotification,
  Meeting
} from './types';
import { MOCK_DISCIPLERS, MOCK_DISCIPLES } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.MANAGER);
  
  const [disciplers, setDisciplers] = useState<Discipler[]>(MOCK_DISCIPLERS);
  const [disciples, setDisciples] = useState<Disciple[]>(MOCK_DISCIPLES);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [settings, setSettings] = useState<NetworkSettings>({ targetDurationWeeks: 12 });
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toast, setToast] = useState<AppNotification | null>(null);

  // IDs simulados
  const currentDisciplerId = '1';
  const currentDiscipleId = 'd1';

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    const savedDisciplers = localStorage.getItem('df_disciplers');
    const savedDisciples = localStorage.getItem('df_disciples');
    const savedSettings = localStorage.getItem('df_settings');
    const savedMeetings = localStorage.getItem('df_meetings');
    const savedNotifs = localStorage.getItem('df_notifications');
    
    if (savedDisciplers) setDisciplers(JSON.parse(savedDisciplers));
    if (savedDisciples) setDisciples(JSON.parse(savedDisciples));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedMeetings) setMeetings(JSON.parse(savedMeetings));
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
  }, []);

  useEffect(() => {
    localStorage.setItem('df_disciplers', JSON.stringify(disciplers));
    localStorage.setItem('df_disciples', JSON.stringify(disciples));
    localStorage.setItem('df_settings', JSON.stringify(settings));
    localStorage.setItem('df_meetings', JSON.stringify(meetings));
    localStorage.setItem('df_notifications', JSON.stringify(notifications));
  }, [disciplers, disciples, settings, meetings, notifications]);

  const addNotification = useCallback((title: string, message: string, type: AppNotification['type'], targetRole: UserRole, targetId?: string) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
      targetRole,
      targetId
    };

    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    
    const isTarget = (!targetId || targetId === currentDisciplerId || targetId === currentDiscipleId);
    const isGestor = currentRole === UserRole.MANAGER;

    if (isTarget || isGestor) {
      setToast(newNotif);
      setTimeout(() => setToast(null), 5000);

      if (("Notification" in window) && Notification.permission === "granted") {
        new Notification(title, { body: message });
      }
    }
  }, [currentRole, currentDisciplerId, currentDiscipleId]);

  const handleAddMeeting = (m: Meeting) => {
    setMeetings(prev => [...prev, m]);
    m.participantIds.forEach(id => {
      const role = m.type === 'TEAM' ? UserRole.DISCIPLER : UserRole.DISCIPLE;
      addNotification(
        "Novo Encontro Agendado", 
        `Você tem uma reunião marcada para ${new Date(m.date).toLocaleDateString('pt-BR')}.`,
        'meeting',
        role,
        id
      );
    });

    if (m.type === 'TEAM') {
       addNotification("Reunião de Equipe", "Uma nova reunião de equipe foi criada.", 'meeting', UserRole.MANAGER);
    }
  };

  const handleRegisterEncounter = (discipleId: string, encounterData: Partial<Encounter>) => {
    setDisciples(prev => prev.map(d => {
      if (d.id === discipleId) {
        const newEncounter: Encounter = {
          id: 'enc-' + Math.random().toString(36).substr(2, 5),
          date: encounterData.date || new Date().toISOString(),
          summary: encounterData.summary || '',
          lessonsCovered: encounterData.lessonsCovered || [],
          prayerRequests: encounterData.prayerRequests || ''
        };
        const updatedLessons = Array.from(new Set([...d.completedLessons, ...(encounterData.lessonsCovered || [])])).sort((a, b) => a - b);
        const progress = Math.round((updatedLessons.length / 12) * 100);
        addNotification("Progresso Registrado", `Seu mentor registrou o encontro. Novo progresso: ${progress}%`, 'lesson', UserRole.DISCIPLE, d.id);
        return {
          ...d,
          encounters: [...(d.encounters || []), newEncounter],
          completedLessons: updatedLessons,
          progress,
          status: updatedLessons.length === 12 ? DiscipleStatus.COMPLETED : d.status,
          lastMeetingDate: newEncounter.date
        };
      }
      return d;
    }));
  };

  const handleFinishDiscipleship = (discipleId: string, finalReport: string) => {
    setDisciples(prev => prev.map(d => {
      if (d.id === discipleId) {
        addNotification("Jornada Concluída!", "Seu mentor publicou o relatório geral de conclusão da sua jornada. Parabéns!", 'system', UserRole.DISCIPLE, d.id);
        return {
          ...d,
          finalReport,
          status: DiscipleStatus.COMPLETED
        };
      }
      return d;
    }));
  };

  const handleSendReport = (report: Partial<DailyReport>) => {
    setDisciples(prev => prev.map(d => {
      if (d.id === currentDiscipleId) {
        const newReport: DailyReport = {
          id: 'r' + Math.random().toString(36).substr(2, 5),
          date: new Date().toISOString(),
          type: report.type || 'GENERAL',
          content: report.content || '',
          readByDiscipler: false
        };
        addNotification("Novo Relato", `${d.name} enviou um novo relatório.`, 'report', UserRole.DISCIPLER, d.disciplerId);
        return { ...d, reports: [...d.reports, newReport] };
      }
      return d;
    }));
  };

  const handlePair = (discId: string, discrId: string) => {
    setDisciples(prev => prev.map(d => d.id === discId ? { ...d, disciplerId: discrId, status: DiscipleStatus.ACTIVE, startDate: new Date().toISOString().split('T')[0] } : d));
    setDisciplers(prev => prev.map(dr => dr.id === discrId ? { ...dr, currentDisciplesCount: dr.currentDisciplesCount + 1 } : dr));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard disciplers={disciplers} disciples={disciples} />;
      case 'disciplers': return <DisciplersList disciplers={disciplers} onAddDiscipler={d => setDisciplers([...disciplers, d])} />;
      case 'disciples': return <DisciplesList disciples={disciples} disciplers={disciplers} onAddDisciple={d => setDisciples([...disciples, d])} onPair={handlePair} />;
      case 'monitoring': return <Monitoring disciples={disciples} disciplers={disciplers} settings={settings} onToggleLesson={() => {}} />;
      case 'materials': return <MaterialsManager />;
      case 'meetings': return <MeetingsManager meetings={meetings} onAddMeeting={handleAddMeeting} disciples={disciples} disciplers={disciplers} currentRole={currentRole} currentUserId={currentDisciplerId} />;
      case 'settings': return <NetworkSettingsComponent settings={settings} onUpdate={setSettings} />;
      case 'my-mentoring': 
        const meDiscipler = disciplers.find(dr => dr.id === currentDisciplerId) || disciplers[0];
        const myDisciples = disciples.filter(d => d.disciplerId === currentDisciplerId);
        return (
          <DisciplerPersonalView 
            discipler={meDiscipler} 
            myDisciples={myDisciples} 
            onToggleLesson={() => {}} 
            onRegisterEncounter={handleRegisterEncounter}
            onFinishDiscipleship={handleFinishDiscipleship}
          />
        );
      case 'my-journey':
        const meDisciple = disciples.find(d => d.id === currentDiscipleId) || disciples[0];
        const myMeetings = meetings.filter(m => m.participantIds.includes(currentDiscipleId));
        return <DisciplePersonalView disciple={meDisciple} onSendReport={handleSendReport} myMeetings={myMeetings} />;
      default: return <Dashboard disciplers={disciplers} disciples={disciples} />;
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (currentRole === UserRole.MANAGER) return true;
    if (n.targetId) return n.targetId === (currentRole === UserRole.DISCIPLER ? currentDisciplerId : currentDiscipleId);
    return n.targetRole === currentRole;
  });

  return (
    <Layout 
      activeTab={activeTab} setActiveTab={setActiveTab} currentRole={currentRole} setCurrentRole={setCurrentRole}
      notifications={filteredNotifs} onMarkRead={id => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))} onClearAll={() => setNotifications([])}
    >
      {renderContent()}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-8 duration-300">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700 min-w-[300px]">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center animate-pulse">{ICONS.Bell}</div>
            <div><p className="text-xs font-bold uppercase opacity-50 tracking-widest">{toast.title}</p><p className="text-sm font-medium">{toast.message}</p></div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
