import { Component, forwardRef, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-tag-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true
    }
  ],
  template: `
    <div
      class="w-full flex flex-wrap items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white"
      (click)="focusInput()"
      (keydown)="handleContainerKeyDown($event)"
      tabindex="0"
    >
      <span
        *ngFor="let tag of tags; let i = index"
        class="tag bg-primary/10 text-primary text-sm font-semibold px-2.5 py-1 rounded-md flex items-center gap-2 whitespace-nowrap"
      >
        <span>{{ tag }}</span>
        <button
          type="button"
          class="remove-tag-btn text-primary/70 hover:text-primary font-bold"
          (click)="removeTag(i, $event)"
        >
          &times;
        </button>
      </span>

      <input
        #inputElement
        [formControl]="inputControl"
        type="text"
        [placeholder]="placeholder"
        class="flex-grow bg-transparent border-none outline-none text-sm"
        (keydown)="onKeyDown($event)"
      >
    </div>
  `,
  styles: [`
    .tag {
      transition: all 0.2s ease-in-out;
    }
  `]
})
export class TagInputComponent implements ControlValueAccessor {
  @Input() placeholder = 'Adicionar tag...';

  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  tags: string[] = [];
  inputControl = new FormControl('');

  // ControlValueAccessor implementation
  // Function to call when the value changes
  private onChange = (value: string[]): void => {
    // This will be replaced by the actual function provided by the form control
    // Using the value parameter to avoid linting error
    console.log('Value changed:', value);
  };

  // Function to call when the input is touched
  private onTouched = (): void => {
    // This will be replaced by the actual function provided by the form control
  };

  writeValue(value: string[]): void {
    this.tags = value || [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.inputControl.disable();
    } else {
      this.inputControl.enable();
    }
  }

  // Component methods
  addTag(tag: string): void {
    const trimmedTag = tag.trim();
    if (trimmedTag && !this.tags.includes(trimmedTag)) {
      this.tags = [...this.tags, trimmedTag];
      this.onChange(this.tags);
      this.inputControl.setValue('');
    }
  }

  removeTag(index: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.tags = this.tags.filter((_, i) => i !== index);
    this.onChange(this.tags);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const value = this.inputControl.value;
      if (value) {
        this.addTag(value);
      }
    } else if (event.key === 'Backspace' && !this.inputControl.value && this.tags.length > 0) {
      this.removeTag(this.tags.length - 1);
    }
  }

  focusInput(): void {
    if (this.inputElement && this.inputElement.nativeElement) {
      this.inputElement.nativeElement.focus();
      this.onTouched();
    }
  }

  handleContainerKeyDown(event: KeyboardEvent): void {
    // Focus the input element when the container receives keyboard interaction
    if (event.key !== 'Tab') {
      event.preventDefault();
      this.focusInput();
    }
  }
}
