import { Component, ChangeDetectionStrategy, signal, inject, ElementRef, viewChild, computed } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

import { CourseWizardComponent } from './components/course-wizard/course-wizard.component';
import { TrailWizardComponent } from './components/trail-wizard/trail-wizard.component';
import { EventWizardComponent } from './components/event-wizard/event-wizard.component';
import { ChannelWizardComponent } from './components/channel-wizard/channel-wizard.component';
import { GroupManagementComponent } from './components/group-management/group-management.component';
import { CreateCourseModalComponent } from './components/modals/create-course-modal.component';
import { AiCreationModalComponent } from './components/modals/ai-creation-modal.component';
import { ImportSourceModalComponent } from './components/modals/import-source-modal.component';
import { FileUploadModalComponent } from './components/modals/file-upload-modal.component';
import { CreateTrailModalComponent } from './components/modals/create-trail-modal.component';
import { AiTrailCreationModalComponent } from './components/modals/ai-trail-creation-modal.component';
import { CreateEventModalComponent } from './components/modals/create-event-modal.component';
import { AiEventCreationModalComponent } from './components/modals/ai-event-creation-modal.component';
import { CreateChannelModalComponent } from './components/modals/create-channel-modal.component';
import { AiChannelCreationModalComponent } from './components/modals/ai-channel-creation-modal.component';
import { CreatePulseModalComponent } from './components/modals/create-pulse-modal.component';
import { PulseEditorModalComponent } from './components/modals/pulse-editor-modal.component';
import { CreateGroupModalComponent } from './components/modals/create-group-modal.component';
import { QuizCreationMethodModalComponent } from './components/modals/quiz-creation-method-modal.component';
import { QuizAiAssistantModalComponent } from './components/modals/quiz-ai-assistant-modal.component';
import { QuizEditorModalComponent } from './components/modals/quiz-editor-modal.component';
import { CoursePlayerComponent } from './components/course-player/course-player.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ContentManagementComponent } from './components/content-management/content-management.component';
import { EnrollmentManagementComponent } from './components/enrollment-management/enrollment-management.component';


import { Course, Trail, Event, Channel, Pulse, PulseType, Group } from './types';
import { MOCK_COURSE_TEMPLATE, EMPTY_COURSE, EMPTY_TRAIL, MOCK_TRAIL_TEMPLATE, EMPTY_EVENT, EMPTY_CHANNEL, EMPTY_PULSE } from './mock-data';

