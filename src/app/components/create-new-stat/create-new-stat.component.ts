import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InputType } from '../../core/enums/input-type';
import { Frequency } from '../../core/enums/frequency';
import { TimeOfDay } from '../../core/enums/time-of-day';
import { DailyEntries } from '../../core/enums/daily-entries';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'app-create-new-stat',
  imports: [FormFieldComponent],
  templateUrl: './create-new-stat.component.html',
  styleUrl: './create-new-stat.component.css',
})
export class CreateNewStatComponent {
  @Output() close = new EventEmitter<void>();
  formGroup = new FormGroup({
    name: new FormControl<string>(''),
    inputType: new FormControl(''),
    frequency: new FormControl(''),
    timeOfDay: new FormControl(''),
    dailyEntries: new FormControl(''),
    color: new FormControl(''),
    icon: new FormControl(''),
    category: new FormControl(''),
    tags: new FormControl(''),
    privacy: new FormControl<boolean>(false),
  });

  optionsInputType = [
    { label: 'INPUT_TYPE.number', value: InputType.NUMBER },
    {
      label: 'INPUT_TYPE.select_with_dropdown',
      value: InputType.SELECT_DROPDOWN,
    },
    { label: 'INPUT_TYPE.multiple_choice', value: InputType.MULTIPLE_CHOICE },
    { label: 'INPUT_TYPE.checkbox', value: InputType.CHECKBOX },
    { label: 'INPUT_TYPE.text', value: InputType.TEXT },
    { label: 'INPUT_TYPE.emoji_scale', value: InputType.EMOJI_SCALE },
    { label: 'INPUT_TYPE.slider', value: InputType.SLIDER },
  ];

  optionsFrequency = [
    { label: 'PERIODICITY.every_day', value: Frequency.EVERY_DAY },
    { label: 'PERIODICITY.every_n_days', value: Frequency.EVERY_N_DAYS },
    {
      label: 'PERIODICITY.on_certain_days',
      value: Frequency.CERTAIN_DAYS_OF_WEEK,
    },
    {
      label: 'PERIODICITY.manual_request',
      value: Frequency.MANUALLY,
    },
  ];

  optionsTimeOfDay = [
    { label: 'PERIODICITY.morning', value: TimeOfDay.MORNING },
    {
      label: 'PERIODICITY.afternoon',
      value: TimeOfDay.AFTERNOON,
    },
    {
      label: 'PERIODICITY.evening',
      value: TimeOfDay.EVENING,
    },
    {
      label: 'PERIODICITY.night',
      value: TimeOfDay.NIGHT,
    },
    {
      label: 'PERIODICITY.all_day',
      value: TimeOfDay.ALL_DAY,
    },
    {
      label: 'PERIODICITY.custom_time',
      value: TimeOfDay.CUSTOM_TIME,
    },
  ];

  optionsDailyEntries = [
    { label: 'PERIODICITY.once_day', value: DailyEntries.ONCE_DAY },
    {
      label: 'PERIODICITY.several_times_day',
      value: DailyEntries.SEVERAL_TIMES_DAY,
    },
    { label: 'PERIODICITY.free_entry', value: DailyEntries.FREE_ENTRY },
  ];

  formField = [
    {
      label: 'CREATE_NEW_STAT.name',
      formControl: this.formGroup.controls.name,
      type: InputType.SMALL_STRING,
    },
    {
      label: 'CREATE_NEW_STAT.input_type',
      formControl: this.formGroup.controls.inputType,
      type: InputType.SELECT_DROPDOWN,
      options: this.optionsInputType,
    },
    {
      label: 'CREATE_NEW_STAT.frequency',
      formControl: this.formGroup.controls.frequency,
      type: InputType.SELECT_DROPDOWN,
      options: this.optionsFrequency,
    },
    {
      label: 'CREATE_NEW_STAT.time_of_day',
      formControl: this.formGroup.controls.timeOfDay,
      type: InputType.SELECT_DROPDOWN,
      options: this.optionsTimeOfDay,
    },
    {
      label: 'CREATE_NEW_STAT.daily_entries',
      formControl: this.formGroup.controls.dailyEntries,
      type: InputType.SELECT_DROPDOWN,
      options: this.optionsDailyEntries,
    },
    {
      label: 'CREATE_NEW_STAT.color',
      formControl: this.formGroup.controls.color,
      type: InputType.SELECT_DROPDOWN,
      options: [],
    },
    {
      label: 'CREATE_NEW_STAT.icon',
      formControl: this.formGroup.controls.icon,
      type: InputType.SELECT_DROPDOWN,
      options: [],
    },
    {
      label: 'CREATE_NEW_STAT.privacy',
      formControl: this.formGroup.controls.privacy,
      type: InputType.CHECKBOX,
      infoText: 'Hide from main page',
    },
  ];

  onOverlayClick() {
    this.close.emit();
  }

  onCloseClick() {
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.close.emit();
  }
}
