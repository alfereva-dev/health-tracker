import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InputType } from '../../../core/enums/input-type';
import { Frequency } from '../../../core/enums/frequency';
import { TimeOfDay } from '../../../core/enums/time-of-day';
import { DailyEntries } from '../../../core/enums/daily-entries';
import { FormFieldComponent } from '../../ui/form-field/form-field.component';
import { UserService } from '../../../core/services/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { Colors } from '../../../core/enums/colors';
import { Emoji } from '../../../core/enums/emoji';
import { Tracker } from '../../../core/models/tracker';

type Option<T> = { label: string; value: T };

@Component({
  selector: 'app-create-new-stat',
  imports: [FormFieldComponent, TranslateModule],
  templateUrl: './create-new-tracker.component.html',
  styleUrl: './create-new-tracker.component.css',
})
export class CreateNewTrackerComponent {
  @Output() close = new EventEmitter<void>();
  metricControl = new FormControl<string | null>('');
  formGroup = new FormGroup({
    name: new FormControl<string>(''),
    inputType: new FormControl(''),
    frequency: new FormControl(''),
    timeOfDay: new FormControl(''),
    dailyEntries: new FormControl(''),
    color: new FormControl<Colors | null>(null),
    icon: new FormControl<Emoji | null>(null),
    category: new FormControl(''),
    tags: new FormControl(''),
    tracked: new FormControl<boolean>(false),
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

  colorOptions = this.enumToKeyedOptions(Colors, (_key, val) => val);
  emojiOptions = this.enumToKeyedOptions(Emoji, (_key, val) => val);

  formField = [
    {
      label: 'CREATE_NEW_STAT.name',
      formControl: this.formGroup.controls.name,
      type: InputType.SMALL_STRING,
      isRequired: true,
    },
    {
      label: 'CREATE_NEW_STAT.input_type',
      formControl: this.formGroup.controls.inputType,
      type: InputType.SELECT_DROPDOWN,
      options: this.optionsInputType,
      addOptions: true,
      metricControl: this.metricControl,
      isRequired: true,
    },
    {
      label: 'CREATE_NEW_STAT.frequency',
      formControl: this.formGroup.controls.frequency,
      type: InputType.SELECT_DROPDOWN,
      options: this.optionsFrequency,
      isRequired: true,
    },
    {
      label: 'CREATE_NEW_STAT.time_of_day',
      formControl: this.formGroup.controls.timeOfDay,
      type: InputType.SELECT_DROPDOWN,
      options: this.optionsTimeOfDay,
      isRequired: true,
    },
    {
      label: 'CREATE_NEW_STAT.daily_entries',
      formControl: this.formGroup.controls.dailyEntries,
      type: InputType.SELECT_DROPDOWN,
      options: this.optionsDailyEntries,
      isRequired: true,
    },
    {
      label: 'CREATE_NEW_STAT.color',
      formControl: this.formGroup.controls.color,
      type: InputType.SELECT_DROPDOWN,
      options: this.colorOptions,
      colorizeOptions: true,
      isRequired: true,
    },
    {
      label: 'CREATE_NEW_STAT.icon',
      formControl: this.formGroup.controls.icon,
      type: InputType.SELECT_DROPDOWN,
      options: this.emojiOptions,
      isRequired: true,
    },
    {
      label: 'CREATE_NEW_STAT.tracked',
      formControl: this.formGroup.controls.tracked,
      type: InputType.CHECKBOX,
      infoText: 'Hide from main page',
    },
  ];
  saving = false;

  constructor(private readonly userService: UserService) {}

  ngOnInit() {
    this.userService.user$.subscribe({
      next: (detail) => {},
    });
    console.log(this.colorOptions, this.emojiOptions);
  }

  enumToKeyedOptions<T extends Record<string, string>>(
    en: T,
    getLabel?: (
      key: Extract<keyof T, string>,
      value: T[Extract<keyof T, string>],
    ) => string,
  ): Option<Extract<keyof T, string>>[] {
    const keys = Object.keys(en) as Array<Extract<keyof T, string>>;
    return keys.map((key) => ({
      label: getLabel ? getLabel(key, en[key]) : key,
      value: key,
    }));
  }

  addNewStat() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return;

    const raw = this.formGroup.getRawValue();
    const inputType = Number(raw.inputType) as InputType;
    const metric =
      inputType === InputType.NUMBER
        ? this.metricControl.value?.trim() || null
        : null;

    const newTracker: Tracker = {
      name: (raw.name || '').trim(),
      inputType: raw.inputType!,
      frequency: raw.frequency!,
      timeOfDay: raw.timeOfDay!,
      dailyEntries: raw.dailyEntries!,
      color: raw.color as Colors,
      icon: raw.icon as Emoji,
      category: (raw.category || '').trim() || null,
      tags: (raw.tags || '').trim() || null,
      tracked: !!raw.tracked,
      metric,
    } as unknown as Tracker;

    this.saving = true;
    this.userService.addHealthTracker(newTracker).subscribe({
      next: () => {
        this.saving = false;
        this.onCloseClick();
      },
      error: (err) => {
        this.saving = false;
        console.error('addHealthTracker failed', err);
      },
    });
  }

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
