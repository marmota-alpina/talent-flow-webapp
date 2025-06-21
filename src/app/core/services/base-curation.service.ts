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
  orderBy,
  getCountFromServer
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { CurationItem, CurationItemStatus } from '../../models/curation-item.model';

/**
 * Base abstract service for all curation services.
 * This version uses direct modular function imports from '@angular/fire/firestore'
 * to resolve runtime errors and simplify the code, while maintaining testability
 * by depending only on the main `Firestore` service.
 */
@Injectable()
export abstract class BaseCurationService<T extends CurationItem> {

  /**
   * Firestore instance. This is the single dependency from @angular/fire,
   * making the service easy to test by mocking Firestore.
   */
  protected firestore: Firestore = inject(Firestore);

  /**
   * Name of the Firestore collection. Must be provided by the concrete class.
   */
  protected abstract readonly collectionName: string;

  /**
   * Get all items from the collection with the specified status.
   * @param status Status filter (active or archived)
   * @returns Observable of items
   */
  getAll(status: CurationItemStatus = CurationItemStatus.ACTIVE): Observable<T[]> {
    const collectionRef = collection(this.firestore, this.collectionName);
    const itemsQuery = query(
      collectionRef,
      where('status', '==', status),
      orderBy('name')
    );
    return collectionData(itemsQuery, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Create a new item in the collection.
   * @param item Item to create
   * @returns Observable that completes when the operation is done
   */
  create(item: Omit<T, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Observable<void> {
    const collectionRef = collection(this.firestore, this.collectionName);
    // Generate a new document reference with an auto-generated ID
    const docRef = doc(collectionRef);
    const newItem = {
      ...item,
      status: CurationItemStatus.ACTIVE,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return from(setDoc(docRef, newItem));
  }

  /**
   * Update an existing item in the collection.
   * @param id ID of the item to update
   * @param item Updated item data
   * @returns Observable that completes when the operation is done
   */
  update(id: string, item: Partial<T>): Observable<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    const updatedItem = {
      ...item,
      updatedAt: serverTimestamp()
    };
    // Cast to { [key: string]: any } is safe and often necessary for updateDoc's signature
    return from(updateDoc(docRef, updatedItem as { [key: string]: any }));
  }

  /**
   * Archive an item (soft delete).
   * @param id ID of the item to archive
   * @returns Observable that completes when the operation is done
   */
  archive(id: string): Observable<void> {
    return this.update(id, { status: CurationItemStatus.ARCHIVED } as Partial<T>);
  }

  /**
   * Unarchive an item (restore from soft delete).
   * @param id ID of the item to unarchive
   * @returns Observable that completes when the operation is done
   */
  unarchive(id: string): Observable<void> {
    return this.update(id, { status: CurationItemStatus.ACTIVE } as Partial<T>);
  }

  /**
   * Count items in the collection with the specified status.
   * This is more efficient than retrieving all items and counting them.
   * @param status Status filter (active or archived)
   * @returns Observable of the count
   */
  count(status: CurationItemStatus = CurationItemStatus.ACTIVE): Observable<number> {
    const collectionRef = collection(this.firestore, this.collectionName);
    const itemsQuery = query(
      collectionRef,
      where('status', '==', status)
    );
    return from(getCountFromServer(itemsQuery).then(snapshot => snapshot.data().count));
  }
}
