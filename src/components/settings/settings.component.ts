import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ToggleItem = { id: string; label: string; enabled: boolean; description?: string };
type PurchaseForm = {
  credits: number;
  ddd: string;
  pricePerCredit: number;
};

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  exit = output<void>();

  moduleToggles = signal<ToggleItem[]>([
    { id: 'smartsap', label: 'SmartSap', enabled: false },
    { id: 'dashboard', label: 'Dashboard', enabled: true },
    { id: 'trilhas', label: 'Trilhas', enabled: true },
    { id: 'cursos', label: 'Cursos', enabled: true },
    { id: 'eventos', label: 'Eventos', enabled: true },
    { id: 'pulses', label: 'Pulses', enabled: true },
    { id: 'normativas', label: 'Normativas', enabled: true },
    { id: 'secoes', label: 'Seções Personalizadas', enabled: true },
    { id: 'gamificacao', label: 'Gamificação', enabled: false },
  ]);

  otherConfigs = signal<ToggleItem[]>([
    { id: 'categorias', label: 'Categorias Padrão', enabled: true },
    {
      id: 'bloqueioRematricula',
      label: 'Bloqueio de Rematrícula',
      enabled: false,
      description: 'Ative esta opção para impedir que usuários se matriculem mais de uma vez na mesma trilha ou curso. Este bloqueio impede novas rematrículas, mas não afeta matrículas existentes realizadas antes da ativação desta função. As rematrículas anteriores continuarão válidas e não serão excluídas automaticamente.'
    },
  ]);

  contentVisibility = signal<ToggleItem[]>([
    { id: 'matriculada', label: 'Matriculada', enabled: false },
    { id: 'iniciada', label: 'Iniciada', enabled: false },
    { id: 'finalizada', label: 'Finalizada', enabled: true },
    { id: 'desistiu', label: 'Desistiu', enabled: false },
    { id: 'reprovada', label: 'Reprovada', enabled: false },
    { id: 'expirada', label: 'Expirada', enabled: true },
    { id: 'inativa', label: 'Inativa', enabled: false },
    { id: 'reqNovoPrazo', label: 'Req. novo prazo', enabled: false },
    { id: 'agAprovacao', label: 'Ag. Aprovação', enabled: false },
  ]);

  performanceMinimum = signal<number>(0);
  performanceError = signal<string | null>(null);
  goalDays = signal<number>(15);
  smartsapBilling = signal({ billingCycle: 'Dez/2024', creditsAvailable: 1200, creditsUsed: 340 });
  statementOpen = signal<boolean>(false);
  statementSummary = signal({
    accumulated: 1200,
    monthlyPlan: 800,
    cycleStart: '01/12/2025',
    cycleEnd: '31/12/2025'
  });
  statementHistory = signal<
    { cycle: string; used: number; balance: number; credit: number }[]
  >([
    { cycle: '01/11/2025 - 30/11/2025', used: 200, balance: 400, credit: 600 },
    { cycle: '01/10/2025 - 31/10/2025', used: 180, balance: 220, credit: 400 },
  ]);
  purchaseOpen = signal<boolean>(false);
  purchaseForm = signal<PurchaseForm>({
    credits: 5000,
    ddd: '11',
    pricePerCredit: 0.08,
  });
  checkoutOpen = signal<boolean>(false);
  billing = signal({
    name: 'Super Admin',
    company: 'Keeps',
    address: 'Rua Exemplo, 123 - São Paulo - SP - Brasil',
    taxId: '***.876.758/0001-**',
    cardMasked: '**** **** **** 1234',
    cardBrand: 'Mastercard',
    cardExpiry: '10/2028',
  });
  paymentMethod = signal<'card' | 'boleto'>('card');
  cardForm = signal({ cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '' });
  boletoForm = signal({ email: 'financeiro@empresa.com' });

  toNumber(value: unknown): number {
    return typeof value === 'number' ? value : Number(value);
  }

  toggleModule(id: string): void {
    this.moduleToggles.update(items =>
      items.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item)
    );
  }

  toggleOther(id: string): void {
    this.otherConfigs.update(items =>
      items.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item)
    );
  }

  toggleContent(id: string): void {
    this.contentVisibility.update(items =>
      items.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item)
    );
  }

  savePerformance(): void {
    const value = this.performanceMinimum();
    if (value < 0 || value > 100) {
      this.performanceError.set('Informe um valor entre 0% e 100%.');
      return;
    }
    this.performanceError.set(null);
    // Persisting to an API would happen here.
  }

  saveGoal(): void {
    // Placeholder for persistence if needed.
  }

  buyMoreCredits(): void {
    this.purchaseOpen.set(true);
  }

  viewStatement(): void {
    this.statementOpen.set(true);
  }

  closeStatement(): void {
    this.statementOpen.set(false);
  }

  closePurchase(): void {
    this.purchaseOpen.set(false);
  }

  updatePurchase<K extends keyof PurchaseForm>(key: K, value: PurchaseForm[K]): void {
    this.purchaseForm.update(form => ({ ...form, [key]: value }));
  }

  purchaseCredits(): number {
    return Math.max(0, Math.round(this.purchaseForm().credits));
  }

  purchaseTotal(): number {
    const form = this.purchaseForm();
    return +(this.purchaseCredits() * form.pricePerCredit).toFixed(2);
  }

  proceedToCheckout(): void {
    this.purchaseOpen.set(false);
    this.checkoutOpen.set(true);
  }

  closeCheckout(): void {
    this.checkoutOpen.set(false);
  }

  setPaymentMethod(method: 'card' | 'boleto'): void {
    this.paymentMethod.set(method);
  }

  updateCard<K extends keyof ReturnType<typeof this.cardForm>>(key: K, value: ReturnType<typeof this.cardForm>[K]): void {
    this.cardForm.update(card => ({ ...card, [key]: value }));
  }

  updateBoleto<K extends keyof ReturnType<typeof this.boletoForm>>(key: K, value: ReturnType<typeof this.boletoForm>[K]): void {
    this.boletoForm.update(boleto => ({ ...boleto, [key]: value }));
  }

  finalizeCheckout(): void {
    // Placeholder for payment submission.
    this.checkoutOpen.set(false);
  }
}
