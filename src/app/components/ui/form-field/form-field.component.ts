import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormField } from '../../../core/models/form-field';
import { InputType } from '../../../core/enums/input-type';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgStyle } from '@angular/common';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { startWith, Subscription } from 'rxjs';

export type EmojiScore = 1 | 2 | 3 | 4 | 5;
type EmojiOption = {
  value: EmojiScore;
  alt: string;
  src: string;
};

@Component({
  selector: 'app-form-field',
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    NgClass,
    NgSelectComponent,
    NgOptionComponent,
    FormsModule,
    NgStyle,
  ],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
})
export class FormFieldComponent {
  @Input() field!: FormField;
  @Input() disableLabel: boolean = false;
  @Input() selected: 1 | 2 | 3 | 4 | 5 | null = null;
  @Output() selectedChange = new EventEmitter<EmojiScore>();
  @Output() optionsChange = new EventEmitter<string[]>();
  private sub?: Subscription;
  protected readonly InputType = InputType;
  readonly emojis: EmojiOption[] = [
    { value: 1, alt: 'angry', src: 'assets/icons/emoji/emoji_angry.svg' },
    { value: 2, alt: 'sad', src: 'assets/icons/emoji/emoji_sad.svg' },
    { value: 3, alt: 'neutral', src: 'assets/icons/emoji/emoji_normal.svg' },
    { value: 4, alt: 'happy', src: 'assets/icons/emoji/emoji_happy.svg' },
    { value: 5, alt: 'cheerful', src: 'assets/icons/emoji/emoji_cheerful.svg' },
  ];
  sliderBackground = '';
  inputCount = 0;
  optionInputs: string[] = [];

  ngOnInit() {
    this.subscribeToFormControl();
  }

  ngOnChanges(ch: SimpleChanges) {
    if (ch['field']) {
      this.subscribeToFormControl();
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private subscribeToFormControl() {
    this.sub?.unsubscribe();
    const c = this.field?.formControl;
    if (!c) return;

    if (this.field.type === InputType.SLIDER) {
      this.updateSliderColor(Number(c.value ?? 0));
      this.sub = c.valueChanges
        .pipe(startWith(c.value))
        .subscribe((v) => this.updateSliderColor(Number(v ?? 0)));
    } else {
      this.sub = c.valueChanges.subscribe();
    }
  }

  private clamp(x: number) {
    return Math.min(100, Math.max(0, x));
  }

  onSliderInput(e: Event) {
    const val = Number((e.target as HTMLInputElement).value);
    this.field.formControl?.setValue(val, { emitEvent: true });
    this.updateSliderColor(val);
  }

  updateSliderColor(val: number) {
    const pct = this.clamp(Number(val || 0));
    const t = pct / 100;
    const r = Math.round(255 * (1 - t));
    const g = Math.round(255 * t);
    const color = `rgb(${r},${g},0)`;
    this.sliderBackground =
      `linear-gradient(90deg, ${color} 0%, ${color} ${pct}%, ` +
      `#3a3f4a ${pct}%, #3a3f4a 100%)`;
  }

  isChoiceType(v: unknown): boolean {
    return (
      v === this.InputType.SELECT_DROPDOWN ||
      v === this.InputType.MULTIPLE_CHOICE
    );
  }

  onCountChange(n: number) {
    const num = Number.isFinite(n) ? Math.trunc(n) : 0;
    const clamped = Math.max(0, Math.min(50, num));

    this.inputCount = clamped;

    const prev = this.optionInputs ?? [];
    this.optionInputs = Array.from(
      { length: clamped },
      (_, i) => prev[i] ?? '',
    );
    this.emitOptions();
  }

  onOptionInput(i: number, val: string) {
    this.optionInputs[i] = val;
    this.emitOptions();
  }

  private emitOptions() {
    this.optionsChange.emit(this.optionInputs);
  }

  private readonly _localMetric = new FormControl<string | null>('');

  get metricCtrl(): FormControl<string | null> {
    return this.field.metricControl ?? this._localMetric;
  }

  get emojiValue(): 1 | 2 | 3 | 4 | 5 | null {
    const v = Number(this.field.formControl?.value);
    return v >= 1 && v <= 5 ? (v as 1 | 2 | 3 | 4 | 5) : null;
  }

  pickEmoji(v: 1 | 2 | 3 | 4 | 5) {
    this.field.formControl?.setValue(v, { emitEvent: true });
  }
}
