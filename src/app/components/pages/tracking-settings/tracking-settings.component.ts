import { Component, computed, inject, signal } from '@angular/core';
import { StatsTrackerComponent } from '../../stats-tracker/stats-tracker.component';
import { TranslateModule } from '@ngx-translate/core';
import { Stat } from '../../../core/models/stat';
import { SelectedStatsStore } from '../../../features/stats/selected-stats.store';
import { InputType } from '../../../core/enums/input-type';
import { Frequency } from '../../../core/enums/frequency';
import { TimeOfDay } from '../../../core/enums/time-of-day';
import { DailyEntries } from '../../../core/enums/daily-entries';
import { CreateNewStatComponent } from '../../create-new-stat/create-new-stat.component';
import { Colors } from '../../../core/enums/colors';
import { Emoji } from '../../../core/enums/emoji';

const ALL_STATS: Stat[] = [
  {
    id: 1,
    name: 'Mood',
    inputType: InputType.SELECT_DROPDOWN,
    frequency: Frequency.EVERY_DAY,
    timeOfDay: TimeOfDay.ALL_DAY,
    dailyEntries: DailyEntries.FREE_ENTRY,
    color: Colors.PINK,
    emoji: Emoji.SMILE,
    category: [],
    tags: [],
    privacy: false,
    entries: [],
  },
  {
    id: 2,
    name: 'Sport',
    inputType: InputType.SELECT_DROPDOWN,
    frequency: Frequency.EVERY_DAY,
    timeOfDay: TimeOfDay.ALL_DAY,
    dailyEntries: DailyEntries.FREE_ENTRY,
    color: Colors.DARK_ORANGE,
    emoji: Emoji.BLUE_SQUARE,
    category: [],
    tags: [],
    privacy: false,
    entries: [],
  },
];

@Component({
  selector: 'app-tracking-settings',
  standalone: true,
  imports: [StatsTrackerComponent, TranslateModule, CreateNewStatComponent],
  templateUrl: './tracking-settings.component.html',
  styleUrl: './tracking-settings.component.css',
})
export class TrackingSettingsComponent {
  private readonly store = inject(SelectedStatsStore);

  private readonly selectedIds = this.store.selectedIds;

  readonly selectedList = computed(() => {
    const idSet = new Set(this.selectedIds());
    return ALL_STATS.filter((s) => idSet.has(s.id));
  });

  readonly unselectedList = computed(() => {
    const idSet = new Set(this.selectedIds());
    return ALL_STATS.filter((s) => !idSet.has(s.id));
  });

  isCreateOpen = signal(false);

  select(id: number) {
    this.store.select(id);
  }

  unselect(id: number) {
    this.store.unselect(id);
  }

  save() {
    this.store.saveToStorage();
  }

  createNewStat() {
    this.isCreateOpen.set(true);
  }

  closeCreate() {
    this.isCreateOpen.set(false);
  }
}
