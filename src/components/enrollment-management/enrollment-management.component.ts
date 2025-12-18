import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentItem, SmartZapEnrollmentItem } from '../../types';
import {
    MOCK_TRAIL_ENROLLMENTS,
    MOCK_COURSE_ENROLLMENTS,
    MOCK_EVENT_ENROLLMENTS,
    MOCK_SMARTZAP_ENROLLMENTS
} from '../../mock-data';

type EnrollmentTab = 'trilhas' | 'cursos' | 'eventos' | 'smartzap';

@Component({
    selector: 'app-enrollment-management',
    imports: [CommonModule, FormsModule],
    templateUrl: './enrollment-management.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentManagementComponent {
    activeTab = signal<EnrollmentTab>('trilhas');
    searchQuery = signal('');

    // All enrollments organized by type
    allEnrollments = {
        trilhas: MOCK_TRAIL_ENROLLMENTS,
        cursos: MOCK_COURSE_ENROLLMENTS,
        eventos: MOCK_EVENT_ENROLLMENTS,
        smartzap: MOCK_SMARTZAP_ENROLLMENTS
    };

    enrollments = computed(() => this.allEnrollments[this.activeTab()]);

    filteredEnrollments = computed((): (EnrollmentItem | SmartZapEnrollmentItem)[] => {
        const query = this.searchQuery().toLowerCase().trim();
        let currentItems: (EnrollmentItem | SmartZapEnrollmentItem)[] = this.enrollments();

        if (query) {
            currentItems = currentItems.filter(item => {
                if ('name' in item) {
                    return item.name.toLowerCase().includes(query) ||
                        item.user.toLowerCase().includes(query);
                } else if ('course' in item) {
                    return item.user.toLowerCase().includes(query) ||
                        item.course.toLowerCase().includes(query);
                }
                return false;
            });
        }

        return currentItems;
    });

    setActiveTab(tab: EnrollmentTab): void {
        this.activeTab.set(tab);
        this.searchQuery.set('');
    }

    // Pagination
    pageSize = signal(10);
    currentPage = signal(1);
    totalItems = computed(() => this.filteredEnrollments().length);
}
