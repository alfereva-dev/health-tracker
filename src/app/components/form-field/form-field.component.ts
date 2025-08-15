import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormField } from '../../core/models/form-field';
import { InputType } from '../../core/enums/input-type';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';

type EmojiOption = {
  value: 1 | 2 | 3 | 4 | 5;
  alt: string;
  src: string;
};

@Component({
  selector: 'app-form-field',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    NgClass,
    NgSelectComponent,
    NgOptionComponent,
    FormsModule,
  ],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
})
export class FormFieldComponent {
  @Input() field!: FormField;
  @Input() disableLabel: boolean = false;
  @Input() selected: 1 | 2 | 3 | 4 | 5 | null = null;
  @Output() selectedChange = new EventEmitter<1 | 2 | 3 | 4 | 5>();
  protected readonly InputType = InputType;
  readonly emojis: EmojiOption[] = [
    { value: 1, alt: 'angry', src: 'assets/icons/emoji/emoji_angry.svg' },
    { value: 2, alt: 'sad', src: 'assets/icons/emoji/emoji_sad.svg' },
    { value: 3, alt: 'neutral', src: 'assets/icons/emoji/emoji_normal.svg' },
    { value: 4, alt: 'happy', src: 'assets/icons/emoji/emoji_happy.svg' },
    { value: 5, alt: 'cheerful', src: 'assets/icons/emoji/emoji_cheerful.svg' },
  ];
  sliderBackground = '';

  ngOnInit() {
    const v = this.getCurrentSliderValue();
    this.updateSliderColor(v);

    this.field.formControl?.valueChanges.subscribe((val) =>
      this.updateSliderColor(Number(val ?? 0)),
    );
  }

  getCurrentSliderValue(): number {
    const raw = this.field?.formControl?.value ?? this.field?.value ?? 0;
    const n = Number(raw);
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
  }

  onSliderInput(e: Event) {
    const val = Number((e.target as HTMLInputElement).value);
    this.field.formControl?.setValue(val, { emitEvent: true });
    this.updateSliderColor(val);
  }

  updateSliderColor(val: number) {
    const pct = Math.min(100, Math.max(0, val));
    const t = pct / 100;
    const r = Math.round(255 * (1 - t));
    const g = Math.round(255 * t);
    const b = 0;
    const color = `rgb(${r},${g},${b})`;

    this.sliderBackground =
      `linear-gradient(90deg, ${color} 0%, ${color} ${pct}%, ` +
      `#3a3f4a ${pct}%, #3a3f4a 100%)`;
  }

  pick(v: 1 | 2 | 3 | 4 | 5) {
    this.selected = v;
    this.selectedChange.emit(v);
  }
}
