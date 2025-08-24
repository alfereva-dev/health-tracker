import { Component, computed, inject, input, Input } from '@angular/core';
import {
  OptionsInputType,
  StatEntry,
  Tracker,
} from '../../../core/models/tracker';
import { StatsDefault } from '../../../../assets/mock/default-stats';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { FormFieldComponent } from '../../ui/form-field/form-field.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../core/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { InputType } from '../../../core/enums/input-type';
import { FormControl } from '@angular/forms';

type FormFieldDef<T = any> = {
  id: number;
  label: string;
  formControl: FormControl<T>;
  type: InputType;
  options?: Array<{ label: string; value: any }>;
  colorizeOptions?: boolean;
  enumRef?: Record<string, string>;
  translateOptions?: boolean;
};

@Component({
  selector: 'app-stats-tracker',
  imports: [FormFieldComponent, CdkDrag, CdkDropList, TranslateModule],
  templateUrl: './stats-tracker.component.html',
  styleUrl: './stats-tracker.component.css',
})
export class StatsTrackerComponent {
  @Input() stats: Tracker[] | null = null;
  @Input() editable = false;
  date = input<string | null>(null);
  currentsStats: Tracker[] = [];
  private readonly userService = inject(UserService);

  ngOnInit() {
    this.currentsStats =
      this.stats && this.stats.length > 0 ? [...this.stats] : StatsDefault;
  }

  readonly trackers = toSignal(
    this.userService.user$.pipe(
      map((u) => u?.healthTracker ?? ([] as Tracker[])),
    ),
    { initialValue: [] as Tracker[] },
  );

  private readonly source = computed<Tracker[]>(() => {
    const fromInput = this.stats?.length ? this.stats : null;
    return fromInput ?? this.trackers();
  });

  private readonly visible = computed<Tracker[]>(() =>
    this.source().filter((t) => t.tracked),
  );

  readonly effectiveDate = computed(() => this.date() ?? this.todayLocalISO());

  readonly fieldVM = computed<FormFieldDef[]>(() => {
    const selectedDate = this.effectiveDate();
    return this.visible().map((t) => this.toFieldDef(t, selectedDate));
  });

  private entryValueForDate(
    t: Tracker,
    d: string | null,
  ): StatEntry['value'] | null {
    if (!d) return null;
    const e = (t.entries ?? []).find((x) => x.date === d);
    return e ? e.value : null;
  }

  private toFieldDef(t: Tracker, selectedDate: string | null): FormFieldDef {
    const entryVal = this.entryValueForDate(t, selectedDate);

    switch (t.inputType) {
      case InputType.NUMBER:
      case InputType.SLIDER:
      case InputType.EMOJI_SCALE:
        return {
          id: t.id,
          label: t.emoji + t.name,
          formControl: new FormControl<number | null>(
            typeof entryVal === 'number' ? entryVal : null,
          ),
          type: t.inputType,
        };

      case InputType.TEXT:
        return {
          id: t.id,
          label: t.emoji + t.name,
          formControl: new FormControl<string>(
            typeof entryVal === 'string' ? entryVal : '',
          ),
          type: t.inputType,
        };

      case InputType.CHECKBOX:
        return {
          id: t.id,
          label: t.emoji + t.name,
          formControl: new FormControl<boolean>(
            typeof entryVal === 'boolean' ? entryVal : false,
          ),
          type: t.inputType,
        };

      case InputType.SELECT_DROPDOWN: {
        const opts = (t.options ?? []).map(this.mapOption);
        const init: string | null =
          typeof entryVal === 'string' ? entryVal : null;

        return {
          id: t.id,
          label: t.emoji + t.name,
          formControl: new FormControl<string | null>(init),
          type: t.inputType,
          options: opts,
        };
      }

      case InputType.MULTIPLE_CHOICE: {
        const opts = (t.options ?? []).map(this.mapOption);
        const init: string[] = this.isStringArray(entryVal) ? entryVal : [];

        return {
          id: t.id,
          label: t.emoji + t.name,
          formControl: new FormControl<string[]>(init),
          type: t.inputType,
          options: opts,
        };
      }

      default:
        return {
          id: t.id,
          label: t.emoji + t.name,
          formControl: new FormControl<string>(''),
          type: InputType.TEXT,
        };
    }
  }

  isStringArray(x: unknown): x is string[] {
    return Array.isArray(x) && x.every((v) => typeof v === 'string');
  }

  private mapOption(o: OptionsInputType): { label: string; value: string } {
    return { label: String(o.value), value: String(o.value) };
  }

  saveAllForDate(date: string) {
    for (const field of this.fieldVM()) {
      const val = field.formControl.value;
      if (
        val === null ||
        val === undefined ||
        (typeof val === 'string' && val.trim() === '') ||
        (Array.isArray(val) && val.length === 0)
      )
        continue;

      this.userService.upsertEntry(field.id, { date, value: val }).subscribe();
    }
  }

  saveAll() {
    const d = this.effectiveDate() ?? this.todayLocalISO();
    this.saveAllForDate(d);
  }

  private todayLocalISO(): string {
    const d = new Date();
    const tz = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tz * 60000);
    return local.toISOString().slice(0, 10);
  }

  get formattedDate(): string {
    return this.displayDate();
  }

  readonly displayDate = computed(() => {
    const iso = this.effectiveDate() ?? this.todayLocalISO();
    const [y, m, d] = iso.split('-');
    return `${d}.${m}.${y}`;
  });
}
