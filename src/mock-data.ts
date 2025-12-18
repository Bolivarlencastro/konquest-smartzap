import { Course, Trail, TrailContentItem, Event, Channel, Pulse, Group, LayoutTemplate } from './types';

export const EMPTY_COURSE: Course = {
  name: '',
  internalCode: '',
  category: 'Sem Categoria',
  language: 'pt-BR',
  description: '',
  bannerUrl: null,
  cardUrl: null,
  workload: '00:00',
  courseType: 'type1',
  evaluationType: 'eval1',
  isActive: true,
  enableSatisfactionSurvey: true,
  allowRetake: false,
  allowRetakeForFailed: false,
  minimumPerformanceRequired: false,
  hasCustomMetadata: false,
  isTemporary: false,
  contentLocking: {
    enabled: false,
    minimumTime: 10
  },
  hasCustomCertificate: false,
  visibility: 'internal',
  topics: []
};


export const MOCK_COURSE_TEMPLATE: Course = {
  name: 'Integração de Novos Colaboradores',
  internalCode: 'INC-2024',
  category: 'Recursos Humanos',
  language: 'pt-BR',
  description: 'Um processo de integração padrão para todos os novos contratados. Cobre a cultura da empresa, políticas e ferramentas essenciais.',
  bannerUrl: null,
  cardUrl: null,
  workload: '08:00',
  courseType: 'type2',
  evaluationType: 'eval2',
  isActive: true,
  enableSatisfactionSurvey: true,
  allowRetake: true,
  allowRetakeForFailed: true,
  minimumPerformanceRequired: false,
  hasCustomMetadata: false,
  isTemporary: false,
  contentLocking: {
    enabled: false,
    minimumTime: 10
  },
  hasCustomCertificate: true,
  visibility: 'internal',
  topics: [
    {
      id: 'topic_1',
      title: 'Módulo 1: Boas-vindas à Empresa',
      contents: [
        { id: 'content_1', type: 'video', title: 'Uma Mensagem do nosso CEO', description: '', source: 'https://www.youtube.com/watch?v=nO_d_J-h3bY' },
        { id: 'content_2', type: 'document', title: 'Manual da Empresa', description: '', source: '' }
      ]
    },
    {
      id: 'topic_2',
      title: 'Módulo 2: Ferramentas e Sistemas',
      contents: [
        { id: 'content_3', type: 'video', title: '6 dicas essenciais de como dar feedback', description: 'Episódio 2', source: 'https://www.youtube.com/watch?v=3z_PYm_H50I' }
      ]
    }
  ]
};

export const EMPTY_TRAIL: Trail = {
  name: '',
  description: '',
  trailType: 'Técnico',
  language: 'pt-BR',
  isActive: true,
  expirationDate: null,
  hasCertificate: false,
  bannerUrl: null,
  cardUrl: null,
  content: []
};

export const MOCK_TRAIL_TEMPLATE: Trail = {
  name: 'Trilha de Vendas para Iniciantes',
  description: 'Uma trilha completa para capacitar novos membros da equipe de vendas, cobrindo desde a prospecção até o fechamento.',
  trailType: 'Técnico',
  language: 'pt-BR',
  isActive: true,
  expirationDate: null,
  hasCertificate: true,
  bannerUrl: null,
  cardUrl: null,
  content: [
    { id: 'm_1', type: 'mission', title: 'Missão: Onboarding de Vendas', duration: '2h' },
    { id: 'p_1', type: 'pulse', title: 'Pulse: Novas Técnicas de Fechamento', duration: '15min' },
    { id: 'p_2', type: 'pulse', title: 'Pulse: Lidando com Objeções', duration: '20min' },
    { id: 'm_2', type: 'mission', title: 'Missão: Cultura da Empresa', duration: '1h 30min' },
  ]
};