type ViewState = 'dashboard' | 'createCourseModal' | 'aiCreationModal' | 'importSourceModal' | 'fileUploadModal' | 'courseWizard' | 'trailWizard' | 'createTrailModal' | 'aiTrailCreationModal' | 'eventWizard' | 'createEventModal' | 'aiEventCreationModal' | 'channelWizard' | 'createChannelModal' | 'aiChannelCreationModal' | 'createPulseModal' | 'pulseEditorModal' | 'groupManagement' | 'createGroupModal' | 'quizCreationMethod' | 'quizAiAssistant' | 'quizEditor' | 'coursePlayer' | 'settings' | 'contentManagement' | 'enrollmentManagement';
type ActiveTab = 'destaques' | 'trilhas' | 'cursos' | 'eventos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CourseWizardComponent,
    TrailWizardComponent,
    EventWizardComponent,
    ChannelWizardComponent,
    GroupManagementComponent,
    CreateCourseModalComponent,
    AiCreationModalComponent,
    ImportSourceModalComponent,
    FileUploadModalComponent,
    CreateTrailModalComponent,
    AiTrailCreationModalComponent,
    CreateEventModalComponent,
    AiEventCreationModalComponent,
    CreateChannelModalComponent,
    AiChannelCreationModalComponent,
    CreatePulseModalComponent,
    PulseEditorModalComponent,
    CreateGroupModalComponent,
    QuizCreationMethodModalComponent,
    QuizAiAssistantModalComponent,
    QuizEditorModalComponent,
    CoursePlayerComponent,
    CoursePlayerComponent,
    SettingsComponent,
    ContentManagementComponent,
    EnrollmentManagementComponent
  ],
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);

  viewState = signal<ViewState>('dashboard');
  courseData = signal<Course | null>(null);
  trailData = signal<Trail | null>(null);
  eventData = signal<Event | null>(null);
  channelData = signal<Channel | null>(null);
  pulseData = signal<Pulse | null>(null);
  pulseTypeForEditor = signal<PulseType | null>(null);
  wizardStartStep = signal<number>(1);

  importSource = signal<'scorm' | 'csv' | null>(null);
  showCreateMenu = signal<boolean>(false);
  showUserMenu = signal<boolean>(false);
  isFullScreen = signal<boolean>(!!this.document.fullscreenElement);
  shouldOpenGroupCreateModal = signal<boolean>(false);

  private _isAdminMenuOpen = signal<boolean>(false);
  isAdminMenuOpen = computed(() => this._isAdminMenuOpen());

  isMatriculasAccordionOpen = signal<boolean>(true);

  courseCarousel = viewChild<ElementRef<HTMLDivElement>>('courseCarousel');

  tabs = [
    { id: 'destaques' as ActiveTab, name: 'Destaques', icon: 'star' },
    { id: 'trilhas' as ActiveTab, name: 'Trilhas', icon: 'timeline' },
    { id: 'cursos' as ActiveTab, name: 'Cursos', icon: 'rocket_launch' },
    { id: 'eventos' as ActiveTab, name: 'Eventos', icon: 'calendar_today' },
  ];
  activeTab = signal<ActiveTab>('destaques');

  isFullScreenView = computed(() => [
    'courseWizard', 'trailWizard', 'eventWizard',
    'channelWizard', 'coursePlayer'
  ].includes(this.viewState())
  );

  constructor() {
    this.document.addEventListener('fullscreenchange', () => {
      this.isFullScreen.set(!!this.document.fullscreenElement);
    });
  }

  setActiveTab(tabId: ActiveTab): void {
    this.activeTab.set(tabId);
  }

  toggleFullScreen(): void {
    if (!this.document.fullscreenElement) {
      this.document.documentElement.requestFullscreen();
    } else if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    }
  }

  scrollCarousel(direction: 'left' | 'right'): void {
    const carousel = this.courseCarousel()?.nativeElement;
    if (carousel) {
      // Scroll by 90% of the visible width to ensure a smooth, multi-card scroll
      const scrollAmount = carousel.clientWidth * 0.9;
      carousel.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  toggleCreateMenu(): void {
    this.showCreateMenu.update(v => !v);
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  toggleAdminMenu(): void {
    this._isAdminMenuOpen.update(v => !v);
  }

  toggleMatriculasAccordion(): void {
    this.isMatriculasAccordionOpen.update(v => !v);
  }

  handleSettings(): void {
    this.viewState.set('settings');
    this.showUserMenu.set(false);
  }

  handleSwitchWorkspace(): void {
    console.log('Switch workspace clicked');
    this.showUserMenu.set(false);
  }

  handleLogout(): void {
    console.log('Logout clicked');
    this.showUserMenu.set(false);
  }

  // --- Start Creation Flows ---
  startCreationFlow(): void {
    this.showCreateMenu.set(false);
    this.viewState.set('createCourseModal');
  }

  startTrailCreationFlow(): void {
    this.showCreateMenu.set(false);
    this.viewState.set('createTrailModal');
  }

  startEventCreationFlow(): void {
    this.showCreateMenu.set(false);
    this.viewState.set('createEventModal');
  }

  startChannelCreationFlow(): void {
    this.showCreateMenu.set(false);
    this.viewState.set('createChannelModal');
  }

  startPulseCreationFlow(): void {
    this.showCreateMenu.set(false);
    this.viewState.set('createPulseModal');
  }

  startGroupCreationFlow(): void {
    this.showCreateMenu.set(false);
    this.viewState.set('createGroupModal');
  }

  startSmartZapCreationFlow(): void {
    this.showCreateMenu.set(false);
    // TODO: Implement SmartZap creation flow
    console.log('SmartZap creation flow started');
  }

  handleGroupCreated(group: Group): void {
    console.log('Group created:', group);
    // In a real app, you would now send this data to a server.
    // For now, just close the modal.
    this.closeModals();
  }

  navigateToGroups(): void {
    this.showCreateMenu.set(false);
    this.shouldOpenGroupCreateModal.set(false);
    this.viewState.set('groupManagement');
  }

  navigateToDashboard(): void {
    this.viewState.set('dashboard');
  }

  navigateToContentManagement(): void {
    this.viewState.set('contentManagement');
    this._isAdminMenuOpen.set(false);
  }

  navigateToEnrollmentManagement(): void {
    this.viewState.set('enrollmentManagement');
    this._isAdminMenuOpen.set(false);
  }

  navigateToSettings(): void {
    this.viewState.set('settings');
    this._isAdminMenuOpen.set(false);
  }

  // --- Course Handlers ---
  handleStartFromScratch(): void {
    this.courseData.set(JSON.parse(JSON.stringify(EMPTY_COURSE))); // Deep copy
    this.wizardStartStep.set(1);
    this.viewState.set('courseWizard');
  }

  handleUseAi(): void {
    this.viewState.set('aiCreationModal');
  }

  handleImportFile(): void {
    this.viewState.set('importSourceModal');
  }

  handleAiCourseGenerated(course: Course): void {
    this.courseData.set(course);
    this.wizardStartStep.set(1);
    this.viewState.set('courseWizard');
  }

  // --- Trail Handlers ---
  handleStartTrailFromScratch(): void {
    this.trailData.set(JSON.parse(JSON.stringify(EMPTY_TRAIL))); // Deep copy
    this.viewState.set('trailWizard');
  }

  handleUseAiForTrail(): void {
    this.viewState.set('aiTrailCreationModal');
  }

  handleAiTrailGenerated(trail: Trail): void {
    this.trailData.set(trail);
    this.viewState.set('trailWizard');
  }

  // --- Event Handlers ---
  handleStartEventFromScratch(): void {
    this.eventData.set(JSON.parse(JSON.stringify(EMPTY_EVENT))); // Deep copy
    this.viewState.set('eventWizard');
  }

  handleUseAiForEvent(): void {
    this.viewState.set('aiEventCreationModal');
  }

  handleAiEventGenerated(event: Event): void {
    this.eventData.set(event);
    this.viewState.set('eventWizard');
  }

  // --- Channel Handlers ---
  handleStartChannelFromScratch(): void {
    this.channelData.set(JSON.parse(JSON.stringify(EMPTY_CHANNEL))); // Deep copy
    this.viewState.set('channelWizard');
  }

  handleUseAiForChannel(): void {
    this.viewState.set('aiChannelCreationModal');
  }

  handleAiChannelGenerated(channel: Channel): void {
    this.channelData.set(channel);
    this.viewState.set('channelWizard');
  }

  // --- Pulse Handlers ---
  handlePulseTypeSelected(type: PulseType): void {
    if (type === 'quiz') {
      this.viewState.set('quizCreationMethod');
    } else {
      const newPulse = { ...JSON.parse(JSON.stringify(EMPTY_PULSE)), type };
      this.pulseData.set(newPulse);
      this.pulseTypeForEditor.set(type);
      this.viewState.set('pulseEditorModal');
    }
  }

  handlePulseSaved(pulse: Pulse): void {
    console.log('Pulse saved:', pulse);
    // In a real app, you would now send this data to a server.
    // For now, just close the editor.
    this.pulseData.set(null);
    this.pulseTypeForEditor.set(null);
    this.viewState.set('dashboard');
  }

  handleQuizCreationMethodSelected(method: 'manual' | 'ai'): void {
    if (method === 'manual') {
      const newPulse: Pulse = {
        ...JSON.parse(JSON.stringify(EMPTY_PULSE)),
        type: 'quiz',
        name: 'Novo Quiz', // Default name
      };
      this.pulseData.set(newPulse);
      this.viewState.set('quizEditor');
    } else {
      this.viewState.set('quizAiAssistant');
    }
  }

  handleAiQuizGenerated(quiz: Pulse): void {
    this.pulseData.set(quiz);
    this.viewState.set('quizEditor');
  }

  handleQuizSaved(quiz: Pulse): void {
    console.log('Quiz saved:', quiz);
    // In a real app, send to server
    this.pulseData.set(null);
    this.viewState.set('dashboard');
  }

  // --- Import Handlers ---
  handleImportSourceSelected(source: 'scorm' | 'csv'): void {
    this.importSource.set(source);
    this.viewState.set('fileUploadModal');
  }

  handleFileImported(data: { workload: string }): void {
    const source = this.importSource();
    if (!source) return;

    const importedCourse: Course = {
      ...JSON.parse(JSON.stringify(MOCK_COURSE_TEMPLATE)),
      name: `Curso Importado de ${source.toUpperCase()}`,
      internalCode: `IMPORT-${Date.now()}`,
      workload: data.workload,
    };
    this.courseData.set(importedCourse);
    this.wizardStartStep.set(1);
    this.viewState.set('courseWizard');
  }

  handleGoBack(from: 'aiCourse' | 'importSource' | 'fileUpload' | 'aiTrail' | 'aiEvent' | 'aiChannel' | 'aiQuiz'): void {
    switch (from) {
      case 'fileUpload':
        this.viewState.set('importSourceModal');
        break;
      case 'aiCourse':
      case 'importSource':
        this.viewState.set('createCourseModal');
        break;
      case 'aiTrail':
        this.viewState.set('createTrailModal');
        break;
      case 'aiEvent':
        this.viewState.set('createEventModal');
        break;
      case 'aiChannel':
        this.viewState.set('createChannelModal');
        break;
      case 'aiQuiz':
        this.viewState.set('quizCreationMethod');
        break;
    }
  }

  closeModals(): void {
    this.viewState.set('dashboard');
  }

  // --- Exit Wizards ---
  exitWizard(): void {
    this.courseData.set(null);
    this.viewState.set('dashboard');
    this.wizardStartStep.set(1);
  }

  exitTrailWizard(): void {
    this.trailData.set(null);
    this.viewState.set('dashboard');
  }

  exitEventWizard(): void {
    this.eventData.set(null);
    this.viewState.set('dashboard');
  }

  exitChannelWizard(): void {
    this.channelData.set(null);
    this.viewState.set('dashboard');
  }

  handleCoursePreview(course: Course): void {
    this.courseData.set(course);
    this.viewState.set('coursePlayer');
  }

  exitCoursePlayer(): void {
    this.wizardStartStep.set(4);
    this.viewState.set('courseWizard');
  }
}
