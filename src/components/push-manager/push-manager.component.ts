import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ViewMode = 'dashboard' | 'sender';
type PaymentStatus = 'Pendente' | 'Enviado';

type ScheduledPush = { id: string; name: string; scheduledDate: string; totalPush: number; status: PaymentStatus };
type PushCampaign = { id: string; courseName: string; dispatchDate: string; totalPush: number; investment: number };
type MessageTemplate = { id: string; name: string; content: string; buttons?: string[] };
type Contact = { id: number; nome: string; telefone: string; erro?: string };

@Component({
  selector: 'app-push-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './push-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PushManagerComponent {
  view = signal<ViewMode>('dashboard');
  step = signal<number>(1);

  scheduledPushes: ScheduledPush[] = [
    { id: 's1', name: 'Campanha Reativação Jan/25', scheduledDate: '28/01/2025 14:00', totalPush: 5000, status: 'Pendente' },
    { id: 's2', name: 'Lembrete: SEGURO DE AUTO', scheduledDate: '30/01/2025 09:30', totalPush: 3200, status: 'Pendente' },
  ];

  campaigns: PushCampaign[] = [
    { id: '1', courseName: 'SEGURO DE VIDA COMO INSTR...', dispatchDate: '15/01/2025', totalPush: 12450, investment: 1550.0 },
    { id: '2', courseName: 'ARGUMENTOS DE VENDA - SEG...', dispatchDate: '23/12/2025', totalPush: 8200, investment: 980.5 },
    { id: '3', courseName: 'PORTABILIDADE EM PREVIDÊNCIA', dispatchDate: '10/12/2025', totalPush: 6700, investment: 720.0 },
    { id: '4', courseName: 'DÍVIDA ZERO', dispatchDate: '05/12/2025', totalPush: 9100, investment: 1100.25 },
  ];

  templates: MessageTemplate[] = [
    {
      id: 'temp_lan_1',
      name: 'Lançamento – Anúncio direto',
      content:
        '🚀 Novo curso disponível!\n\nOlá, aqui é da {{workspace_name}} e queremos compartilhar uma novidade com você.\n\nO curso {{nome_do_curso}} já está no ar e foi criado para ajudar você a desenvolver {{principal_benefício}}.\n\n👉 Comece agora e evolua no seu ritmo.',
      buttons: ['Acessar curso', 'Fazer a matrícula agora'],
    },
    {
      id: 'temp_lan_2',
      name: 'Lançamento – Benefício + dor',
      content:
        'Olá!! Você já sentiu dificuldade em {{dor_do_publico}}?\n\nPensando nisso, lançamos o curso {{nome_do_curso}}, focado em {{resultado_prático}}.\n\nAprendizado rápido, direto e aplicável ao seu dia a dia.',
      buttons: ['Acessar curso', 'Fazer a matrícula agora'],
    },
    {
      id: 'temp_lan_3',
      name: 'Lançamento – Tom de exclusividade',
      content:
        '👀 Novidade para você!\n\nO curso {{nome_do_curso}} acaba de ser lançado e já está disponível para começar hoje mesmo.\n\nAproveite para sair na frente e desenvolver {{competência_chave}}.',
      buttons: ['🚀 Quero começar'],
    },
    {
      id: 'temp_eng_1',
      name: 'Engajamento – Reativação simples',
      content:
        '👋 Oi!! Notamos que o curso {{nome_do_curso}} está disponível para você, mas ainda não foi iniciado.\n\nQue tal reservar alguns minutos hoje e dar o primeiro passo?',
      buttons: ['Iniciar curso', 'Ver outras sugestões'],
    },
    {
      id: 'temp_eng_2',
      name: 'Engajamento – Valor prático',
      content:
        'Sabia que o curso {{nome_do_curso}} pode ajudar você a {{benefício_prático}}?\n\nEle foi pensado para ser rápido, direto e fácil de aplicar no trabalho.',
      buttons: ['Acessar agora', 'Conhecer outros cursos'],
    },
    {
      id: 'temp_eng_3',
      name: 'Engajamento – Tempo curto',
      content:
        '⏱️ Falta de tempo não precisa ser um problema.\n\nO curso {{nome_do_curso}} pode ser feito em pequenos blocos, no seu ritmo.\n\nQue tal retomar hoje?',
      buttons: ['🔄 Retomar curso'],
    },
    {
      id: 'temp_ind_1',
      name: 'Indicação – 3 cursos (escolha)',
      content:
        '👋 Oiee, selecionamos cursos que combinam com seu perfil 👇\n\n1️⃣ {{curso_1}}\n\n2️⃣ {{curso_2}}\n\n3️⃣ {{curso_3}}\n\nEscolha por onde quer começar ou explore o portal completo.',
      buttons: ['Matricular em um curso', 'Ver todas as opções'],
    },
    {
      id: 'temp_ind_2',
      name: 'Indicação – Tom consultivo',
      content:
        'Se você quer evoluir em {{área_de_desenvolvimento}}, esses cursos são um ótimo próximo passo:\n\n👉 {{curso_1}}\n\n👉 {{curso_2}}\n\n👉 {{curso_3}}',
      buttons: ['Me matricular', 'Ver todos os cursos'],
    },
    {
      id: 'temp_por_1',
      name: 'Portal – Convite direto',
      content:
        'Já conhece nosso portal de cursos?\n\nLá você encontra conteúdos rápidos, práticos e focados no seu desenvolvimento profissional.\n\n👉 Acesse aqui: {{link_encurtado}}',
      buttons: ['Acessar portal'],
    },
    {
      id: 'temp_por_2',
      name: 'Portal – Benefícios claros',
      content:
        '📚 Um portal completo para aprender no seu ritmo.\n\nCursos curtos, conteúdos atualizados e foco em aplicação prática.\n\n{{texto_livre}}\n\nConheça agora: {{link_encurtado}}',
    },
    {
      id: 'temp_por_3',
      name: 'Portal – Curiosidade',
      content:
        'Você sabia que tem acesso a diversos cursos focados em {{tema_principal}}?\n\nExplore o portal e encontre o conteúdo ideal para você:\n\n{{link_encurtado}}',
    },
    {
      id: 'temp_ret_1',
      name: 'Retomada – Lembrete leve',
      content:
        '👋 Oi, {{nome}}!\n\nVocê iniciou o curso {{nome_do_curso}}, mas ainda não concluiu.\n\nQue tal continuar de onde parou?',
      buttons: ['🔄 Continuar curso'],
    },
    {
      id: 'temp_ret_2',
      name: 'Retomada – Reforço de benefício',
      content:
        'Falta pouco para concluir o curso {{nome_do_curso}}!\n\nAo finalizar, você vai desenvolver {{benefício_final}} e aplicar isso no dia a dia.',
      buttons: ['✅ Finalizar curso'],
    },
    {
      id: 'temp_ret_3',
      name: 'Retomada – Conquista',
      content:
        '🎯 Você já deu o primeiro passo no curso {{nome_do_curso}}.\n\nAgora é só continuar para concluir e aproveitar todo o conteúdo.',
      buttons: ['🚀 Retomar agora'],
    },
  ];

  selectedTemplate = signal<MessageTemplate | null>(null);
  variableValues = signal<Record<string, string>>({});
  dispatchDate = signal<string>('');
  fileName = signal<string | null>(null);
  contacts = signal<Contact[]>([]);
  isSubmitting = signal<boolean>(false);
  isLinkedToCourse = signal<boolean>(true);
  selectedCourseId = signal<string>('');
  campaignName = signal<string>('');

  steps = [
    { id: 1, label: 'Template', description: 'Personalize o modelo' },
    { id: 2, label: 'Contatos', description: 'Upload da base' },
    { id: 3, label: 'Agendamento', description: 'Defina data e curso' },
    { id: 4, label: 'Revisão', description: 'Confira e dispare' },
  ];

  extractedVariables = computed(() => {
    const tpl = this.selectedTemplate();
    if (!tpl) return [];
    const regex = /{{(.*?)}}/g;
    const matches = tpl.content.matchAll(regex);
    const vars = Array.from(new Set(Array.from(matches).map(m => m[1])));
    this.variableValues.set(
      vars.reduce<Record<string, string>>((acc, key) => {
        acc[key] = this.variableValues()[key] ?? '';
        return acc;
      }, {}),
    );
    return vars;
  });

  renderedTemplate = computed(() => {
    const tpl = this.selectedTemplate();
    if (!tpl) return null;
    let content = tpl.content;
    this.extractedVariables().forEach(key => {
      const value = this.variableValues()[key] || `{{${key}}}`;
      content = content.split(`{{${key}}}`).join(value);
    });
    return { ...tpl, content };
  });

  setTemplate(tpl: MessageTemplate): void {
    this.selectedTemplate.set(tpl);
  }

  setVariable(key: string, value: string): void {
    this.variableValues.update(v => ({ ...v, [key]: value }));
  }

  handleFileUpload(fileName: string): void {
    this.fileName.set(fileName);
    this.contacts.set([
      { id: 1, nome: 'Ana Silva', telefone: '11988887777' },
      { id: 2, nome: 'Bruno Costa', telefone: '21977776666' },
      { id: 3, nome: 'Carla Dias', telefone: '118888', erro: 'Formato inválido' },
      { id: 4, nome: 'Daniel Oliveira', telefone: '31955554444' },
    ]);
  }

  handleBack(): void {
    if (this.step() > 1) {
      this.step.update(s => s - 1);
    } else {
      this.view.set('dashboard');
    }
  }

  handleNext(): void {
    if (this.step() < 4) {
      this.step.update(s => s + 1);
    }
  }

  isStepDisabled(stepId: number): boolean {
    if (stepId === 2 && !this.selectedTemplate()) return true;
    if (stepId === 3 && (!this.selectedTemplate() || !this.fileName())) return true;
    if (stepId === 4) {
      if (!this.selectedTemplate() || !this.fileName() || !this.dispatchDate()) return true;
      if (this.isLinkedToCourse() && !this.selectedCourseId()) return true;
      if (!this.isLinkedToCourse() && !this.campaignName().trim()) return true;
      if (Object.values(this.variableValues()).some(v => !v.trim())) return true;
    }
    return false;
  }

  finishPush(): void {
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.view.set('dashboard');
      this.step.set(1);
      this.resetForm();
    }, 1200);
  }

  resetForm(): void {
    this.selectedTemplate.set(null);
    this.variableValues.set({});
    this.dispatchDate.set('');
    this.fileName.set(null);
    this.contacts.set([]);
    this.isLinkedToCourse.set(true);
    this.selectedCourseId.set('');
    this.campaignName.set('');
  }

  formatVariableLabel(key: string): string {
    return key.replace(/_/g, ' ').trim().toUpperCase();
  }

  variablePlaceholder(key: string): string {
    const map: Record<string, string> = {
      workspace_name: 'Nome da workspace',
      nome_do_curso: 'Nome do curso',
      principal_benefício: 'Benefício principal',
    };
    return map[key] ?? 'Digite o valor';
  }

  constructor() {
    if (this.templates.length) {
      this.selectedTemplate.set(this.templates[0]);
    }
  }
}
