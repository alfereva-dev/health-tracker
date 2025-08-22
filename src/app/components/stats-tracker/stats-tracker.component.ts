import { Component, Input } from '@angular/core';
import { Stat } from '../../core/models/stat';
import { StatsDefault } from '../../../assets/mock/default-stats';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FormControl, FormGroup } from '@angular/forms';
import { InputType } from '../../core/enums/input-type';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-stats-tracker',
  imports: [FormFieldComponent, CdkDrag, CdkDropList, TranslatePipe],
  templateUrl: './stats-tracker.component.html',
  styleUrl: './stats-tracker.component.css',
})
export class StatsTrackerComponent {
  @Input() stats: Stat[] | null = null;
  @Input() editable = false;
  currentsStats: Stat[] = [];
  formGroup = new FormGroup({
    mood: new FormControl(),
    energy: new FormControl<number>(0),
    stress: new FormControl(),
    note: new FormControl(),
    smoke: new FormControl(),
    dropdown: new FormControl(),
    multiple: new FormControl(),
  });
  options = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
  ];
  multiOptions = [
    {
      label: '1',
      value: '1',
    },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
  ];
  baseFormFields = [
    {
      label: 'Mood:',
      formControl: this.formGroup.controls.mood,
      type: InputType.EMOJI_SCALE,
    },
    {
      label: 'Energy:',
      formControl: this.formGroup.controls.energy,
      type: InputType.SLIDER,
    },
    {
      label: 'Stress:',
      formControl: this.formGroup.controls.stress,
      type: InputType.NUMBER,
    },
    {
      label: 'Note:',
      formControl: this.formGroup.controls.note,
      type: InputType.TEXT,
    },
    {
      label: 'Smoke:',
      formControl: this.formGroup.controls.smoke,
      type: InputType.CHECKBOX,
    },
    {
      label: 'Dropdown:',
      formControl: this.formGroup.controls.dropdown,
      options: this.options,
      type: InputType.SELECT_DROPDOWN,
    },
    {
      label: 'Multiple Choices:',
      formControl: this.formGroup.controls.multiple,
      options: this.multiOptions,
      type: InputType.MULTIPLE_CHOICE,
    },
  ];

  ngOnInit() {
    this.currentsStats =
      this.stats && this.stats.length > 0 ? [...this.stats] : StatsDefault;
  }

  drop(event: CdkDragDrop<Stat[]>) {
    moveItemInArray(
      this.currentsStats,
      event.previousIndex,
      event.currentIndex,
    );
  }
}
