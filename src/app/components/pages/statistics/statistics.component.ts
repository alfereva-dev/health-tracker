import { Component, computed, signal } from '@angular/core';
import { StatsTrackerComponent } from '../../stats-tracker/stats-tracker.component';
import { StatsChartComponent } from '../../stats-chart/stats-chart.component';
import { FormControl, FormGroup } from '@angular/forms';
import { InputType } from '../../../core/enums/input-type';
import { FormFieldComponent } from '../../form-field/form-field.component';
import { TranslateModule } from '@ngx-translate/core';
import { MockUsers } from '../../../../assets/mock/user';
import { buildMonthSummary } from '../../../features/utils/build-month-summary';
import {
  HabitCardComponent,
  HabitCardData,
} from '../../habit-card/habit-card.component';
import { Entry, parseLocalDate } from '../../../core/models/tracker.model';
import { TimeOfDay } from '../../../core/enums/time-of-day';

@Component({
  selector: 'app-statistics',
  imports: [
    StatsTrackerComponent,
    StatsChartComponent,
    FormFieldComponent,
    TranslateModule,
    HabitCardComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent {
  openFilter = true;
  openHeatmap = true;
  openCards = true;
  groupFilters = new FormGroup({
    filterBy: new FormControl<'categories' | 'tags' | 'time' | 'all'>('all'),
  });
  filtersFF = [
    { type: InputType.RADIO, value: 'categories', label: 'FILTER.categories' },
    { type: InputType.RADIO, value: 'tags', label: 'FILTER.tags' },
    { type: InputType.RADIO, value: 'time', label: 'FILTER.time_of_day' },
    { type: InputType.RADIO, value: 'all', label: 'FILTER.all' },
  ] as const;
  private readonly user = MockUsers[0];
  readonly month = signal(new Date());

  readonly days = computed(() =>
    buildMonthSummary(
      this.user.healthTracker.map((t) => ({
        id: t.id,
        name: t.name,
        emoji: t.emoji,
        entries: (t as any).entries ?? [],
      })),
      this.month(),
    ),
  );

  readonly habits = computed<HabitCardData[]>(() => {
    const m = this.month();

    return this.user.healthTracker.map((t) => {
      const entries = ((t as any).entries as Entry[]) ?? [];

      const lastEntry = entries.reduce<Entry | null>(
        (acc, cur) => (!acc || acc.date < cur.date ? cur : acc),
        null,
      );
      const lastDay = lastEntry ? parseLocalDate(lastEntry.date) : null;

      const daysInMonth = new Date(
        m.getFullYear(),
        m.getMonth() + 1,
        0,
      ).getDate();
      const daysDone = new Set<number>();
      for (const e of entries) {
        const d = parseLocalDate(e.date);
        if (
          d.getFullYear() === m.getFullYear() &&
          d.getMonth() === m.getMonth()
        ) {
          daysDone.add(d.getDate());
        }
      }

      return {
        id: t.id,
        name: t.name,
        emoji: t.emoji,
        series: 0,
        lastDay,
        completion: daysInMonth ? daysDone.size / daysInMonth : 0,
      };
    });
  });

  onPeriodChange(e: { date: Date; range: 'week' | 'month' | 'year' }) {
    this.month.set(e.date);
  }

  get currentFilterBy() {
    return this.groupFilters.controls.filterBy.value ?? 'all';
  }

  onChartFilters(e: {
    filterBy: 'categories' | 'tags' | 'time' | 'all';
    value: number | TimeOfDay | null;
  }) {}

  changeIcons(isOpen: boolean, icons?: { open: string; close: string }) {
    const defaults = {
      open: 'assets/icons/action/close.svg',
      close: 'assets/icons/action/open.svg',
    };

    const used = icons ?? defaults;

    return isOpen ? used.open : used.close;
  }

  toggleBlock(key: 'openFilter' | 'openHeatmap' | 'openCards') {
    this[key] = !this[key];
  }
}
