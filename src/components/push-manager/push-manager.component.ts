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
      id: 'temp_eng_1',
      name: 'Engajamento – Reativação simples',
      content:
        '👋 Oi!! Notamos que o curso {{nome_do_curso}} está disponível para você, mas ainda não foi iniciado.\n\nQue tal reservar alguns minutos hoje e dar o primeiro passo?',
      buttons: ['Iniciar curso', 'Ver outras sugestões'],
    },
    {
      id: 'temp_ind_1',
      name: 'Indicação – 3 cursos (escolha)',
      content:
        '👋 Oiee, selecionamos cursos que combinam com seu perfil 👇\n\n1️⃣ {{curso_1}}\n\n2️⃣ {{curso_2}}\n\n3️⃣ {{curso_3}}\n\nEscolha por onde quer começar ou explore o portal completo.',
      buttons: ['Matricular em um curso', 'Ver todas as opções'],
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
}