export const MOCK_SEARCHABLE_CONTENT: import('./types').TrailStep[] = [
  { id: 'm_1', type: 'mission', title: 'Missão: Onboarding de Vendas', duration: '2h' },
  { id: 'p_1', type: 'pulse', title: 'Pulse: Novas Técnicas de Fechamento', duration: '15min' },
  { id: 'm_2', type: 'mission', title: 'Missão: Cultura da Empresa', duration: '1h 30min' },
  { id: 'p_2', type: 'pulse', title: 'Pulse: Lidando com Objeções', duration: '20min' },
  { id: 'm_3', type: 'mission', title: 'Missão: Segurança da Informação', duration: '4h' },
  { id: 'p_3', type: 'pulse', title: 'Pulse: Phishing - Como se Proteger', duration: '10min' },
];

export const EMPTY_EVENT: Event = {
  name: '',
  description: '',
  category: 'Sem Categoria',
  language: 'pt-BR',
  missionType: 'presencial',
  internalCode: '',
  evaluationType: 'eval1',
  bannerUrl: null,
  cardUrl: null,
  isActive: true,
  isEvaluationRequired: false,
  allowEnrollmentRenewal: false,
  minimumPerformance: 70,
  expirationDate: null,
  completionGoalDays: 0,
  minimumContentProgress: 100,
  hasCustomCertificate: false,
  groups: [],
  contributors: [],
  address: '',
  callLink: '',
  vacancies: 0,
  allowSelfPresence: false,
  notifyEnrolledUsers: false,
  dates: [],
  supportMaterials: [],
  instructors: [],
};

export const MOCK_EVENT_TEMPLATE: Event = {
  name: 'Workshop de Design Thinking',
  description: 'Um workshop prático para aprender e aplicar os princípios do Design Thinking em problemas reais de negócio.',
  category: 'Inovação',
  language: 'pt-BR',
  missionType: 'presencial',
  internalCode: 'EVT-DT-2024',
  evaluationType: 'eval1',
  bannerUrl: null,
  cardUrl: null,
  isActive: true,
  isEvaluationRequired: true,
  allowEnrollmentRenewal: false,
  minimumPerformance: 80,
  expirationDate: '2024-12-31',
  completionGoalDays: 7,
  minimumContentProgress: 100,
  hasCustomCertificate: true,
  groups: [],
  contributors: [],
  address: 'Rua da Inovação, 123, Sala 5, São Paulo - SP',
  callLink: '',
  vacancies: 25,
  allowSelfPresence: true,
  notifyEnrolledUsers: true,
  dates: [
    { id: `date_${Date.now()}`, startDate: '2024-10-20T09:00', endDate: '2024-10-20T17:00' }
  ],
  supportMaterials: [],
  instructors: [
    { id: `inst_${Date.now()}`, name: 'Ana Inovadora' }
  ],
};

export const EMPTY_CHANNEL: Channel = {
  name: '',
  description: '',
  category: 'Geral',
  channelType: 'Educação',
  language: 'pt-BR',
  isActive: true,
  coverImageUrl: null,
};

export const MOCK_CHANNEL_TEMPLATE: Channel = {
  name: 'Canal de Dicas de Produtividade',
  description: 'Um canal focado em compartilhar dicas rápidas e pulses sobre como ser mais produtivo no dia a dia.',
  category: 'Desenvolvimento Pessoal',
  channelType: 'Dicas',
  language: 'pt-BR',
  isActive: true,
  coverImageUrl: null,
};

export const EMPTY_PULSE: Pulse = {
  type: 'text',
  name: '',
  description: '',
  coverImageUrl: null,
  status: 'draft',
  fileName: '',
  linkUrl: '',
  textContent: '',
  questions: [],
  config: {
    questionsToDisplay: null,
    randomizeQuestions: false,
    randomizeAlternatives: false,
    retakeAttempts: 1,
    showImmediateFeedback: true,
    maxTimeMinutes: null
  }
};

export const MOCK_GROUPS: Group[] = [
  { id: '1', name: 'Todos os Colaboradores', users: 150, missions: 5, learning_trails: 2, channels: 3, is_integration: true },
  { id: '2', name: 'Equipe de Vendas', users: 25, missions: 12, learning_trails: 4, channels: 1 },
  { id: '3', name: 'Desenvolvimento', users: 40, missions: 8, learning_trails: 3, channels: 5 },
  { id: '4', name: 'Liderança', users: 15, missions: 20, learning_trails: 6, channels: 2 },
  { id: '5', name: 'Marketing', users: 18, missions: 10, learning_trails: 3, channels: 4 },
  { id: '6', name: 'Recursos Humanos', users: 8, missions: 7, learning_trails: 2, channels: 2 },
];

