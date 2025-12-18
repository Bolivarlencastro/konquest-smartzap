import { Component, ChangeDetectionStrategy, output, input, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pulse, QuizQuestion } from '../../types';
import { SimpleTextEditorComponent } from '../simple-text-editor/simple-text-editor.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { QuestionBankModalComponent } from './question-bank-modal.component';

type ActiveTab = 'questions' | 'settings';

@Component({
  selector: 'app-quiz-editor-modal',
  imports: [CommonModule, FormsModule, SimpleTextEditorComponent, TooltipDirective, QuestionBankModalComponent],
  templateUrl: './quiz-editor-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizEditorModalComponent {
  initialPulseData = input.required<Pulse>();
  
  close = output<void>();
  save = output<Pulse>();

  quiz = signal<Pulse>({} as Pulse);
  activeTab = signal<ActiveTab>('questions');
  
  // State for inline editing
  editingQuestionId = signal<string | 'new' | null>(null);
  inlineFormQuestion = signal<QuizQuestion | null>(null);

  // State for drag and drop
  draggedQuestionId = signal<string | null>(null);

  isBankOpen = signal<boolean>(false);

  isEditing = computed(() => !!this.initialPulseData()?.name);
  
  canPublish = computed(() => {
    const q = this.quiz();
    return q.name.trim().length > 0 && (q.questions ?? []).length > 0;
  });
  
  constructor() {
    effect(() => {
        this.quiz.set(JSON.parse(JSON.stringify(this.initialPulseData())));
    });
  }

  updateField(field: keyof Pulse, value: any): void {
    this.quiz.update(p => ({ ...p, [field]: value }));
  }

  updateConfigField(field: keyof Pulse['config'], value: any): void {
    this.quiz.update(p => {
      const newConfig = { ...p.config!, [field]: value };
      return {
        ...p,
        config: newConfig
      };
    });
  }
  
  addQuestion(): void {
    const newQuestion: QuizQuestion = {
      id: `q_new_${Date.now()}`,
      questionText: '',
      imageUrl: null,
      imagePosition: 'before',
      alternatives: ['', ''], // Start with two alternatives
      correctAnswerIndex: 0,
      isInBank: false,
    };
    this.editingQuestionId.set('new');
    this.inlineFormQuestion.set(newQuestion);
  }

  addQuestionsFromBank(selectedQuestions: QuizQuestion[]): void {
    const newQuestions = selectedQuestions.map(q => {
      const newQ = JSON.parse(JSON.stringify(q));
      newQ.id = `q_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      return newQ;
    });

    this.quiz.update(p => ({
      ...p,
      questions: [...(p.questions ?? []), ...newQuestions]
    }));

    this.isBankOpen.set(false);
  }

  editQuestion(question: QuizQuestion): void {
    this.editingQuestionId.set(question.id);
    this.inlineFormQuestion.set(JSON.parse(JSON.stringify(question))); // Edit a deep copy
  }
  
  cancelInlineEdit(): void {
    this.editingQuestionId.set(null);
    this.inlineFormQuestion.set(null);
  }

  saveInlineQuestion(): void {
    const questionToSave = this.inlineFormQuestion();
    if (!questionToSave) return;

    this.quiz.update(p => {
      const questions = p.questions ? [...p.questions] : [];
      
      if (this.editingQuestionId() === 'new') {
        // It's a new question, give it a permanent ID
        questionToSave.id = `q_${Date.now()}`;
        questions.push(questionToSave);
      } else {
        const existingIndex = questions.findIndex(q => q.id === questionToSave.id);
        if (existingIndex > -1) {
          questions[existingIndex] = questionToSave;
        }
      }
      return { ...p, questions };
    });
    
    this.cancelInlineEdit();
  }

  duplicateQuestion(questionId: string): void {
     this.quiz.update(p => {
      const questions = p.questions ? [...p.questions] : [];
      const questionIndex = questions.findIndex(q => q.id === questionId);
      if (questionIndex === -1) return p;

      const original = questions[questionIndex];
      const duplicate: QuizQuestion = {
        ...JSON.parse(JSON.stringify(original)),
        id: `q_${Date.now()}`
      };
      
      questions.splice(questionIndex + 1, 0, duplicate);
      return { ...p, questions };
    });
  }

  deleteQuestion(questionId: string): void {
    this.quiz.update(p => ({
      ...p,
      questions: p.questions?.filter(q => q.id !== questionId)
    }));
  }

  handlePublish(): void {
    const finalQuiz = this.quiz();
    finalQuiz.status = 'published';
    this.save.emit(finalQuiz);
  }

  // --- Inline Form Methods ---
  
  addAlternative(): void {
    this.inlineFormQuestion.update(q => {
      if (!q) return null;
      const newAlts = [...q.alternatives, ''];
      return { ...q, alternatives: newAlts };
    });
  }

  removeAlternative(indexToRemove: number): void {
    this.inlineFormQuestion.update(q => {
      if (!q || q.alternatives.length <= 2) return q;
      const newAlts = q.alternatives.filter((_, index) => index !== indexToRemove);
      
      // Adjust correct answer index if it's out of bounds
      if (q.correctAnswerIndex >= newAlts.length) {
        q.correctAnswerIndex = newAlts.length - 1;
      }

      return { ...q, alternatives: newAlts };
    });
  }
  
  updateQuestionText(newText: string): void {
    this.inlineFormQuestion.update(q => {
      if (!q) return null;
      return { ...q, questionText: newText };
    });
  }

  updateAlternativeText(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.inlineFormQuestion.update(q => {
      if (!q) return null;
      const newAlts = [...q.alternatives];
      newAlts[index] = value;
      return {...q, alternatives: newAlts};
    });
  }

  setCorrectAlternative(index: number): void {
     this.inlineFormQuestion.update(q => {
      if (!q) return null;
      return {...q, correctAnswerIndex: index};
    });
  }

  handleImageFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const MAX_SIZE_MB = 2;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        // In a real app, use a toast notification service instead of alert.
        alert(`O arquivo é muito grande. O tamanho máximo é de ${MAX_SIZE_MB}MB.`);
        input.value = ''; // Reset file input
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 640;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            const ratio = MAX_WIDTH / width;
            width = MAX_WIDTH;
            height = height * ratio;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.drawImage(img, 0, 0, width, height);
          
          const resizedDataUrl = canvas.toDataURL(file.type);

          this.inlineFormQuestion.update(q => {
            if (!q) return null;
            const position = q.imagePosition || 'before';
            return { ...q, imageUrl: resizedDataUrl, imagePosition: position };
          });
        };
        img.onerror = () => {
          alert('Arquivo de imagem inválido.');
          input.value = '';
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  updateImagePosition(position: 'before' | 'after'): void {
    this.inlineFormQuestion.update(q => {
      if (!q) return null;
      return { ...q, imagePosition: position };
    });
  }

  removeImage(): void {
    this.inlineFormQuestion.update(q => {
      if (!q) return null;
      return { ...q, imageUrl: null };
    });
  }

  // --- Drag and Drop Methods ---
  onQuestionDragStart(event: DragEvent, questionId: string): void {
    event.dataTransfer!.effectAllowed = 'move';
    this.draggedQuestionId.set(questionId);
  }

  onQuestionDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onQuestionDrop(event: DragEvent, dropQuestionId: string): void {
    event.preventDefault();
    const draggedId = this.draggedQuestionId();
    if (!draggedId || draggedId === dropQuestionId) return;

    this.quiz.update(p => {
      const questions = [...p.questions!];
      const draggedIndex = questions.findIndex(q => q.id === draggedId);
      const dropIndex = questions.findIndex(q => q.id === dropQuestionId);
      if (draggedIndex === -1 || dropIndex === -1) return p;

      const [draggedItem] = questions.splice(draggedIndex, 1);
      questions.splice(dropIndex, 0, draggedItem);
      
      return { ...p, questions };
    });
    this.draggedQuestionId.set(null);
  }

  onQuestionDragEnd(): void {
    this.draggedQuestionId.set(null);
  }

  // --- Utility ---
  stripHtml(html: string): string {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }
}