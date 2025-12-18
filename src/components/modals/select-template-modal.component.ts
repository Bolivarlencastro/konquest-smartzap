import { Component, ChangeDetectionStrategy, input, output, signal, viewChild, ElementRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type FrameStyle = 'none' | 'wave' | 'swoosh' | 'angle';

@Component({
  selector: 'app-select-template-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-template-modal.component.html',
  styleUrls: ['./select-template-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTemplateModalComponent {
  imageToFrame = input.required<string>();
  imageType = input.required<'banner' | 'card'>();
  
  close = output<void>();
  back = output<void>();
  frameApplied = output<string>();

  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('generationCanvas');

  isLoading = signal(false);

  // Hardcoded primary color as requested
  primaryColor = '#8066a7';

  frames = [
    { id: 'none' as FrameStyle, name: 'Sem Moldura' },
    { id: 'wave' as FrameStyle, name: 'Onda' },
    { id: 'swoosh' as FrameStyle, name: 'Arco' },
    { id: 'angle' as FrameStyle, name: 'Ângulo' },
  ];
  selectedFrame = signal<FrameStyle>('none');

  selectFrame(frame: FrameStyle) {
    this.selectedFrame.set(frame);
  }

  async applyFrame(): Promise<void> {
    this.isLoading.set(true);
    await new Promise(resolve => setTimeout(resolve, 50));

    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      this.isLoading.set(false);
      return;
    }

    const baseImg = new Image();
    baseImg.crossOrigin = 'anonymous';

    baseImg.onload = () => {
      canvas.width = baseImg.naturalWidth;
      canvas.height = baseImg.naturalHeight;
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
      
      const frameStyle = this.selectedFrame();

      if (frameStyle !== 'none') {
        ctx.fillStyle = this.primaryColor;
        const w = canvas.width;
        const h = canvas.height;

        ctx.beginPath();
        switch (frameStyle) {
          case 'wave':
            ctx.moveTo(0, h * 0.75);
            ctx.bezierCurveTo(w * 0.33, h * 0.65, w * 0.67, h * 0.85, w, h * 0.75);
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            break;
          case 'swoosh':
            ctx.moveTo(0, h * 0.7);
            ctx.quadraticCurveTo(w / 2, h, w, h * 0.7);
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            break;
          case 'angle':
            ctx.moveTo(0, h * 0.7);
            ctx.lineTo(w, h * 0.85);
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            break;
        }
        ctx.closePath();
        ctx.fill();
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      this.frameApplied.emit(dataUrl);
      this.isLoading.set(false);
    };
    baseImg.onerror = () => {
      console.error('Failed to load base image for framing.');
      alert('Houve um erro ao carregar a imagem recortada.');
      this.isLoading.set(false);
    };
    baseImg.src = this.imageToFrame();
  }
}