export const MOCK_LAYOUT_TEMPLATES: LayoutTemplate[] = [
  { id: 't1', type: 'trail', name: 'Padrão Trilha 1', imageUrl: 'https://picsum.photos/seed/trail1/160/90' },
  { id: 't2', type: 'trail', name: 'Trilha Moderna', imageUrl: 'https://picsum.photos/seed/trail2/160/90' },
  { id: 'c1', type: 'course', name: 'Curso Vertical', imageUrl: 'https://picsum.photos/seed/course1/90/160' },
  { id: 'b1', type: 'banner', name: 'Banner Genérico', imageUrl: 'https://picsum.photos/seed/banner1/300/100' },
  { id: 'p1', type: 'pulse', name: 'Pulse Simples', imageUrl: 'https://picsum.photos/seed/pulse1/100/100' },
];

export const MOCK_CONTENT_ITEMS: import('./types').ContentManagementItem[] = [
  {
    id: '1',
    name: 'Tudo sobre o Konquest',
    creator: 'Gustavo',
    accessType: 'Aberto',
    duration: '58 min',
    minPerformance: 0,
    enrollments: 143,
    status: 'published',
    statusLabel: 'PUBLICADA'
  },
  {
    id: '2',
    name: 'Tudo sobre o Learning Analytics',
    creator: 'Gustavo',
    accessType: 'Aberto',
    duration: '12 min',
    minPerformance: 0,
    enrollments: 106,
    status: 'published',
    statusLabel: 'PUBLICADA'
  },
  {
    id: '3',
    name: 'Tudo sobre o My Account',
    creator: 'Gustavo',
    accessType: 'Aberto',
    duration: '11 min',
    minPerformance: 0,
    enrollments: 97,
    status: 'published',
    statusLabel: 'PUBLICADA'
  },
  {
    id: '4',
    name: 'a',
    creator: 'Suporte Keeps',
    accessType: 'Fechado',
    duration: '--:--',
    minPerformance: 0,
    enrollments: null,
    status: 'draft',
    statusLabel: 'EM CRIAÇÃO'
  },
  {
    id: '5',
    name: 'Certificado Personalizado',
    creator: 'Bolivar',
    accessType: 'Aberto',
    duration: '--:--',
    minPerformance: 0,
    enrollments: 2,
    status: 'draft',
    statusLabel: 'EM CRIAÇÃO'
  },
  {
    id: '6',
    name: 'Nome do curso',
    creator: 'Bolivar',
    accessType: 'Aberto',
    duration: '--:--',
    minPerformance: 0,
    enrollments: null,
    status: 'draft',
    statusLabel: 'EM CRIAÇÃO'
  }
];

export const MOCK_TRAIL_ITEMS: import('./types').TrailContentItem[] = [
  {
    id: 't1',
    name: 'nome de uma trilha legal',
    creator: 'Conteudistas',
    accessType: 'Aberto',
    creationDate: '11/10/2024',
    duration: '7 h 1 min',
    courses: 0,
    pulses: 1,
    enrollments: 3,
    status: 'published',
    statusLabel: 'PUBLICADA'
  },
  {
    id: 't2',
    name: 'trail 080824',
    creator: 'Admin testerSTAGE',
    accessType: 'Aberto',
    creationDate: '08/08/2024',
    duration: '2 s',
    courses: 0,
    pulses: 2,
    enrollments: 3,
    status: 'published',
    statusLabel: 'PUBLICADA'
  },
  {
    id: 't3',
    name: 'trilha eclipse2',
    creator: 'Emmanuel',
    accessType: 'Aberto',
    creationDate: '15/10/2024',
    duration: '1 h 0 min',
    courses: 0,
    pulses: 1,
    enrollments: 1,
    status: 'draft',
    statusLabel: 'RASCUNHO'
  },
  {
    id: 't4',
    name: 'new trail created 010524',
    creator: 'Admin testerSTAGE',
    accessType: 'Aberto',
    creationDate: '10/05/2024',
    duration: '1 h 0 min',
    courses: 0,
    pulses: 1,
    enrollments: 17,
    status: 'published',
    statusLabel: 'PUBLICADA'
  }
];

