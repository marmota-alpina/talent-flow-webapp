import { Component, OnInit, OnDestroy, signal, computed, inject, Signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BaseCurationService } from '../services/base-curation.service';
import { CurationItem, CurationItemStatus } from '../../models/curation-item.model';

/**
 * Base abstract component for all curation components
 * This component provides common UI logic for curation items
 */
@Component({
  template: ''
})
export abstract class BaseCurationComponent<T extends CurationItem> implements OnInit, OnDestroy {
  // Subject for handling unsubscription
  private destroy$ = new Subject<void>();

  // Signals for reactive state management
  protected items = signal<T[]>([]);
  protected loading = signal<boolean>(false);
  protected error = signal<string | null>(null);
  protected showModal = signal<boolean>(false);
  protected currentItem = signal<T | null>(null);
  protected currentView = signal<CurationItemStatus>(CurationItemStatus.ACTIVE);

  // Computed values
  protected activeItems: Signal<T[]> = computed(() =>
    this.items().filter(item => item.status === CurationItemStatus.ACTIVE)
  );

  protected archivedItems: Signal<T[]> = computed(() =>
    this.items().filter(item => item.status === CurationItemStatus.ARCHIVED)
  );

  protected displayedItems: Signal<T[]> = computed(() =>
    this.currentView() === CurationItemStatus.ACTIVE
      ? this.activeItems()
      : this.archivedItems()
  );

  /**
   * Constructor
   * @param curationService The service to use for CRUD operations
   */
  constructor(protected curationService: BaseCurationService<T>) {
    // Constructor initialization
  }

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    // Load items when the component is initialized
    this.loadItems();
  }

  /**
   * Clean up subscriptions when the component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load items from the service
   */
  protected loadItems(): void {
    this.loading.set(true);
    this.error.set(null);

    this.curationService.getAll(this.currentView())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.items.set(items);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading items', err);
          this.error.set('Failed to load items. Please try again.');
          this.loading.set(false);
        }
      });
  }

  /**
   * Switch between active and archived views
   * @param status The status to switch to
   */
  protected switchView(status: CurationItemStatus): void {
    this.currentView.set(status);
    this.loadItems();
  }

  /**
   * Open the modal to create a new item
   */
  protected openCreateModal(): void {
    this.currentItem.set(null);
    this.showModal.set(true);
  }

  /**
   * Open the modal to edit an existing item
   * @param item The item to edit
   */
  protected openEditModal(item: T): void {
    this.currentItem.set({...item});
    this.showModal.set(true);
  }

  /**
   * Close the modal
   */
  protected closeModal(): void {
    this.showModal.set(false);
    this.currentItem.set(null);
  }

  /**
   * Save the current item (create or update)
   * @param item The item data to save
   */
  protected saveItem(item: Partial<T>): void {
    this.loading.set(true);

    if (this.currentItem() && this.currentItem()?.id) {
      // Update existing item
      this.curationService.update(this.currentItem()!.id!, item)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadItems();
          },
          error: (err) => {
            console.error('Error updating item', err);
            this.error.set('Failed to update item. Please try again.');
            this.loading.set(false);
          }
        });
    } else {
      // Create new item
      this.curationService.create(item as Omit<T, 'id' | 'status' | 'createdAt' | 'updatedAt'>)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadItems();
          },
          error: (err) => {
            console.error('Error creating item', err);
            this.error.set('Failed to create item. Please try again.');
            this.loading.set(false);
          }
        });
    }
  }

  /**
   * Archive an item
   * @param id The ID of the item to archive
   */
  protected archiveItem(id: string): void {
    this.loading.set(true);

    this.curationService.archive(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadItems();
        },
        error: (err) => {
          console.error('Error archiving item', err);
          this.error.set('Failed to archive item. Please try again.');
          this.loading.set(false);
        }
      });
  }

  /**
   * Unarchive an item
   * @param id The ID of the item to unarchive
   */
  protected unarchiveItem(id: string): void {
    this.loading.set(true);

    this.curationService.unarchive(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadItems();
        },
        error: (err) => {
          console.error('Error unarchiving item', err);
          this.error.set('Failed to unarchive item. Please try again.');
          this.loading.set(false);
        }
      });
  }
}
