import { Component, ChangeDetectionStrategy, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentManagementItem, TrailContentItem, EventContentItem, SmartZapItem } from '../../types';
import { MOCK_CONTENT_ITEMS, MOCK_TRAIL_ITEMS, MOCK_EVENT_ITEMS, MOCK_SMARTZAP_ITEMS } from '../../mock-data';

type ContentFilter = 'meus' | 'favoritos' | 'idioma' | 'status' | 'categoria' | 'provedor' | null;
type ContentTab = 'cursos' | 'trilhas' | 'eventos' | 'smartzap';

@Component({
    selector: 'app-content-management',
    imports: [CommonModule, FormsModule],
    templateUrl: './content-management.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentManagementComponent {
    activeTab = signal<ContentTab>('cursos');
    searchQuery = signal('');
    activeFilter = signal<ContentFilter>(null);

    // All items organized by type
    allItems = {
        cursos: MOCK_CONTENT_ITEMS,
        trilhas: MOCK_TRAIL_ITEMS,
        eventos: MOCK_EVENT_ITEMS,
        smartzap: MOCK_SMARTZAP_ITEMS
    };

    items = computed(() => this.allItems[this.activeTab()]);

    filteredItems = computed((): (ContentManagementItem | TrailContentItem | EventContentItem | SmartZapItem)[] => {
        const query = this.searchQuery().toLowerCase().trim();
        let currentItems: (ContentManagementItem | TrailContentItem | EventContentItem | SmartZapItem)[] = this.items();

        if (query) {
            currentItems = currentItems.filter(item => {
                const nameMatch = item.name.toLowerCase().includes(query);
                // Handle different item types
                if ('creator' in item) {
                    return nameMatch || item.creator.toLowerCase().includes(query);
                } else if ('property' in item) {
                    return nameMatch || item.property.toLowerCase().includes(query);
                }
                return nameMatch;
            });
        }

        return currentItems;
    });

    setActiveTab(tab: ContentTab): void {
        this.activeTab.set(tab);
        this.searchQuery.set('');
        this.activeFilter.set(null);
    }

    // Pagination mock
    pageSize = signal(25);
    currentPage = signal(1);
    totalItems = computed(() => this.filteredItems().length);

    // Actions
    handleFilter(filter: ContentFilter): void {
        this.activeFilter.set(this.activeFilter() === filter ? null : filter);
    }

    handleEdit(item: ContentManagementItem): void {
        console.log('Edit item', item);
    }

    handleDelete(item: ContentManagementItem): void {
        console.log('Delete item', item);
    }
}
