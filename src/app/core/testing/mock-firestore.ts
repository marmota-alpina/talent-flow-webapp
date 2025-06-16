import { Injectable } from '@angular/core';

/**
 * Mock Firestore service for testing
 * This mock implementation provides empty implementations of the Firestore methods
 * used by the BaseCurationService class.
 */
@Injectable()
export class MockFirestore {
  // Mock methods return empty objects or functions to prevent errors
  collection() {
    return {};
  }

  doc() {
    return {};
  }

  setDoc() {
    return Promise.resolve();
  }

  updateDoc() {
    return Promise.resolve();
  }

  // Add any other methods or properties needed for testing
}
