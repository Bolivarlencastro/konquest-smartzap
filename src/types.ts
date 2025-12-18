export interface Course {
  name: string;
  internalCode: string;
  category: string;
  language: string;
  description: string;
  bannerUrl: string | null;
  cardUrl: string | null;
  workload: string; // e.g., "02:30"
  courseType: string;
  evaluationType: string;

  // Settings from Step 3
  isActive: boolean;
  enableSatisfactionSurvey: boolean;
  allowRetake: boolean;
  allowRetakeForFailed: boolean;
  minimumPerformanceRequired: boolean;
  hasCustomMetadata: boolean;
  isTemporary: boolean;
  contentLocking: {
    enabled: boolean;
    minimumTime: number; // in percentage
  };
  hasCustomCertificate: boolean;

  visibility: 'internal' | 'external';
  topics: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  contents: ContentItem[];
}

export type ContentType = 'video' | 'audio' | 'image' | 'document' | 'web' | 'scorm' | 'quiz';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  source: string; // URL, file path, etc.
  quizData?: Pulse;
}

export interface TrailStep {
  id: string;
  type: 'mission' | 'pulse';
  title: string;
  duration: string;
}

export interface Trail {
  name: string;
  description: string;
  trailType: string;
  language: string;
  isActive: boolean;
  expirationDate: string | null;
  hasCertificate: boolean;
  bannerUrl: string | null;
  cardUrl: string | null;
  content: TrailStep[];
}

export interface EventDate {
  id: string;
  startDate: string; // YYYY-MM-DDTHH:mm
  endDate: string; // YYYY-MM-DDTHH:mm
}

export interface Instructor {
  id: string;
  name: string;
}

export interface SupportMaterial {
  id: string;
  name: string;
  size: number; // in bytes
  type: string; // MIME type
}

export interface Event {
  name: string;
  description: string;
  category: string;
  language: string;
  missionType: 'presencial' | 'online';
  internalCode: string;
  evaluationType: string;
  bannerUrl: string | null;
  cardUrl: string | null;

  // Settings
  isActive: boolean;
  isEvaluationRequired: boolean;
  allowEnrollmentRenewal: boolean;
  minimumPerformance: number;
  expirationDate: string | null;
  completionGoalDays: number;
  minimumContentProgress: number;
  hasCustomCertificate: boolean;
  groups: string[];
  contributors: string[];

  // Event Details
  address: string;
  callLink: string;
  vacancies: number;
  allowSelfPresence: boolean;
  notifyEnrolledUsers: boolean;
  dates: EventDate[];
  supportMaterials: SupportMaterial[];
  instructors: Instructor[];
}

export interface Channel {
  name: string;
  description: string;
  category: string;
  channelType: string;
  language: string;
  isActive: boolean;
  coverImageUrl: string | null;
}

export type PulseType = 'file' | 'link' | 'quiz' | 'text';

export interface QuizQuestion {
  id: string;
  questionText: string;
  imageUrl?: string | null;
  imagePosition?: 'before' | 'after';
  alternatives: string[];
  // Index of the correct alternative
  correctAnswerIndex: number;
  isInBank?: boolean;
}

export interface QuizConfig {
  questionsToDisplay: number | null;
  randomizeQuestions: boolean;
  randomizeAlternatives: boolean;
  retakeAttempts: number;
  showImmediateFeedback: boolean;
  maxTimeMinutes: number | null;
}

export interface Pulse {
  type: PulseType;
  name: string;
  description: string;
  coverImageUrl: string | null;
  status?: 'draft' | 'published';
  // For file type
  fileName?: string;
  // For link type
  linkUrl?: string;
  // For text type
  textContent?: string;
  // For quiz type
  questions?: QuizQuestion[];
  config?: QuizConfig;
}

export interface Group {
  id: string;
  name: string;
  users?: number;
  missions?: number;
  learning_trails?: number;
  channels?: number;
  is_integration?: boolean;
}

export type LayoutType = 'trail' | 'course' | 'banner' | 'pulse';

export interface LayoutTemplate {
  id: string;
  name: string;
  type: LayoutType;
  imageUrl: string;
}

// For Cursos in Content Management
export interface ContentManagementItem {
  id: string;
  name: string;
  creator: string;
  accessType: 'Aberto' | 'Fechado'; // renamed from 'type' to avoid conflict
  duration: string;
  minPerformance: number;
  enrollments: number | null;
  status: 'published' | 'draft' | 'archived';
  statusLabel: string; // "PUBLICADA", "EM CRIAÇÃO", etc.
}

// For Trilhas in Content Management
export interface TrailContentItem {
  id: string;
  name: string;
  creator: string;
  accessType: 'Aberto' | 'Fechado'; // renamed from 'type'
  creationDate: string; // "Criação" column
  duration: string;
  courses: number; // "Cursos" column - number of courses in trail
  pulses: number; // "Pulses" column - number of pulses
  enrollments: number | null; // "Matrículas"
  status: 'published' | 'draft' | 'archived';
  statusLabel: string;
}

// For Eventos in Content Management
export interface EventContentItem {
  id: string;
  name: string;
  date: string; // "Data" column
  enrollments: number | null; // "Matrículas"
  status: 'published' | 'draft' | 'archived';
  statusLabel: string;
}

export interface SmartZapItem {
  id: string;
  name: string;
  property: string; // "Propriedade" column
  category: string;
  creationDate: string; // "Criação" column
  duration: string;
  enrollments: number | null; // "Inscritos"
  completion: number | null; // "Final." (finalizados)
  status: 'published' | 'draft' | 'revision';
  statusLabel: string;
}
export interface EnrollmentItem {
  id: string;
  name: string;
  user: string;
  startDate: string;
  endDate: string;
  goalDate: string;
  performance: number | null;
  delay: string;
  required: string;
  status: 'finalized' | 'in-progress' | 'overdue' | 'enrolled' | 'expired';
  statusLabel: string;
}

export interface SmartZapEnrollmentItem {
  id: string;
  user: string;
  course: string;
  phone: string;
  startDate: string;
  endDate: string;
  performance: number | null;
  messages: string;
  status: 'completed' | 'canceled' | 'received';
  statusLabel: string;
}
