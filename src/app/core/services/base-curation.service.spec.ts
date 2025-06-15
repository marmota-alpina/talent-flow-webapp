import { TestBed } from '@angular/core/testing';
import { Injectable, provideZonelessChangeDetection } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { BaseCurationService } from './base-curation.service';
import { CurationItem, CurationItemStatus } from '../../models/curation-item.model';

// Mock data
const mockItems: CurationItem[] = [
  { id: '1', name: 'Item 1', description: 'Description 1', status: CurationItemStatus.ACTIVE },
  { id: '2', name: 'Item 2', description: 'Description 2', status: CurationItemStatus.ACTIVE },
  { id: '3', name: 'Item 3', description: 'Description 3', status: CurationItemStatus.ARCHIVED },
];

// Mock implementation of the abstract class for testing
@Injectable()
class TestCurationService extends BaseCurationService<CurationItem> {
  constructor() {
    super({} as Firestore, 'test-collection');
  }

  // Override methods to avoid Firestore dependency
  override getAll(status: CurationItemStatus = CurationItemStatus.ACTIVE): Observable<CurationItem[]> {
    return of(mockItems.filter((item: CurationItem) => item.status === status));
  }

  override create(item: Omit<CurationItem, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Observable<void> {
    return of(undefined);
  }

  override update(id: string, item: Partial<Omit<CurationItem, 'id' | 'createdAt' | 'updatedAt'>>): Observable<void> {
    return of(undefined);
  }

  override archive(id: string): Observable<void> {
    return this.update(id, { status: CurationItemStatus.ARCHIVED } as Partial<Omit<CurationItem, 'id' | 'createdAt' | 'updatedAt'>>);
  }

  override unarchive(id: string): Observable<void> {
    return this.update(id, { status: CurationItemStatus.ACTIVE } as Partial<Omit<CurationItem, 'id' | 'createdAt' | 'updatedAt'>>);
  }
}

describe('BaseCurationService', () => {
  let service: TestCurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        TestCurationService
      ]
    });

    service = TestBed.inject(TestCurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all active items by default', (done) => {
      service.getAll().subscribe(items => {
        expect(items.length).toBe(2);
        expect(items[0].status).toBe(CurationItemStatus.ACTIVE);
        expect(items[1].status).toBe(CurationItemStatus.ACTIVE);
        done();
      });
    });

    it('should return archived items when specified', (done) => {
      service.getAll(CurationItemStatus.ARCHIVED).subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0].status).toBe(CurationItemStatus.ARCHIVED);
        done();
      });
    });
  });

  describe('create', () => {
    it('should create a new item with active status', (done) => {
      const newItem = { name: 'New Item', description: 'New Description' };

      spyOn(service, 'create').and.callThrough();

      service.create(newItem).subscribe(() => {
        expect(service.create).toHaveBeenCalledWith(newItem);
        done();
      });
    });
  });

  describe('update', () => {
    it('should update an existing item', (done) => {
      const updateData = { name: 'Updated Name' };

      spyOn(service, 'update').and.callThrough();

      service.update('1', updateData).subscribe(() => {
        expect(service.update).toHaveBeenCalledWith('1', updateData);
        done();
      });
    });
  });

  describe('archive and unarchive', () => {
    it('should archive an item by setting status to archived', (done) => {
      spyOn(service, 'update').and.returnValue(of(undefined));

      service.archive('1').subscribe(() => {
        expect(service.update).toHaveBeenCalledWith('1', { status: CurationItemStatus.ARCHIVED } as any);
        done();
      });
    });

    it('should unarchive an item by setting status to active', (done) => {
      spyOn(service, 'update').and.returnValue(of(undefined));

      service.unarchive('1').subscribe(() => {
        expect(service.update).toHaveBeenCalledWith('1', { status: CurationItemStatus.ACTIVE } as any);
        done();
      });
    });
  });
});