export const MOCK_EVENT_ITEMS: import('./types').EventContentItem[] = [
  {
    id: 'e1',
    name: 'KEEPS',
    date: '',
    enrollments: 2,
    status: 'published',
    statusLabel: 'PUBLICADA'
  },
  {
    id: 'e2',
    name: 'teste edição rápida',
    date: '30/09/2024',
    enrollments: 5,
    status: 'published',
    statusLabel: 'PUBLICADA'
  },
  {
    id: 'e3',
    name: '030924 live event',
    date: '09/10/2025',
    enrollments: 0,
    status: 'published',
    statusLabel: 'PUBLICADA'
  },
  {
    id: 'e4',
    name: '12/07/24',
    date: '12/07/2024',
    enrollments: 0,
    status: 'published',
    statusLabel: 'PUBLICADA'
  },
  {
    id: 'e5',
    name: '1826 live event',
    date: '',
    enrollments: 1,
    status: 'published',
    statusLabel: 'PUBLICADA'
  }
];

export const MOCK_SMARTZAP_ITEMS: import('./types').SmartZapItem[] = [
  {
    id: 's1',
    name: 'CUBERTO TESTE ANA 1',
    property: 'Carolina',
    category: 'Development',
    creationDate: '09/03/2023',
    duration: '--:--',
    enrollments: 0,
    completion: 0,
    status: 'revision',
    statusLabel: 'Revisão'
  },
  {
    id: 's2',
    name: 'de Boas-Vindas - não obrigatório',
    property: 'Time Experiencia de Aprendizagem',
    category: 'Communications',
    creationDate: '19/09/2024',
    duration: '16 min',
    enrollments: 613,
    completion: 387,
    status: 'published',
    statusLabel: 'Publicado'
  },
  {
    id: 's3',
    name: 'de Boas-Vindas',
    property: 'Time Experiencia de Aprendizagem',
    category: 'Communications',
    creationDate: '09/03/2024',
    duration: '9 min',
    enrollments: 1234,
    completion: 856,
    status: 'published',
    statusLabel: 'Publicado'
  },
  {
    id: 's4',
    name: 'LiderAna',
    property: 'Time Experiencia de Aprendizagem',
    category: 'Development',
    creationDate: '05/04/2024',
    duration: '17 min',
    enrollments: 701,
    completion: 299,
    status: 'published',
    statusLabel: 'Publicado'
  },
  {
    id: 's5',
    name: 'Lídea Anal (TESTE)',
    property: 'Time Experiencia de Aprendizagem',
    category: 'Development',
    creationDate: '08/04/2024',
    duration: '17 min',
    enrollments: 4,
    completion: 4,
    status: 'published',
    statusLabel: 'Publicado'
  }
];
// Enrollment Mock Data
export const MOCK_TRAIL_ENROLLMENTS: import('./types').EnrollmentItem[] = [
  {
    id: 'te1',
    name: 'Tudo sobre a Plataforma de Capacitação',
    user: 'Bruno Rocha',
    startDate: '24/09/2025',
    endDate: '24/09/2025',
    goalDate: '25/09/2025',
    performance: 100,
    delay: '-',
    required: '-',
    status: 'finalized',
    statusLabel: 'FINALIZADA'
  },
  {
    id: 'te2',
    name: 'PDI proforma teste 9/23',
    user: 'Suporte Keeps',
    startDate: '23/09/2025',
    endDate: '-',
    goalDate: '30/09/2025',
    performance: null,
    delay: '73 dias em atraso',
    required: '-',
    status: 'overdue',
    statusLabel: 'OBRIGATÓRIA'
  },
  {
    id: 'te3',
    name: 'teste pdi gabriel 9/19',
    user: 'EDUARDOKORB',
    startDate: '19/09/2025',
    endDate: '-',
    goalDate: '30/09/2025',
    performance: null,
    delay: '73 dias em atraso',
    required: '-',
    status: 'overdue',
    statusLabel: 'OBRIGATÓRIA'
  }
];

