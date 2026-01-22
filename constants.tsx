
import React from 'react';
import { 
  Users, 
  ClipboardCheck, 
  LayoutDashboard, 
  UserCheck,
  ChevronRight,
  Plus,
  Search,
  BookOpen,
  Target,
  UserPlus,
  ShieldCheck,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Bell,
  Settings,
  Eye,
  EyeOff,
  MessageSquare,
  Sparkles,
  Zap,
  BookMarked,
  History,
  ClipboardEdit
} from 'lucide-react';
import { Discipler, Disciple, Gender, DiscipleStatus } from './types';

export const ICONS = {
  Dashboard: <LayoutDashboard size={20} />,
  Disciplers: <UserCheck size={20} />,
  Disciples: <Users size={20} />,
  Monitoring: <ClipboardCheck size={20} />,
  Materials: <FileText size={20} />,
  Meetings: <Bell size={20} />,
  Settings: <Settings size={20} />,
  MyMentoring: <Sparkles size={20} />,
  MyJourney: <Zap size={20} />,
  ChevronRight: <ChevronRight size={16} />,
  Plus: <Plus size={20} />,
  Search: <Search size={20} />,
  Book: <BookOpen size={20} />,
  Target: <Target size={20} />,
  UserAdd: <UserPlus size={20} />,
  Specialized: <ShieldCheck size={16} className="text-amber-500" />,
  Warning: <AlertCircle size={16} className="text-red-500" />,
  Calendar: <Calendar size={14} />,
  Check: <CheckCircle2 size={16} />,
  Clock: <Clock size={14} />,
  Bell: <Bell size={20} />,
  Eye: <Eye size={14} />,
  EyeOff: <EyeOff size={14} />,
  Message: <MessageSquare size={16} />,
  BookMarked: <BookMarked size={16} />,
  History: <History size={16} />,
  Register: <ClipboardEdit size={16} />,
  Zap: <Zap size={20} />
};

export const LESSONS_DETAIL = [
  { title: "O chamado para ser um elo", goal: "Entender que o discipulado é uma corrente de cuidado.", verse: "2 Timóteo 2:2" },
  { title: "Quem é Deus e como Ele se revela", goal: "Introduzir a natureza de Deus através da criação e palavra.", verse: "Salmos 19:1" },
  { title: "A Graça que Transforma", goal: "Explorar o conceito de favor imerecido.", verse: "Efésios 2:8-9" },
  { title: "O Espírito Santo e o cotidiano", goal: "Prática da presença de Deus no dia a dia.", verse: "Gálatas 5:22-23" },
  { title: "A Palavra e o mundo", goal: "Como aplicar as escrituras em decisões práticas.", verse: "Salmos 119:105" },
  { title: "Comunidade como corpo", goal: "O papel do indivíduo na igreja local.", verse: "1 Coríntios 12:12" },
  { title: "Santidade no dia a dia", goal: "Viver de forma íntegra em ambientes seculares.", verse: "1 Pedro 1:15" },
  { title: "Fé e cidade", goal: "Missão social e influência cristã.", verse: "Jeremias 29:7" },
  { title: "Chamado e Serviço", goal: "Identificação de dons e talentos.", verse: "Romanos 12:6" },
  { title: "Batismo: fé que se vê", goal: "Preparação para o ato público de fé.", verse: "Mateus 28:19" },
  { title: "Discipulado e multiplicação", goal: "Como o discípulo se torna discipulador.", verse: "Mateus 28:20" },
  { title: "O Reino que virá", goal: "Esperança cristã e a segunda vinda.", verse: "Apocalipse 21:1-4" }
];

export const LESSONS = LESSONS_DETAIL.map(l => l.title);

const now = new Date();
const getPastDate = (weeksAgo: number) => {
  const d = new Date();
  d.setDate(now.getDate() - (weeksAgo * 7));
  return d.toISOString().split('T')[0];
};

export const MOCK_DISCIPLERS: Discipler[] = [
  { 
    id: '1', name: 'João Silva', gender: Gender.MALE, age: 34, 
    interests: ['Esportes', 'Teologia', 'Família'], isSpecialized: false,
    since: '2022-01-10', maxDisciples: 3, currentDisciplesCount: 2, bio: 'Líder de jovens experiente.' 
  },
  { 
    id: '2', name: 'Maria Souza', gender: Gender.FEMALE, age: 45, 
    interests: ['Culinária', 'Aconselhamento', 'Música'], isSpecialized: true,
    since: '2021-05-15', maxDisciples: 4, currentDisciplesCount: 2, bio: 'Pastora auxiliar com foco em restauração familiar.' 
  }
];

export const MOCK_DISCIPLES: Disciple[] = [
  { 
    id: 'd1', name: 'Carlos Oliveira', gender: Gender.MALE, age: 31, 
    interests: ['Futebol', 'Finanças'], joinedDate: getPastDate(12), 
    startDate: getPastDate(4), status: DiscipleStatus.ACTIVE, 
    disciplerId: '1', completedLessons: [1, 2, 3, 4], progress: 33, lastMeetingDate: getPastDate(0),
    reports: [
      { id: 'r1', date: getPastDate(1), type: 'GOOD_NEWS', content: 'Consegui orar todos os dias desta semana!', readByDiscipler: true },
      { id: 'r2', date: getPastDate(0), type: 'DIFFICULTY', content: 'Estou com dificuldades em entender a lição 5 sobre a Palavra.', readByDiscipler: false }
    ],
    encounters: []
  }
];
