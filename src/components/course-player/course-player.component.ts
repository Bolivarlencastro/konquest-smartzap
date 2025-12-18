import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Course, ContentItem, Topic } from '../../types';
import { QuizPlayerComponent } from '../quiz-player/quiz-player.component';

@Component({
  selector: 'app-course-player',
  imports: [CommonModule, QuizPlayerComponent],
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursePlayerComponent {
  course = input.required<Course>();
  isFullScreen = input<boolean>(false);
  
  exit = output<void>();
  toggleFullScreen = output<void>();

  // UI state
  isIndexCollapsed = signal(false);
  isEntireSidebarCollapsed = signal(false);
  showExitConfirmModal = signal(false);

  // Content state
  allContentItems = computed<ContentItem[]>(() =>
    this.course().topics.flatMap(topic => topic.contents)
  );
  activeContentIndex = signal(0);
  
  activeContent = computed<ContentItem | null>(() => {
    const all = this.allContentItems();
    if (all.length > 0) {
      return all[this.activeContentIndex()] ?? null;
    }
    return null;
  });

  activeTopicId = computed<string | null>(() => {
    const content = this.activeContent();
    if (!content) return null;
    return this.course().topics.find(t => t.contents.some(c => c.id === content.id))?.id ?? null;
  });

  activeTopicIndex = computed<number>(() => {
    const topicId = this.activeTopicId();
    if (!topicId) return -1;
    return this.course().topics.findIndex(t => t.id === topicId);
  });

  activeContentIndexInTopic = computed<number>(() => {
    const topicId = this.activeTopicId();
    const contentId = this.activeContent()?.id;
    if (!topicId || !contentId) return -1;
    const topic = this.course().topics.find(t => t.id === topicId);
    if (!topic) return -1;
    return topic.contents.findIndex(c => c.id === contentId);
  });
  
  expandedTopics = signal<Set<string>>(new Set());
  
  private sanitizer = inject(DomSanitizer);
  
  safeVideoUrl = computed<SafeResourceUrl | null>(() => {
    const content = this.activeContent();
    if (content?.type === 'video' && content.source && content.source.includes('youtube.com/watch?v=')) {
      const videoId = content.source.split('v=')[1]?.split('&')[0];
      if (videoId) {
        const url = `https://www.youtube.com/embed/${videoId}`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    }
    return null;
  });

  constructor() {
    // Effect to expand the topic of the active content
    effect(() => {
      const topicId = this.activeTopicId();
      if (topicId) {
        this.expandedTopics.update(set => {
          set.add(topicId);
          return new Set(set);
        });
      }
    });

    // Initialize with first content item
     effect(() => {
      const course = this.course();
      if (course?.topics?.[0]?.contents?.[0]) {
        this.selectContent(course.topics[0].contents[0]);
      }
    }, { allowSignalWrites: true });
  }

  toggleIndex(): void {
    this.isIndexCollapsed.update(v => !v);
  }

  toggleEntireSidebar(): void {
    this.isEntireSidebarCollapsed.update(v => !v);
  }

  isTopicExpanded(topicId: string): boolean {
    return this.expandedTopics().has(topicId);
  }

  toggleTopicExpansion(topicId: string): void {
    this.expandedTopics.update(set => {
      if (set.has(topicId)) {
        set.delete(topicId);
      } else {
        set.add(topicId);
      }
      return new Set(set);
    });
  }

  selectContent(content: ContentItem) {
    const index = this.allContentItems().findIndex(c => c.id === content.id);
    if (index !== -1) {
      this.activeContentIndex.set(index);
    }
  }

  nextContent(): void {
    if (this.activeContentIndex() < this.allContentItems().length - 1) {
      this.activeContentIndex.update(i => i + 1);
    }
  }

  prevContent(): void {
    if (this.activeContentIndex() > 0) {
      this.activeContentIndex.update(i => i - 1);
    }
  }
  
  confirmExit() {
    this.showExitConfirmModal.set(false);
    this.exit.emit();
  }
  
  cancelExit() {
    this.showExitConfirmModal.set(false);
  }
  
  getContentIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      video: 'smart_display',
      audio: 'volume_up',
      image: 'image',
      document: 'article',
      web: 'link',
      scorm: 'extension',
      quiz: 'quiz',
    };
    return iconMap[type] || 'help_outline';
  }
}