export const MOCK_COURSE_ENROLLMENTS: import('./types').EnrollmentItem[] = [
  {
    id: 'ce1',
    name: 'Imersão na construção de uma...',
    user: 'Ana Júlia Buss',
    startDate: '05/01/2023',
    endDate: '05/01/2023',
    goalDate: '03/02/2023',
    performance: 53,
    delay: '-',
    required: '-',
    status: 'finalized',
    statusLabel: 'FINALIZADA'
  },
  {
    id: 'ce2',
    name: 'Entendendo todas as configurações',
    user: 'Rangel',
    startDate: '07/03/2023',
    endDate: '-',
    goalDate: '31/03/2023',
    performance: null,
    delay: '-',
    required: '-',
    status: 'expired',
    statusLabel: 'EXPIRADA'
  },
  {
    id: 'ce3',
    name: 'Análise dos resultados',
    user: 'João Tolovi Keeps',
    startDate: '26/06/2023',
    endDate: '26/06/2023',
    goalDate: '30/06/2023',
    performance: 62,
    delay: '-',
    required: '-',
    status: 'finalized',
    statusLabel: 'FINALIZADA'
  }
];

export const MOCK_EVENT_ENROLLMENTS: import('./types').EnrollmentItem[] = [
  {
    id: 'ee1',
    name: 'Treinamento Konquest (Plantão C5)',
    user: 'Gustavo',
    startDate: '30/09/2024',
    endDate: '30/09/2024',
    goalDate: '30/09/2024',
    performance: 0,
    delay: '-',
    required: '-',
    status: 'expired',
    statusLabel: 'REPROVADA'
  },
  {
    id: 'ee2',
    name: 'Treinamento Konquest (Plantão C5)',
    user: 'Suporte Keeps',
    startDate: '30/09/2024',
    endDate: '30/09/2024',
    goalDate: '30/09/2024',
    performance: 100,
    delay: '-',
    required: '-',
    status: 'finalized',
    statusLabel: 'FINALIZADA'
  },
  {
    id: 'ee3',
    name: 'asdasdasd',
    user: 'Lucas Duarte Teste',
    startDate: '22/10/2024',
    endDate: '-',
    goalDate: '20/10/2023',
    performance: null,
    delay: '-',
    required: '-',
    status: 'enrolled',
    statusLabel: 'MATRICULADA'
  }
];

export const MOCK_SMARTZAP_ENROLLMENTS: import('./types').SmartZapEnrollmentItem[] = [
  {
    id: 'se1',
    user: 'LIVIA SILVA MOURA',
    course: 'de Boas-Vindas',
    phone: '(31) 98758-3755',
    startDate: '-',
    endDate: '-',
    performance: null,
    messages: '-',
    status: 'received',
    statusLabel: 'Recusou'
  },
  {
    id: 'se2',
    user: 'ANDRE SOARES DO AMARAL',
    course: 'de Boas-Vindas',
    phone: '(19) 99936-2011',
    startDate: '14/03/2025',
    endDate: '-',
    performance: null,
    messages: '-',
    status: 'canceled',
    statusLabel: 'Cancelada'
  },
  {
    id: 'se3',
    user: 'DOUGLAS BEZERRA DE MIRANDA',
    course: 'de Boas-Vindas',
    phone: '(17) 97400-5091',
    startDate: '14/03/2025',
    endDate: '14/03/2025',
    performance: 100,
    messages: '0/7',
    status: 'completed',
    statusLabel: 'Completou'
  },
  {
    id: 'se4',
    user: 'ALEX JOSE AVANCINI MOREAU',
    course: 'de Boas-Vindas',
    phone: '(15) 99748-1439',
    startDate: '14/03/2025',
    endDate: '19/03/2025',
    performance: 100,
    messages: '0/5',
    status: 'completed',
    statusLabel: 'Completou'
  }
];
