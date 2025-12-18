import { Component, ChangeDetectionStrategy, output, input, signal, viewChild, ElementRef, effect, computed, inject, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenAI } from '@google/genai';
import { LayoutTemplate } from '../../types';
import { MOCK_LAYOUT_TEMPLATES } from '../../mock-data';

export type UploadSource = 'computer' | 'pexels' | 'freepik' | 'ai';

@Component({
  selector: 'app-image-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-upload-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadModalComponent {
  private renderer = inject(Renderer2);

  // Inputs & Outputs
  imageType = input.required<'banner' | 'card'>();
  isContentLoaded = input<boolean>(false);
  initialSource = input<UploadSource | null>(null);
  courseContext = input<{ title: string; description: string } | null>(null);
  triggerAutoGeneration = input<boolean>(false);
  initialAiState = input<{ prompt: string; images: string[]; lastUsedPrompt: string | null } | null>(null);
  
  close = output<void>();
  imageSelected = output<string>();
  aiStateOnClose = output<{ prompt: string; images: string[]; lastUsedPrompt: string | null }>();

  // State
  activeSource = signal<UploadSource>('computer');
  isLoading = signal(false);
  
  // AI State
  aiPrompt = signal('');
  aiReferenceImage = signal<{ base64: string; mimeType: string } | null>(null);
  generatedImages = signal<string[]>([]);
  lastUsedPrompt = signal<string | null>(null);
  generationError = signal<string | null>(null);
  showAiOptions = signal(false);
  
  isRegenerate = computed(() => {
    const currentPrompt = this.aiPrompt().trim();
    const lastPrompt = this.lastUsedPrompt();
    return lastPrompt !== null && currentPrompt === lastPrompt && this.generatedImages().length > 0;
  });

  // Template ref for file input
  refImageInput = viewChild<ElementRef<HTMLInputElement>>('refImageInput');
  refTextInput = viewChild<ElementRef<HTMLInputElement>>('refTextInput');

  // Image Bank State
  bankSearchTerm = signal('');
  bankImages = signal<string[]>([]);

  // Computer upload state
  draggingOver = signal(false);

  constructor() {
    effect(() => {
        const source = this.initialSource();
        if (source) {
            this.selectSource(source);
        }
    });

    effect(() => {
        if (this.triggerAutoGeneration() && this.activeSource() === 'ai' && this.courseContext()) {
          const context = this.courseContext()!;
          const prompt = `Crie uma imagem de capa impactante e profissional para um curso online. O título do curso é "${context.title}". A descrição é: "${context.description}". A imagem deve ser visualmente atraente, relevante para o tema e adequada para um ambiente corporativo ou educacional. Evite texto na imagem.`;
          this.aiPrompt.set(prompt);
          setTimeout(() => this.generateImage(), 100);
        }
    }, { allowSignalWrites: true });
    
    effect(() => {
      const state = this.initialAiState();
      if (state) {
        this.aiPrompt.set(state.prompt);
        this.generatedImages.set(state.images);
        this.lastUsedPrompt.set(state.lastUsedPrompt);
      }
    }, { allowSignalWrites: true });
  }

  selectSource(source: UploadSource) {
    this.activeSource.set(source);
    if (source === 'pexels' || source === 'freepik') {
      this.bankImages.set([]); 
      this.bankSearchTerm.set(''); 
      this.loadBankImages('abstract', source); 
    }
  }

  // --- Computer Upload Methods ---
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingOver.set(false);
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingOver.set(false);
    if (event.dataTransfer?.files[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  private processFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageSelected.emit(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  // --- Image Bank Methods ---
  loadBankImages(term: string = 'abstract', source: 'pexels' | 'freepik'): void {
    this.isLoading.set(true);
    setTimeout(() => {
      const images: string[] = [];
      for(let i = 0; i < 12; i++) {
        const seed = Math.floor(Math.random() * 1000);
        images.push(`https://picsum.photos/seed/${source}-${term}${seed}/400/300`);
      }
      this.bankImages.set(images);
      this.isLoading.set(false);
    }, 500);
  }
  
  searchBank(): void {
    const source = this.activeSource();
    if(source === 'pexels' || source === 'freepik') {
        this.loadBankImages(this.bankSearchTerm() || 'abstract', source);
    }
  }
  
  selectBankImage(url: string): void {
     this.imageSelected.emit(url);
  }

  // --- AI Generation Methods ---
  toggleAiOptions(): void {
    this.showAiOptions.update(v => !v);
  }

  useContentPrompt(): void {
    const context = this.courseContext();
    if (context) {
      const prompt = `Crie uma imagem de capa impactante e profissional para um curso online. O título do curso é "${context.title}". A descrição é: "${context.description}". A imagem deve ser visualmente atraente, relevante para o tema e adequada para um ambiente corporativo ou educacional. Evite texto na imagem.`;
      this.aiPrompt.set(prompt);
    }
    this.showAiOptions.set(false);
  }

  private emitAiState(): void {
     this.aiStateOnClose.emit({
        prompt: this.aiPrompt(),
        images: this.generatedImages(),
        lastUsedPrompt: this.lastUsedPrompt()
    });
  }

  handleClose(): void {
    this.emitAiState();
    this.close.emit();
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.generateImage();
    }
  }

  onReferenceImageSelected(event: Event): void {
    this.showAiOptions.set(false);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const [header, base64] = result.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1];
        if (base64 && mimeType) {
          this.aiReferenceImage.set({ base64, mimeType });
        }
      };
      reader.readAsDataURL(file);
    }
    if (input) {
      input.value = '';
    }
  }

  onReferenceTextSelected(event: Event): void {
    this.showAiOptions.set(false);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const textContent = e.target?.result as string;
          this.aiPrompt.update(p => p ? `${p}\n\n${textContent}` : textContent);
        };
        reader.readAsText(file);
      } else {
        alert('Por favor, selecione um arquivo de texto (.txt).');
      }
    }
    if (input) {
      input.value = '';
    }
  }

  removeReferenceImage(): void {
    this.aiReferenceImage.set(null);
  }

  selectGeneratedImage(imageUrl: string): void {
    this.emitAiState();
    this.imageSelected.emit(imageUrl);
  }

  async generateImage(): Promise<void> {
    const promptText = this.aiPrompt().trim();
    if (!promptText || this.isLoading()) return;

    this.isLoading.set(true);
    this.generationError.set(null);
    this.generatedImages.set([]);

    try {
      if (!process.env.API_KEY) {
        throw new Error("A chave de API do Google AI não foi configurada.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const response = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt: promptText,
          config: {
            numberOfImages: 2,
            outputMimeType: 'image/jpeg',
            aspectRatio: this.imageType() === 'card' ? '9:16' : '16:9',
          },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const imageUrls = response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
        this.generatedImages.set(imageUrls);
        this.lastUsedPrompt.set(promptText);
      } else {
        throw new Error('Nenhuma imagem foi gerada. Tente um prompt diferente.');
      }

    } catch (error) {
      console.error('Error generating image:', error);
      this.generationError.set('Ocorreu um erro ao gerar as imagens. Verifique sua chave de API e tente novamente.');
      this.lastUsedPrompt.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }
}
