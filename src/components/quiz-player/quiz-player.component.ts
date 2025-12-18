import { Component, ChangeDetectionStrategy, input, output, signal, computed, Pipe, PipeTransform, inject, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pulse, QuizQuestion } from '../../types';

@Pipe({ name: 'safeHtml', standalone: true })
export class SafeHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  transform(value: string): SafeHtml {
    // Sanitize the value to prevent XSS attacks, but still allow safe HTML
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

type QuizState = 'intro' | 'playing' | 'finished';

interface Answer {
  questionId: string;
  selectedAlternativeIndex: number;
  isCorrect: boolean;
}

@Component({
  selector: 'app-quiz-player',
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './quiz-player.component.html',
  styleUrls: ['./quiz-player.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizPlayerComponent {
  quizData = input.required<Pulse>();
  isInlinePlayer = input<boolean>(false);

  quizCompleted = output<void>();
  exitPreview = output<void>(); // This is still used by the wizard preview

  questions = computed(() => this.quizData().questions ?? []);
  answers = signal<Answer[]>([]);
  quizState = signal<QuizState>('intro');
  currentQuestionIndex = signal(0);
  
  // For single question view
  selectedAnswerIndex = signal<number | null>(null);
  isReviewing = signal(false);

  // Computed state
  currentQuestion = computed<QuizQuestion | null>(() => {
    const qs = this.questions();
    if (qs.length > 0) {
        return qs[this.currentQuestionIndex()] ?? null;
    }
    return null;
  });

  progress = computed(() => {
    const total = this.questions().length;
    if (total === 0) return 0;
    // Progress is based on confirmed answers for immediate feedback mode, or current index otherwise
    if (this.quizData().config?.showImmediateFeedback) {
        return (this.answers().length / total) * 100;
    }
    return (this.currentQuestionIndex() / total) * 100;
  });
  
  score = signal(0);
  correctAnswers = signal(0);

  startQuiz(): void {
    this.currentQuestionIndex.set(0);
    this.answers.set([]);
    this.quizState.set('playing');
    this.resetQuestionState();
  }

  selectAnswer(index: number): void {
    if (this.isReviewing()) return;
    this.selectedAnswerIndex.set(index);
  }

  confirmAnswer(): void {
    const question = this.currentQuestion();
    const selectedIndex = this.selectedAnswerIndex();
    if (question === null || selectedIndex === null) return;

    const isCorrect = selectedIndex === question.correctAnswerIndex;
    this.answers.update(a => [...a, {
      questionId: question.id,
      selectedAlternativeIndex: selectedIndex,
      isCorrect: isCorrect
    }]);

    if (this.quizData().config?.showImmediateFeedback) {
        this.isReviewing.set(true);
    } else {
        this.nextQuestion();
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
      this.resetQuestionState();
    } else {
      this.finishQuiz();
    }
  }

  next(): void {
    if (this.isInlinePlayer()) {
      this.quizCompleted.emit();
    } else {
      this.exitPreview.emit();
    }
  }

  finishQuiz(): void {
    const correctCount = this.answers().filter(a => a.isCorrect).length;
    this.correctAnswers.set(correctCount);
    const totalQuestions = this.questions().length;
    this.score.set(totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0);
    this.quizState.set('finished');
  }
  
  private resetQuestionState(): void {
    this.selectedAnswerIndex.set(null);
    this.isReviewing.set(false);
  }

  getAlternativeLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }
  
  getAlternativeClass(question: QuizQuestion, index: number): string {
    const isSelected = index === this.selectedAnswerIndex();

    // While reviewing the answer
    if (this.isReviewing()) {
      const isCorrect = index === question.correctAnswerIndex;
      if (isCorrect) {
        return 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      }
      if (isSelected && !isCorrect) {
        return 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      }
      return 'border-gray-300 dark:border-gray-600 opacity-70';
    }

    // While selecting an answer
    if (isSelected) {
      return 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30';
    }

    // Default state
    return 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20';
  }
}
