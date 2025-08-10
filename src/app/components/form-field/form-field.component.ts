import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormField } from '../../core/models/form-field';
import { InputType } from '../../core/enums/input-type';
import { TranslatePipe } from '@ngx-translate/core';
import AngryIcon from '../../../assets/icons/emoji/emoji_angry.svg';
import SadIcon from '../../../assets/icons/emoji/emoji_sad.svg';
import NormalIcon from '../../../assets/icons/emoji/emoji_normal.svg';
import HappyIcon from '../../../assets/icons/emoji/emoji_happy.svg';
import CheerfulIcon from '../../../assets/icons/emoji/emoji_cheerful.svg';
import { ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgOptimizedImage } from '@angular/common';

type EmojiOption = {
  value: 1 | 2 | 3 | 4 | 5;
  alt: string;
  src: string;
};

@Component({
  selector: 'app-form-field',
  imports: [TranslatePipe, ReactiveFormsModule, NgOptimizedImage, NgClass],
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
    { value: 1, alt: 'angry', src: AngryIcon },
    { value: 2, alt: 'sad', src: SadIcon },
    { value: 3, alt: 'neutral', src: NormalIcon },
    { value: 4, alt: 'happy', src: HappyIcon },
    { value: 5, alt: 'cheerful', src: CheerfulIcon },
  ];

  pick(v: 1 | 2 | 3 | 4 | 5) {
    this.selected = v;
    this.selectedChange.emit(v);
  }
}
