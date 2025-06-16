import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Injectable, provideZonelessChangeDetection } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, throwError } from 'rxjs';
import { BaseCurationComponent } from './base-curation.component';
import { BaseCurationService } from '../services/base-curation.service';
import { CurationItem, CurationItemStatus } from '../../models/curation-item.model';
import { Firestore } from '@angular/fire/firestore';
import { MockFirestore } from '../testing/mock-firestore';

// Mock data
const mockItems: CurationItem[] = [
  { id: '1', name: 'Item 1', description: 'Description 1', status: CurationItemStatus.ACTIVE },
  { id: '2', name: 'Item 2', description: 'Description 2', status: CurationItemStatus.ACTIVE },
  { id: '3', name: 'Item 3', description: 'Description 3', status: CurationItemStatus.ARCHIVED },
];

// Mock service
@Injectable()
class MockCurationService extends BaseCurationService<CurationItem> {
  protected override readonly collectionName: string = 'test-collection';

  override getAll(): Observable<CurationItem[]> {
    return of(mockItems);
  }

  override create(): Observable<void> {
    return of(undefined);
  }

  override update(): Observable<void> {
    return of(undefined);
  }

  override archive(): Observable<void> {
    return of(undefined);
  }

  override unarchive(): Observable<void> {
    return of(undefined);
  }
}

// Test component that extends the abstract component
@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div>Loading...</div>
    }
    @if (error()) {
      <div>{{ error() }}</div>
    }

    <button (click)="switchView(CurationItemStatus.ACTIVE)">Active</button>
    <button (click)="switchView(CurationItemStatus.ARCHIVED)">Archived</button>

    <ul>
      @for (item of displayedItems(); track item.id) {
        <li>
          {{ item.name }}
          <button (click)="openEditModal(item)">Edit</button>
          @if (item.status === CurationItemStatus.ACTIVE) {
            <button (click)="archiveItem(item.id!)">Archive</button>
          }
          @if (item.status === CurationItemStatus.ARCHIVED) {
            <button (click)="unarchiveItem(item.id!)">Unarchive</button>
          }
        </li>
      }
    </ul>

    <button (click)="openCreateModal()">Create</button>

    @if (showModal()) {
      <div>
        <h2>{{ currentItem() ? 'Edit' : 'Create' }} Item</h2>
        <button (click)="closeModal()">Close</button>
        <button (click)="saveItem({ name: 'Test Item' })">Save</button>
      </div>
    }
  `
})
class TestCurationComponent extends BaseCurationComponent<CurationItem> {
  CurationItemStatus = CurationItemStatus;
}

describe('BaseCurationComponent', () => {
  let component: TestCurationComponent;
  let fixture: ComponentFixture<TestCurationComponent>;
  let service: BaseCurationService<CurationItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCurationComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: BaseCurationService, useClass: MockCurationService },
        { provide: Firestore, useClass: MockFirestore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestCurationComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(BaseCurationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load items on initialization', () => {
    spyOn(service, 'getAll').and.returnValue(of(mockItems));
    component.ngOnInit();
    expect(service.getAll).toHaveBeenCalled();
    expect(component['items']()).toEqual(mockItems);
  });

  it('should filter active and archived items', () => {
    component['items'].set(mockItems);
    expect(component['activeItems']().length).toBe(2);
    expect(component['archivedItems']().length).toBe(1);
  });

  it('should switch between active and archived views', () => {
    spyOn(service, 'getAll').and.returnValue(of(mockItems));

    component['switchView'](CurationItemStatus.ARCHIVED);
    expect(component['currentView']()).toBe(CurationItemStatus.ARCHIVED);
    expect(service.getAll).toHaveBeenCalledWith(CurationItemStatus.ARCHIVED);

    component['switchView'](CurationItemStatus.ACTIVE);
    expect(component['currentView']()).toBe(CurationItemStatus.ACTIVE);
    expect(service.getAll).toHaveBeenCalledWith(CurationItemStatus.ACTIVE);
  });

  it('should open create modal', () => {
    component['openCreateModal']();
    expect(component['showModal']()).toBeTrue();
    expect(component['currentItem']()).toBeNull();
  });

  it('should open edit modal with item', () => {
    const item = mockItems[0];
    component['openEditModal'](item);
    expect(component['showModal']()).toBeTrue();
    expect(component['currentItem']()).toEqual(item);
  });

  it('should close modal', () => {
    component['showModal'].set(true);
    component['currentItem'].set(mockItems[0]);

    component['closeModal']();
    expect(component['showModal']()).toBeFalse();
    expect(component['currentItem']()).toBeNull();
  });

  it('should create a new item', () => {
    spyOn(service, 'create').and.returnValue(of(undefined));
    spyOn(component as any, 'loadItems');

    component['currentItem'].set(null);
    component['saveItem']({ name: 'New Item' });

    expect(service.create).toHaveBeenCalled();
    expect(component['loadItems']).toHaveBeenCalled();
  });

  it('should update an existing item', () => {
    spyOn(service, 'update').and.returnValue(of(undefined));
    spyOn(component as any, 'loadItems');

    component['currentItem'].set(mockItems[0]);
    component['saveItem']({ name: 'Updated Item' });

    expect(service.update).toHaveBeenCalledWith('1', { name: 'Updated Item' });
    expect(component['loadItems']).toHaveBeenCalled();
  });

  it('should archive an item', () => {
    spyOn(service, 'archive').and.returnValue(of(undefined));
    spyOn(component as any, 'loadItems');

    component['archiveItem']('1');

    expect(service.archive).toHaveBeenCalledWith('1');
    expect(component['loadItems']).toHaveBeenCalled();
  });

  it('should unarchive an item', () => {
    spyOn(service, 'unarchive').and.returnValue(of(undefined));
    spyOn(component as any, 'loadItems');

    component['unarchiveItem']('1');

    expect(service.unarchive).toHaveBeenCalledWith('1');
    expect(component['loadItems']).toHaveBeenCalled();
  });

  it('should handle errors when loading items', () => {
    const errorMsg = 'Test error';
    spyOn(service, 'getAll').and.returnValue(throwError(() => new Error(errorMsg)));
    spyOn(console, 'error');

    component['loadItems']();

    expect(component['loading']()).toBeFalse();
    expect(component['error']()).toBe('Failed to load items. Please try again.');
    expect(console.error).toHaveBeenCalled();
  });
});
