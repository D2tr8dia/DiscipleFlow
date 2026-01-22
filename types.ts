
export enum Gender {
  MALE = 'MASCULINO',
  FEMALE = 'FEMININO'
}

export enum DiscipleStatus {
  WAITING = 'AGUARDANDO',
  ACTIVE = 'ATIVO',
  COMPLETED = 'CONCLUÍDO'
}

export enum UserRole {
  MANAGER = 'GESTOR',
  DISCIPLER = 'DISCIPULADOR',
  DISCIPLE = 'DISCIPULANDO'
}

export enum MaterialVisibility {
  PUBLIC = 'DISCIPULADORES E DISCÍPULOS',
  DISCIPLER_ONLY = 'SOMENTE DISCIPULADORES'
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'report' | 'meeting' | 'lesson' | 'system';
  targetRole: UserRole;
  targetId?: string; // ID específico do usuário (discípulo ou discipulador)
}

export interface DailyReport {
  id: string;
  date: string;
  type: 'DIFFICULTY' | 'GOOD_NEWS' | 'GENERAL';
  content: string;
  readByDiscipler: boolean;
}

export interface Encounter {
  id: string;
  date: string;
  summary: string;
  lessonsCovered: number[];
  prayerRequests?: string;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  visibility: MaterialVisibility;
  category: string;
  link?: string;
}

export interface Meeting {
  id: string;
  date: string;
  agenda: string;
  type: 'TEAM' | 'DISCIPLES';
  participantIds: string[]; // IDs de Discípulos ou Discipuladores
  notifiedLevels: ('DEFINITION' | 'THREE_DAYS' | 'MEETING_DAY')[];
}

export interface NetworkSettings {
  targetDurationWeeks: number;
}

export interface Discipler {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  interests: string[];
  isSpecialized: boolean;
  since: string;
  maxDisciples: number;
  currentDisciplesCount: number;
  bio: string;
}

export interface Disciple {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  interests: string[];
  sensitiveTopics?: string[];
  joinedDate: string;
  startDate?: string;
  status: DiscipleStatus;
  disciplerId?: string;
  completedLessons: number[];
  progress: number;
  lastMeetingDate?: string;
  reports: DailyReport[];
  encounters: Encounter[];
  finalReport?: string;
}

export type AppTab = 'dashboard' | 'disciplers' | 'disciples' | 'monitoring' | 'materials' | 'meetings' | 'settings' | 'my-mentoring' | 'my-journey';
