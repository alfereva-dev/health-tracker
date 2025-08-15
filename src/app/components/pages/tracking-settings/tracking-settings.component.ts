import { Component, computed, inject } from '@angular/core';
import { StatsTrackerComponent } from '../../stats-tracker/stats-tracker.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Stat } from '../../../core/models/stat';
import { SelectedStatsStore } from '../../../features/stats/selected-stats.store';
import { InputType } from '../../../core/enums/input-type';
import { Frequency } from '../../../core/enums/frequency';
import { TimeOfDay } from '../../../core/enums/time-of-day';
import { DailyEntries } from '../../../core/enums/daily-entries';

const ALL_STATS: Stat[] = [
  {
    id: 1,
    name: 'Mood',
    inputType: InputType.SELECT_DROPDOWN,
    frequency: Frequency.EVERY_DAY,
    timeOfDay: TimeOfDay.ALL_DAY,
    dailyEntries: DailyEntries.FREE_ENTRY,
    color: '#fff',
    icon: 'mood',
    category: [],
    tags: [],
    privacy: false,
  },
  {
    id: 2,
    name: 'Sport',
    inputType: InputType.SELECT_DROPDOWN,
    frequency: Frequency.EVERY_DAY,
    timeOfDay: TimeOfDay.ALL_DAY,
    dailyEntries: DailyEntries.FREE_ENTRY,
    color: '#fff',
    icon: 'mood',
    category: [],
    tags: [],
    privacy: false,
  },
];

@Component({
  selector: 'app-tracking-settings',
  imports: [StatsTrackerComponent, TranslatePipe],
  templateUrl: './tracking-settings.component.html',
  styleUrl: './tracking-settings.component.css',
})
export class TrackingSettingsComponent {
  private readonly store = inject(SelectedStatsStore);
  readonly selectedList = computed(() =>
    ALL_STATS.filter((s) => this.store.has(s.id)),
  );
  readonly unselectedList = computed(() =>
    ALL_STATS.filter((s) => !this.store.has(s.id)),
  );

  ngOnInit() {
    this.store.initFromStorage();
  }

  select(id: number) {
    this.store.select(id);
  }

  unselect(id: number) {
    this.store.unselect(id);
  }

  save() {
    this.store.saveToStorage();
  }
}
