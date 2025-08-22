import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {
  addMonths,
  addWeeks,
  addYears,
  endOfMonth,
  endOfWeek,
  endOfYear,
  isSameMonth,
  isSameWeek,
  isSameYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import 'chartjs-adapter-date-fns';
import { TranslateModule } from '@ngx-translate/core';
import { MockUsers } from '../../../assets/mock/user';
import { TimeOfDay } from '../../core/enums/time-of-day';

Chart.register(...registerables);

type XY = { x: Date; y: number };
type Entry = { date: string; value: number };
type Tag = { id: number; name: string };
type Category = { id: number; name: string };
type TimeOption = { value: TimeOfDay; label: string };
type FilterBy = 'categories' | 'tags' | 'time' | 'all';

@Component({
  selector: 'app-stats-chart',
  standalone: true,
  imports: [BaseChartDirective, TranslateModule],
  templateUrl: './stats-chart.component.html',
  styleUrls: ['./stats-chart.component.css'],
})
export class StatsChartComponent {
  cursor = signal(new Date());
  @Output() filters = new EventEmitter<{
    filterBy: FilterBy;
    value: number | TimeOfDay | null;
  }>();
  @Output() periodChange = new EventEmitter<{
    date: Date;
    range: 'week' | 'month' | 'year';
  }>();

  private readonly _filterBy = signal<FilterBy>('all');
  @Input() set filterBy(value: FilterBy) {
    this._filterBy.set(value);
    this.selectedTime.set(null);
    this.selectedTagId.set(null);
    this.selectedCategoryId.set(null);
    this.emitFilters();
    this.ensureSelectionFits();
  }

  private readonly user = MockUsers[0];
  private readonly maxSelected = 2;
  readonly trackers = this.user.healthTracker.map((t) => ({
    id: t.id,
    name: t.name,
    color: String(t.color),
    emoji: String(t.emoji),
    entries: (t as { entries?: Entry[] }).entries ?? [],
    timeOfDay: t.timeOfDay,
    tags: (t.tags ?? []) as Tag[],
    category: (t.category ?? []) as Category[],
  }));

  selected = signal<Set<number>>(new Set([this.trackers[0]?.id]));
  order = signal<number[]>([this.trackers[0]?.id].filter((v) => v != null));
  range = signal<'week' | 'month' | 'year'>('week');
  selectedTime = signal<TimeOfDay | null>(null);
  selectedTagId = signal<number | null>(null);
  selectedCategoryId = signal<number | null>(null);

  readonly allTags: Tag[] = Array.from(
    new Map(
      this.trackers.flatMap((t) => t.tags).map((x) => [x.id, x]),
    ).values(),
  );
  readonly allCategories: Category[] = Array.from(
    new Map(
      this.trackers.flatMap((t) => t.category).map((x) => [x.id, x]),
    ).values(),
  );
  readonly timeOptions: ReadonlyArray<TimeOption> = [
    { value: TimeOfDay.MORNING, label: 'PERIODICITY.morning' },
    { value: TimeOfDay.AFTERNOON, label: 'PERIODICITY.afternoon' },
    { value: TimeOfDay.EVENING, label: 'PERIODICITY.evening' },
    { value: TimeOfDay.NIGHT, label: 'PERIODICITY.night' },
    { value: TimeOfDay.ALL_DAY, label: 'PERIODICITY.all_day' },
    { value: TimeOfDay.CUSTOM_TIME, label: 'PERIODICITY.custom_time' },
  ];

  readonly filteredTrackers = computed(() => {
    const td = this.selectedTime();
    const tagId = this.selectedTagId();
    const catId = this.selectedCategoryId();
    switch (this._filterBy()) {
      case 'time': {
        return td == null
          ? []
          : this.trackers.filter((t) => t.timeOfDay === td);
      }
      case 'tags': {
        return tagId == null
          ? []
          : this.trackers.filter((t) => t.tags.some((tg) => tg.id === tagId));
      }
      case 'categories': {
        return catId == null
          ? []
          : this.trackers.filter((t) => t.category.some((c) => c.id === catId));
      }
      default:
        return this.trackers;
    }
  });

  readonly datasets = computed(() =>
    this.trackers.map((t) => ({
      label: t.name,
      data: t.entries.map((e) => ({ x: new Date(e.date), y: e.value })) as XY[],
      borderColor: t.color,
      backgroundColor: t.color + '33',
      pointBackgroundColor: t.color,
      pointBorderColor: t.color,
      borderWidth: 3,
      pointRadius: 3,
      tension: 0.3,
      fill: false,
      hidden: !this.selected().has(t.id),
    })),
  );

  readonly options = computed<ChartConfiguration<'line'>['options']>(() => {
    const ref = this.cursor();
    let min: Date, max: Date, unit: 'day' | 'month';

    switch (this.range()) {
      case 'week':
        min = startOfWeek(ref, { weekStartsOn: 1 });
        max = endOfWeek(ref, { weekStartsOn: 1 });
        unit = 'day';
        break;
      case 'year':
        min = startOfYear(ref);
        max = endOfYear(ref);
        unit = 'month';
        break;
      default:
        min = startOfMonth(ref);
        max = endOfMonth(ref);
        unit = 'day';
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      parsing: false,
      scales: {
        x: {
          type: 'time',
          time: { unit },
          min: min.toISOString(),
          max: max.toISOString(),
        },
        y: { beginAtZero: true, grace: '5%' },
      },
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'nearest', intersect: false },
      },
    };
  });

  toggle(id: number) {
    const s = new Set(this.selected());
    const ord = [...this.order()];

    if (s.has(id)) {
      if (s.size === 1) return;
      s.delete(id);
      this.selected.set(s);
      this.order.set(ord.filter((x) => x !== id));
      return;
    }

    if (s.size >= this.maxSelected) {
      const first = ord[0];
      s.delete(first);
      ord.shift();
    }

    s.add(id);
    ord.push(id);
    this.selected.set(s);
    this.order.set(ord);
  }

  pickTime(td: TimeOption) {
    const next = this.selectedTime() === td.value ? null : td.value;
    this.selectedTime.set(next);
    this.emitFilters();
    this.ensureSelectionFits();
  }

  pickTag(id: number) {
    this.selectedTagId.set(this.selectedTagId() === id ? null : id);
    this.emitFilters();
    this.ensureSelectionFits();
  }

  pickCategory(id: number) {
    this.selectedCategoryId.set(this.selectedCategoryId() === id ? null : id);
    this.emitFilters();
    this.ensureSelectionFits();
  }

  private ensureSelectionFits() {
    const allowed = new Set(this.filteredTrackers().map((t) => t.id));
    if (this._filterBy() === 'all') return;
    const current = this.selected();
    const hasIntersection = Array.from(current).some((id) => allowed.has(id));
    if (!hasIntersection) {
      const first = this.filteredTrackers()[0]?.id;
      if (first != null) {
        this.selected.set(new Set([first]));
        this.order.set([first]);
      } else {
        this.selected.set(new Set());
        this.order.set([]);
      }
    }
  }

  private emitFilters() {
    switch (this._filterBy()) {
      case 'time':
        this.filters.emit({ filterBy: 'time', value: this.selectedTime() });
        break;
      case 'tags':
        this.filters.emit({ filterBy: 'tags', value: this.selectedTagId() });
        break;
      case 'categories':
        this.filters.emit({
          filterBy: 'categories',
          value: this.selectedCategoryId(),
        });
        break;
      default:
        this.filters.emit({ filterBy: 'all', value: null });
    }
  }

  get filterBy(): FilterBy {
    return this._filterBy();
  }

  shift(delta: number) {
    const cur = this.cursor();
    switch (this.range()) {
      case 'week':
        this.cursor.set(addWeeks(cur, delta));
        break;
      case 'year':
        this.cursor.set(addYears(cur, delta));
        break;
      default:
        this.cursor.set(addMonths(cur, delta));
    }
  }

  today() {
    this.cursor.set(new Date());
  }

  isToday(): boolean {
    const cur = this.cursor();
    const now = new Date();
    switch (this.range()) {
      case 'week':
        return isSameWeek(cur, now);
      case 'year':
        return isSameYear(cur, now);
      default:
        return isSameMonth(cur, now);
    }
  }
}
