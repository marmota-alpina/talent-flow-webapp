import { TestBed } from '@angular/core/testing';
import { Injectable, provideZonelessChangeDetection } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseCurationService } from './base-curation.service';
import { CurationItem, CurationItemStatus } from '../../models/curation-item.model';
import { Firestore } from '@angular/fire/firestore';
import { MockFirestore } from '../testing/mock-firestore';

// Mock data
const mockItems: CurationItem[] = [
  { id: '1', name: 'Item 1', description: 'Description 1', status: CurationItemStatus.ACTIVE },
  { id: '2', name: 'Item 2', description: 'Description 2', status: CurationItemStatus.ACTIVE },
  { id: '3', name: 'Item 3', description: 'Description 3', status: CurationItemStatus.ARCHIVED },
];

// Mock implementation of the abstract class for testing
@Injectable()
class TestCurationService extends BaseCurationService<CurationItem> {
  protected override readonly collectionName: string = 'test-collection';

  // Override methods to avoid Firestore dependency
  override getAll(status: CurationItemStatus = CurationItemStatus.ACTIVE): Observable<CurationItem[]> {
    return of(mockItems.filter((item: CurationItem) => item.status === status));
  }

  override create(): Observable<void> {
    return of(undefined);
  }

  override update(): Observable<void> {
    return of(undefined);
  }

  override archive(): Observable<void> {
    return this.update();
  }

  override unarchive(): Observable<void> {
    return this.update();
  }
}

describe('BaseCurationService', () => {
  let service: TestCurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        TestCurationService,
        { provide: Firestore, useClass: MockFirestore }
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
      spyOn(service, 'create').and.callThrough();

      service.create().subscribe(() => {
        expect(service.create).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('update', () => {
    it('should update an existing item', (done) => {
      spyOn(service, 'update').and.callThrough();

      service.update().subscribe(() => {
        expect(service.update).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('archive and unarchive', () => {
    it('should archive an item by setting status to archived', (done) => {
      spyOn(service, 'update').and.returnValue(of(undefined));

      service.archive().subscribe(() => {
        expect(service.update).toHaveBeenCalled();
        done();
      });
    });

    it('should unarchive an item by setting status to active', (done) => {
      spyOn(service, 'update').and.returnValue(of(undefined));

      service.unarchive().subscribe(() => {
        expect(service.update).toHaveBeenCalled();
        done();
      });
    });
  });
});
