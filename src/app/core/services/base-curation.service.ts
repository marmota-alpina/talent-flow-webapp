import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  orderBy
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { CurationItem, CurationItemStatus } from '../../models/curation-item.model';

/**
 * Base abstract service for all curation services
 * This service provides common CRUD operations for curation items
 */
@Injectable()
export abstract class BaseCurationService<T extends CurationItem> {

  /**
   * Firestore instance
   */
  protected firestore: Firestore = inject(Firestore);

  /**
   * Name of the Firestore collection
   */
  protected abstract readonly collectionName: string;

  /**
   * Get all items from the collection with the specified status
   * @param status Status filter (active or archived)
   * @returns Observable of items
   */
  getAll(status: CurationItemStatus = CurationItemStatus.ACTIVE): Observable<T[]> {
    const itemsCollection = collection(this.firestore, this.collectionName);
    const itemsQuery = query(
      itemsCollection,
      where('status', '==', status),
      orderBy('name')
    );

    return collectionData(itemsQuery, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Create a new item in the collection
   * @param item Item to create
   * @returns Observable that completes when the operation is done
   */
  create(item: Omit<T, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Observable<void> {
    const itemsCollection = collection(this.firestore, this.collectionName);
    const newDoc = doc(itemsCollection);
    const newItem = {
      ...item,
      status: CurationItemStatus.ACTIVE,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    return from(setDoc(newDoc, newItem));
  }

  /**
   * Update an existing item in the collection
   * @param id ID of the item to update
   * @param item Updated item data
   * @returns Observable that completes when the operation is done
   */
  update(id: string, item: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Observable<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    const updatedItem = {
      ...item,
      updatedAt: serverTimestamp()
    };

    return from(updateDoc(itemDoc, updatedItem));
  }

  /**
   * Archive an item (soft delete)
   * @param id ID of the item to archive
   * @returns Observable that completes when the operation is done
   */
  archive(id: string): Observable<void> {
    return this.update(id, { status: CurationItemStatus.ARCHIVED } as Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>);
  }

  /**
   * Unarchive an item (restore from soft delete)
   * @param id ID of the item to unarchive
   * @returns Observable that completes when the operation is done
   */
  unarchive(id: string): Observable<void> {
    return this.update(id, { status: CurationItemStatus.ACTIVE } as Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>);
  }
}
