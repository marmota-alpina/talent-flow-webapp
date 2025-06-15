# Creating New Curation Pages

This guide explains how to create new curation pages using the base classes provided by the Talent Flow application. The base classes provide a standardized way to implement CRUD operations for different types of data that need to be curated (e.g., technologies, soft skills, experience levels).

## Overview

The Talent Flow application uses a pattern of abstract base classes to reduce code duplication and ensure consistency across different curation pages. The two main base classes are:

1. `BaseCurationService`: Handles data operations with Firestore
2. `BaseCurationComponent`: Provides UI logic and state management

By extending these classes, you can quickly create new curation pages with minimal code.

## Step 1: Create a Model

First, create a model interface that extends the base `CurationItem` interface. This model should define any additional properties specific to your entity.

```typescript
// src/app/features/your-feature/your-item.model.ts
import { CurationItem } from '../../models/curation-item.model';

export interface YourItem extends CurationItem {
  // Add your specific properties here
  someProperty?: string;
  anotherProperty?: number;
}

// Optional: Define any enums related to your model
export enum YourItemCategory {
  CATEGORY_ONE = 'Category One',
  CATEGORY_TWO = 'Category Two'
}
```

## Step 2: Create a Service

Create a service that extends `BaseCurationService` with your model type. The service should specify the Firestore collection name in its constructor.

```typescript
// src/app/features/your-feature/your-items.service.ts
import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { BaseCurationService } from '../../core/services/base-curation.service';
import { YourItem } from './your-item.model';

@Injectable({
  providedIn: 'root'
})
export class YourItemsService extends BaseCurationService<YourItem> {
  constructor(firestore: Firestore) {
    // Pass the collection name to the base class
    super(firestore, 'your-collection-name');
  }

  // Add any additional methods specific to your service
}
```

## Step 3: Create a Component

Create a component that extends `BaseCurationComponent` with your model type. The component should inject your service and implement any specific UI logic.

```typescript
// src/app/features/your-feature/your-items.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCurationComponent } from '../../core/components/base-curation.component';
import { YourItemsService } from './your-items.service';
import { YourItem, YourItemCategory } from './your-item.model';
import { CurationItemStatus } from '../../models/curation-item.model';

@Component({
  selector: 'app-your-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './your-items.component.html',
  styleUrl: './your-items.component.scss'
})
export class YourItemsComponent extends BaseCurationComponent<YourItem> {
  // Make enums available to the template
  protected readonly CurationItemStatus = CurationItemStatus;
  protected readonly YourItemCategory = YourItemCategory;

  // Form model for creating/editing items
  protected formModel: Partial<YourItem> = {
    name: '',
    description: '',
    // Initialize your specific properties
    someProperty: '',
    anotherProperty: 0
  };

  constructor(yourItemsService: YourItemsService) {
    super(yourItemsService);
  }

  // Override methods as needed
  override openCreateModal(): void {
    this.resetForm();
    super.openCreateModal();
  }

  override openEditModal(item: YourItem): void {
    this.formModel = { ...item };
    super.openEditModal(item);
  }

  protected resetForm(): void {
    this.formModel = {
      name: '',
      description: '',
      // Reset your specific properties
      someProperty: '',
      anotherProperty: 0
    };
  }

  protected onSave(): void {
    super.saveItem(this.formModel);
  }
}
```

## Step 4: Create a Template

Create an HTML template for your component. You can use the `technologies.component.html` as a reference and adapt it to your specific needs.

```html
<!-- src/app/features/your-feature/your-items.component.html -->
<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Your Items Management</h1>

  <!-- Loading and Error States -->
  @if (loading()) {
    <div class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  }

  <!-- Rest of your template... -->
</div>
```

## Step 5: Add Routing

Add a route for your new component in the appropriate routing module:

```typescript
// src/app/app.routes.ts or your feature routing module
import { Routes } from '@angular/router';
import { YourItemsComponent } from './features/your-feature/your-items.component';

export const routes: Routes = [
  // ... other routes
  {
    path: 'admin/your-items',
    component: YourItemsComponent
  }
];
```

## Example

For a complete example, refer to the implementation of the `TechnologiesComponent` and `TechnologiesService` in the `src/app/features/technologies` directory.

## Best Practices

1. **Keep It Simple**: Only add properties and methods that are specific to your entity. Let the base classes handle the common functionality.
2. **Consistent Naming**: Follow the naming pattern used in the example (e.g., `YourItem`, `YourItemsService`, `YourItemsComponent`).
3. **Testing**: Write unit tests for your service and component, focusing on the specific functionality you've added.
4. **Documentation**: Add comments to your code to explain any complex logic or business rules.

By following these steps, you can quickly create new curation pages that are consistent with the rest of the application and leverage the shared functionality provided by the base classes.
